import { NextRequest, NextResponse } from "next/server";

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
  error?: { message?: string };
};

function extractText(data: OpenAIResponse) {
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text;
  for (const item of data.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === "string" && content.text.trim()) return content.text;
    }
  }
  return "";
}

export async function POST(request: NextRequest) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "AI Meal Scan needs OPENAI_API_KEY in your server environment." },
        { status: 503 }
      );
    }

    const body = (await request.json()) as { imageData?: string };
    const imageData = body.imageData?.trim();
    if (!imageData || !imageData.startsWith("data:image/")) {
      return NextResponse.json({ error: "A valid meal photo is required." }, { status: 400 });
    }
    if (imageData.length > 12_000_000) {
      return NextResponse.json({ error: "Image is too large. Try another photo." }, { status: 413 });
    }

    // Terra is a better default for the visual estimation task while still being much
    // cheaper than the flagship tier. Override it with MUCIPES_MEAL_MODEL if desired.
    const model = process.env.MUCIPES_MEAL_MODEL || process.env.MUCIPES_AI_MODEL || "gpt-5.6-terra";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        store: false,
        text: {
          verbosity: "low",
          format: {
            type: "json_schema",
            name: "mucipes_meal_scan",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                items: {
                  type: "array",
                  maxItems: 12,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      name: { type: "string" },
                      grams: { type: "number", minimum: 0 },
                      caloriesPer100: { type: "number", minimum: 0 },
                      proteinPer100: { type: "number", minimum: 0 },
                      carbsPer100: { type: "number", minimum: 0 },
                      fatPer100: { type: "number", minimum: 0 },
                      confidence: { type: "number", minimum: 0, maximum: 1 },
                    },
                    required: [
                      "name",
                      "grams",
                      "caloriesPer100",
                      "proteinPer100",
                      "carbsPer100",
                      "fatPer100",
                      "confidence",
                    ],
                  },
                },
                note: { type: "string" },
              },
              required: ["items", "note"],
            },
          },
        },
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Analyze this meal photo for a nutrition-tracking estimate. Identify only visible edible foods. Estimate realistic edible portion grams and plausible nutrition per 100 g. Separate clearly distinct foods when useful, but do not pretend hidden ingredients are certain. Treat sauces, oils and drinks as items only when visibly present or strongly evident. Confidence is your confidence in the item identity and portion estimate, from 0 to 1. The user will review the result before logging it, so be useful but conservative and do not imply precision.",
              },
              { type: "input_image", image_url: imageData, detail: "high" },
            ],
          },
        ],
      }),
    });

    const data = (await response.json()) as OpenAIResponse;
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "AI meal scan request failed." },
        { status: response.status }
      );
    }

    const text = extractText(data);
    if (!text) return NextResponse.json({ error: "AI meal scan returned no result." }, { status: 502 });

    let parsed: { items?: unknown[]; note?: string };
    try {
      parsed = JSON.parse(text) as { items?: unknown[]; note?: string };
    } catch {
      return NextResponse.json({ error: "AI meal scan returned an invalid result." }, { status: 502 });
    }

    return NextResponse.json({
      items: Array.isArray(parsed.items) ? parsed.items.slice(0, 12) : [],
      note: typeof parsed.note === "string" ? parsed.note : "Review estimated portions before logging.",
    });
  } catch (error) {
    console.error("Mucipes meal scan error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Meal scan failed." },
      { status: 500 }
    );
  }
}
