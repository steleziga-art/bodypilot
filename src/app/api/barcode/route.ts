import { NextResponse } from "next/server";

type OFFNutriments = {
  ["energy-kcal_100g"]?: number;
  ["energy-kj_100g"]?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  fat_100g?: number;
};

type OFFProduct = {
  code?: string;
  product_name?: string;
  brands?: string;
  quantity?: string;
  serving_size?: string;
  image_front_small_url?: string;
  nutriments?: OFFNutriments;
};

type OFFResponse = {
  product?: OFFProduct;
};

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const barcode = searchParams.get("code")?.trim();

  if (!barcode) {
    return NextResponse.json(
      { error: "Barcode is required." },
      { status: 400 }
    );
  }

  if (!/^\d{8,14}$/.test(barcode)) {
    return NextResponse.json(
      { error: "Invalid barcode." },
      { status: 400 }
    );
  }

  try {
    const fields = [
      "code",
      "product_name",
      "brands",
      "quantity",
      "serving_size",
      "image_front_small_url",
      "nutriments",
    ].join(",");

    const url =
      `https://world.openfoodfacts.org/api/v3/product/` +
      `${encodeURIComponent(barcode)}` +
      `?fields=${encodeURIComponent(fields)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "CYG/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const data: OFFResponse = await response.json();

    if (!data.product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const product = data.product;
    const nutrients = product.nutriments ?? {};

    let calories = numberOrNull(
      nutrients["energy-kcal_100g"]
    );

    const energyKj = numberOrNull(
      nutrients["energy-kj_100g"]
    );

    // If kcal is missing but kJ exists, convert kJ -> kcal.
    if (calories === null && energyKj !== null) {
      calories = energyKj / 4.184;
    }

    const protein = numberOrNull(
      nutrients.proteins_100g
    );

    const carbs = numberOrNull(
      nutrients.carbohydrates_100g
    );

    const fat = numberOrNull(
      nutrients.fat_100g
    );

    const availableNutritionCount = [
      calories,
      protein,
      carbs,
      fat,
    ].filter((value) => value !== null).length;

    // Product is not useful for BodyPilot if none of the
    // main nutrition values are available.
    if (availableNutritionCount === 0) {
      return NextResponse.json(
        {
          error:
            "Product found, but no nutrition data is available.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      source: "Open Food Facts",

      barcode: product.code ?? barcode,

      name:
        product.product_name?.trim() ||
        "Unknown product",

      brand:
        product.brands?.trim() || "",

      quantity:
        product.quantity?.trim() || "",

      servingSize:
        product.serving_size?.trim() || "",

      image:
        product.image_front_small_url || "",

      nutritionPer100g: {
        calories:
          calories !== null
            ? Math.round(calories * 10) / 10
            : null,

        protein:
          protein !== null
            ? Math.round(protein * 10) / 10
            : null,

        carbs:
          carbs !== null
            ? Math.round(carbs * 10) / 10
            : null,

        fat:
          fat !== null
            ? Math.round(fat * 10) / 10
            : null,
      },

      nutritionComplete:
        calories !== null &&
        protein !== null &&
        carbs !== null &&
        fat !== null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Could not connect to Open Food Facts.",
      },
      { status: 500 }
    );
  }
}