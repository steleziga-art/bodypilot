import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "USDA API key is missing." },
      { status: 500 }
    );
  }

  try {
    const url =
      `https://api.nal.usda.gov/fdc/v1/foods/search` +
      `?api_key=${apiKey}` +
      `&query=${encodeURIComponent(query)}` +
      `&pageSize=10`;

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "USDA request failed." },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}