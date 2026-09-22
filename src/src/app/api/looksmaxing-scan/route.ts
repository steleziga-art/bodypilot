import { NextRequest, NextResponse } from "next/server";

type OpenAIResponse = { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }>; error?: { message?: string } };
function extractText(data: OpenAIResponse) {
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text;
  for (const item of data.output ?? []) for (const content of item.content ?? []) if (content.text?.trim()) return content.text;
  return "";
}

export async function POST(request: NextRequest) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ error: "AI Looks Scan needs OPENAI_API_KEY in your server environment." }, { status: 503 });
    const body = await request.json() as { imageData?: string; focus?: string[] };
    if (!body.imageData?.startsWith("data:image/")) return NextResponse.json({ error: "A valid photo is required." }, { status: 400 });
    const model = process.env.MUCIPES_LOOKS_MODEL || process.env.MUCIPES_AI_MODEL || "gpt-5.6-terra";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        store: false,
        text: { verbosity: "low", format: { type: "json_schema", name: "mucipes_looks_scan", strict: true, schema: { type: "object", additionalProperties: false, properties: { observations: { type: "array", maxItems: 5, items: { type: "string" } }, suggestions: { type: "array", maxItems: 5, items: { type: "string" } }, note: { type: "string" } }, required: ["observations", "suggestions", "note"] } } },
        input: [{ role: "user", content: [
          { type: "input_text", text: `Give practical appearance-presentation feedback from this image. Focus only on visible and changeable presentation factors such as grooming, hair styling, posture, clothing presentation, and non-medical skin-care habits. Do not rate attractiveness, infer identity or protected traits, diagnose conditions, or make claims about health. Be respectful, specific, conservative and useful. User-selected focus: ${(body.focus || []).join(", ") || "general"}.` },
          { type: "input_image", image_url: body.imageData, detail: "high" }
        ] }]
      })
    });
    const data = await response.json() as OpenAIResponse;
    if (!response.ok) return NextResponse.json({ error: data.error?.message || "AI Looks Scan request failed." }, { status: response.status });
    const text = extractText(data); if (!text) return NextResponse.json({ error: "AI Looks Scan returned no result." }, { status: 502 });
    try { return NextResponse.json(JSON.parse(text)); } catch { return NextResponse.json({ error: "AI Looks Scan returned an invalid result." }, { status: 502 }); }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Looks Scan failed." }, { status: 500 });
  }
}
