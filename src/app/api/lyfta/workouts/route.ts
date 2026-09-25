import { NextRequest, NextResponse } from "next/server";

const LYFTA_WORKOUTS_URL = "https://my.lyfta.app/api/v1/workouts";

export async function GET(request: NextRequest) {
  const apiKey = process.env.LYFTA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "LYFTA_API_KEY is not configured on the server." }, { status: 500 });
  }

  try {
    const from = request.nextUrl.searchParams.get("from");
    const to = request.nextUrl.searchParams.get("to");
    const workouts: unknown[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const upstream = new URL(LYFTA_WORKOUTS_URL);
      upstream.searchParams.set("limit", "100");
      upstream.searchParams.set("page", String(page));
      if (from) upstream.searchParams.set("from", from);
      if (to) upstream.searchParams.set("to", to);

      const response = await fetch(upstream, {
        headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
        cache: "no-store",
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        return NextResponse.json(
          { error: body?.message || body?.error || `Lyfta returned ${response.status}.` },
          { status: response.status }
        );
      }
      if (Array.isArray(body?.workouts)) workouts.push(...body.workouts);
      totalPages = Math.max(1, Number(body?.total_pages) || 1);
      page += 1;
    } while (page <= totalPages);

    return NextResponse.json(
      { status: true, count: workouts.length, workouts },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "Could not reach Lyfta." }, { status: 502 });
  }
}
