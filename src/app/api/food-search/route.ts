import { NextResponse } from "next/server";

/* =========================
   TYPES
========================= */

type Nutrient = {
  nutrientId?: number;
  nutrientName?: string;
  nutrientNumber?: string;
  unitName?: string;
  value?: number;
};

type USDAFood = {
  fdcId: number;
  description: string;
  dataType?: string;
  brandName?: string;
  brandOwner?: string;
  foodNutrients?: Nutrient[];
};

type USDAResponse = {
  foods?: USDAFood[];
};

type OFFProduct = {
  code?: string;
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  countries_tags?: string[];
  nutriments?: {
    ["energy-kcal_100g"]?: number;
    ["energy-kj_100g"]?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
};

type OFFResponse = {
  products?: OFFProduct[];
};

type BodyPilotFood = {
  fdcId: number;
  description: string;
  brandName?: string;
  brandOwner?: string;
  dataType?: string;
  foodNutrients: Nutrient[];

  // New BodyPilot metadata
  source: "USDA" | "Open Food Facts";
  barcode?: string;
  european?: boolean;
};

/* =========================
   HELPERS
========================= */

function normalize(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function safeNumber(value: unknown): number | null {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : null;
}

/* =========================
   SLOVENIAN SEARCH
========================= */

const SEARCH_TRANSLATIONS: Record<string, string> = {
  "piščanec": "chicken",
  "piscanec": "chicken",

  "piščančje prsi": "chicken breast",
  "piscancje prsi": "chicken breast",

  "piščančji file": "chicken breast",
  "piscancji file": "chicken breast",

  "riž": "rice",
  "riz": "rice",

  "basmati riž": "basmati rice",
  "basmati riz": "basmati rice",

  "jajce": "egg",
  "jajca": "eggs",

  "ovseni kosmiči": "oats",
  "ovseni kosmici": "oats",
  "oves": "oats",

  "krompir": "potato",
  "sladki krompir": "sweet potato",

  "banana": "banana",
  "banane": "banana",

  "jabolko": "apple",
  "jabolka": "apple",

  "jagode": "strawberries",
  "borovnice": "blueberries",
  "maline": "raspberries",

  "mleko": "milk",

  "jogurt": "yogurt",

  "grški jogurt": "greek yogurt",
  "grski jogurt": "greek yogurt",

  "skuta": "cottage cheese",

  "govedina": "beef",

  "mleto meso": "ground beef",
  "mleta govedina": "ground beef",

  "puran": "turkey",
  "puranje prsi": "turkey breast",

  "losos": "salmon",
  "tuna": "tuna",

  "testenine": "pasta",
  "makaroni": "pasta",

  "kruh": "bread",
  "toast": "toast bread",

  "sir": "cheese",

  "brokoli": "broccoli",

  "špinača": "spinach",
  "spinaca": "spinach",

  "avokado": "avocado",

  "arašidovo maslo": "peanut butter",
  "arasidovo maslo": "peanut butter",

  "olivno olje": "olive oil",
};

function translateQuery(query: string) {
  const normalized = normalize(query);

  for (const [slovenian, english] of Object.entries(
    SEARCH_TRANSLATIONS
  )) {
    if (normalize(slovenian) === normalized) {
      return english;
    }
  }

  return query.trim();
}

/* =========================
   NUTRIENTS
========================= */

function getNutrient(
  food: BodyPilotFood,
  names: string[]
): number | null {
  const nutrient = food.foodNutrients?.find((item) => {
    const nutrientName = normalize(
      item.nutrientName ?? ""
    );

    return names.some(
      (name) =>
        nutrientName === normalize(name)
    );
  });

  return safeNumber(nutrient?.value);
}

function getCalories(
  food: BodyPilotFood
): number | null {
  const nutrient = food.foodNutrients?.find((item) => {
    const name = normalize(
      item.nutrientName ?? ""
    );

    return (
      name === "energy" ||
      name.includes("energy (atwater")
    );
  });

  return safeNumber(nutrient?.value);
}

function hasUsefulNutrition(
  food: BodyPilotFood
) {
  const values = [
    getCalories(food),

    getNutrient(food, [
      "Protein",
    ]),

    getNutrient(food, [
      "Carbohydrate, by difference",
    ]),

    getNutrient(food, [
      "Total lipid (fat)",
    ]),
  ];

  const available =
    values.filter(
      (value) => value !== null
    ).length;

  return (
    getCalories(food) !== null &&
    available >= 2
  );
}

/* =========================
   USDA CONVERSION
========================= */

function convertUSDAFood(
  food: USDAFood
): BodyPilotFood {
  return {
    ...food,

    foodNutrients:
      food.foodNutrients ?? [],

    source: "USDA",

    european: false,
  };
}

/* =========================
   OPEN FOOD FACTS CONVERSION
========================= */

function convertOFFProduct(
  product: OFFProduct,
  index: number
): BodyPilotFood | null {
  const name =
    product.product_name?.trim() ||
    product.product_name_en?.trim();

  if (!name) {
    return null;
  }

  const nutrients =
    product.nutriments ?? {};

  let calories = safeNumber(
    nutrients["energy-kcal_100g"]
  );

  const kj = safeNumber(
    nutrients["energy-kj_100g"]
  );

  if (
    calories === null &&
    kj !== null
  ) {
    calories = kj / 4.184;
  }

  const protein = safeNumber(
    nutrients.proteins_100g
  );

  const carbs = safeNumber(
    nutrients.carbohydrates_100g
  );

  const fat = safeNumber(
    nutrients.fat_100g
  );

  const barcode =
    product.code ?? "";

  /*
    FoodSearch.tsx currently expects a numeric fdcId.

    OFF barcodes can be too large to safely use as
    JavaScript integers, so BodyPilot creates its
    own negative ID.
  */
  const generatedId =
    -(
      100000000 +
      index +
      Math.floor(
        Math.random() * 100000
      )
    );

  const countries =
    product.countries_tags ?? [];

  const european =
    countries.some((country) =>
      [
        "en:slovenia",
        "en:austria",
        "en:italy",
        "en:germany",
        "en:croatia",
        "en:france",
        "en:spain",
        "en:netherlands",
        "en:belgium",
        "en:poland",
        "en:czech-republic",
        "en:hungary",
      ].includes(country)
    );

  return {
    fdcId: generatedId,

    description: name,

    brandName:
      product.brands?.trim() || "",

    brandOwner:
      product.brands?.trim() || "",

    dataType: "Branded",

    source: "Open Food Facts",

    barcode,

    european,

    foodNutrients: [
      {
        nutrientName: "Energy",
        unitName: "KCAL",
        value:
          calories !== null
            ? Math.round(calories * 10) / 10
            : undefined,
      },

      {
        nutrientName: "Protein",
        unitName: "G",
        value:
          protein !== null
            ? Math.round(protein * 10) / 10
            : undefined,
      },

      {
        nutrientName:
          "Carbohydrate, by difference",
        unitName: "G",
        value:
          carbs !== null
            ? Math.round(carbs * 10) / 10
            : undefined,
      },

      {
        nutrientName:
          "Total lipid (fat)",
        unitName: "G",
        value:
          fat !== null
            ? Math.round(fat * 10) / 10
            : undefined,
      },
    ],
  };
}

/* =========================
   RANKING
========================= */

function scoreFood(
  food: BodyPilotFood,
  query: string
) {
  let score = 0;

  const description =
    normalize(food.description);

  const brand =
    normalize(
      food.brandName ||
        food.brandOwner ||
        ""
    );

  const normalizedQuery =
    normalize(query);

  const words =
    normalizedQuery
      .split(/\s+/)
      .filter(Boolean);

  /* Exact food name */

  if (
    description ===
    normalizedQuery
  ) {
    score += 1000;
  }

  /* Starts with query */

  if (
    description.startsWith(
      normalizedQuery
    )
  ) {
    score += 500;
  }

  /* Full query appears */

  if (
    description.includes(
      normalizedQuery
    )
  ) {
    score += 350;
  }

  /* Brand match */

  if (
    brand.includes(
      normalizedQuery
    )
  ) {
    score += 400;
  }

  /* Individual word matching */

  for (const word of words) {
    if (
      description.includes(word)
    ) {
      score += 80;
    }

    if (
      brand.includes(word)
    ) {
      score += 70;
    }
  }

  /* Generic USDA food quality */

  if (
    food.dataType === "Foundation"
  ) {
    score += 300;
  }

  if (
    food.dataType === "SR Legacy"
  ) {
    score += 250;
  }

  if (
    food.dataType ===
    "Survey (FNDDS)"
  ) {
    score += 150;
  }

  /* European branded product */

  if (
    food.source ===
    "Open Food Facts"
  ) {
    score += 70;
  }

  if (food.european) {
    score += 80;
  }

  /* Nutrition completeness */

  const nutrition = [
    getCalories(food),

    getNutrient(food, [
      "Protein",
    ]),

    getNutrient(food, [
      "Carbohydrate, by difference",
    ]),

    getNutrient(food, [
      "Total lipid (fat)",
    ]),
  ];

  score +=
    nutrition.filter(
      (value) => value !== null
    ).length * 20;

  return score;
}

/* =========================
   USDA SEARCH
========================= */

async function searchUSDA(
  query: string,
  apiKey: string
): Promise<BodyPilotFood[]> {
  const url =
    `https://api.nal.usda.gov/fdc/v1/foods/search` +
    `?api_key=${encodeURIComponent(apiKey)}` +
    `&query=${encodeURIComponent(query)}` +
    `&pageSize=30`;

  const response = await fetch(
    url,
    {
      headers: {
        "User-Agent":
          "CYG/1.0",
      },

      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "USDA search failed:",
      response.status
    );

    return [];
  }

  const data: USDAResponse =
    await response.json();

  return (
    data.foods ?? []
  ).map(convertUSDAFood);
}

/* =========================
   OPEN FOOD FACTS SEARCH
========================= */

async function searchOpenFoodFacts(
  query: string
): Promise<BodyPilotFood[]> {
  const params =
    new URLSearchParams({
      search_terms: query,

      search_simple: "1",

      action: "process",

      json: "1",

      page_size: "30",

      fields: [
        "code",
        "product_name",
        "product_name_en",
        "brands",
        "countries_tags",
        "nutriments",
      ].join(","),
    });

  const url =
    `https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`;

  const response =
    await fetch(url, {
      headers: {
        "User-Agent":
          "CYG/1.0",
      },

      next: {
        revalidate: 3600,
      },
    });

  if (!response.ok) {
    console.error(
      "Open Food Facts search failed:",
      response.status
    );

    return [];
  }

  const data: OFFResponse =
    await response.json();

  return (
    data.products ?? []
  )
    .map(convertOFFProduct)
    .filter(
      (
        food
      ): food is BodyPilotFood =>
        food !== null
    );
}

/* =========================
   API ROUTE
========================= */

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const rawQuery =
    searchParams
      .get("query")
      ?.trim();

  if (!rawQuery) {
    return NextResponse.json(
      {
        error:
          "Search query is required.",
      },
      {
        status: 400,
      }
    );
  }

  if (rawQuery.length > 100) {
    return NextResponse.json(
      {
        error:
          "Search query is too long.",
      },
      {
        status: 400,
      }
    );
  }

  const apiKey =
    process.env.USDA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "USDA API key is missing.",
      },
      {
        status: 500,
      }
    );
  }

  const translatedQuery =
    translateQuery(rawQuery);

  try {
    /*
      Run both databases simultaneously.
    */

    const [
      usdaFoods,
      europeanFoods,
    ] = await Promise.all([
      searchUSDA(
        translatedQuery,
        apiKey
      ),

      /*
        For branded products the ORIGINAL query
        can often be better.

        Example:
        "Milbona Skyr"
      */
      searchOpenFoodFacts(
        rawQuery
      ),
    ]);

    const allFoods = [
      ...usdaFoods,
      ...europeanFoods,
    ];

    /* Remove foods with useless nutrition */

    const usefulFoods =
      allFoods.filter(
        hasUsefulNutrition
      );

    /* Remove duplicates */

    const seen =
      new Set<string>();

    const uniqueFoods =
      usefulFoods.filter(
        (food) => {
          const key = [
            normalize(
              food.description
            ),

            normalize(
              food.brandName ||
                food.brandOwner ||
                ""
            ),
          ].join("|");

          if (
            seen.has(key)
          ) {
            return false;
          }

          seen.add(key);

          return true;
        }
      );

    /* BodyPilot ranking */

    const rankedFoods =
      uniqueFoods
        .map((food) => ({
          food,

          score:
            scoreFood(
              food,
              rawQuery
            ),
        }))

        .sort(
          (a, b) =>
            b.score -
            a.score
        )

        .slice(0, 20)

        .map(
          ({ food }) =>
            food
        );

    return NextResponse.json({
      foods: rankedFoods,

      query: rawQuery,

      searchedAs:
        translatedQuery,

      sources: {
        USDA:
          usdaFoods.length,

        openFoodFacts:
          europeanFoods.length,
      },

      total:
        rankedFoods.length,
    });
  } catch (error) {
    console.error(
      "BodyPilot combined food search error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Food search failed.",
      },
      {
        status: 500,
      }
    );
  }
}