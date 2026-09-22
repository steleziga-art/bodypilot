import { NextRequest, NextResponse } from "next/server";

type OpenAIResponse = { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }>; error?: { message?: string } };
function outputText(data: OpenAIResponse) {
  if (data.output_text) return data.output_text;
  for (const item of data.output || []) for (const content of item.content || []) if (content.text) return content.text;
  return "";
}

export async function POST(request: NextRequest) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ error: "AI key is not configured." }, { status: 503 });
    const body = await request.json() as { question?: string; context?: unknown };
    if (!body.question?.trim()) return NextResponse.json({ error: "Question is required." }, { status: 400 });
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.MUCIPES_AI_MODEL || "gpt-5.6-luna",
        store: false,
        text: { verbosity: "low" },
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `You are Mucipes Coach inside a fitness tracking app. Answer from the user's supplied logged data. Be concise, practical, and explicit about uncertainty. Do not diagnose disease or present estimates as medical facts. Never silently change targets; frame adjustments as options the user can choose.\n\nQUESTION:\n${body.question}\n\nLOGGED CONTEXT:\n${JSON.stringify(body.context).slice(0, 60000)}`,
              },
            ],
          },
        ],
      }),
    });
    const data = await response.json() as OpenAIResponse;
    if (!response.ok) return NextResponse.json({ error: data.error?.message || "Coach request failed." }, { status: response.status });
    const answer = outputText(data).trim();
    if (!answer) return NextResponse.json({ error: "Coach returned no answer." }, { status: 502 });
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Mucipes coach error:", error);
    return NextResponse.json({ error: "Coach failed." }, { status: 500 });
  }
}
