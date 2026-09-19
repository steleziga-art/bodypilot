"use client";

import { useEffect, useMemo, useState } from "react";

type Food = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealId?: string;
};

type Meal = {
  id: string;
  name: string;
};

type MyFood = {
  id: number;
  name: string;
  brand: string;
  barcode: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type USDAFoodNutrient = {
  nutrientName?: string;
  value?: number;
};

type USDAFood = {
  fdcId: number;
  description: string;
  brandName?: string;
  brandOwner?: string;
  foodNutrients?: USDAFoodNutrient[];
};

type BarcodeProduct = {
  source: string;
  barcode: string;
  name: string;
  brand: string;
  nutritionPer100g: {
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
  };
};

type AvailableFood = {
  id: string;
  name: string;
  source: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type MealItem = {
  food: AvailableFood;
  grams: number;
};

type MealOptimizerProps = {
  caloriesRemaining: number;
  proteinRemaining: number;
  carbsRemaining: number;
  fatRemaining: number;
  meals: Meal[];
  onAddFoods: (foods: Food[]) => void;
};

type AddMode = "search" | "barcode" | "my-foods";

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function getNutrient(food: USDAFood, names: string[]) {
  const nutrient = food.foodNutrients?.find((item) =>
    names.some(
      (name) =>
        item.nutrientName?.toLowerCase() === name.toLowerCase()
    )
  );

  return nutrient?.value ?? 0;
}

function getCalories(food: USDAFood) {
  const nutrient = food.foodNutrients?.find((item) => {
    const name = item.nutrientName?.toLowerCase() ?? "";

    return (
      name === "energy" ||
      name.includes("energy (atwater general factors)") ||
      name.includes("energy (atwater specific factors)")
    );
  });

  return nutrient?.value ?? 0;
}

function totals(items: MealItem[]) {
  return items.reduce(
    (sum, item) => {
      const multiplier = item.grams / 100;

      sum.calories += item.food.calories * multiplier;
      sum.protein += item.food.protein * multiplier;
      sum.carbs += item.food.carbs * multiplier;
      sum.fat += item.food.fat * multiplier;

      return sum;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  );
}

function score(
  items: MealItem[],
  calories: number,
  protein: number,
  carbs: number | null,
  fat: number | null
) {
  const meal = totals(items);

  const calorieError =
    Math.abs(meal.calories - calories) /
    Math.max(calories, 1);

  const proteinError =
    Math.abs(meal.protein - protein) /
    Math.max(protein, 20);

  let result =
    calorieError * 5 +
    proteinError * 4;

  if (carbs !== null) {
    result +=
      (Math.abs(meal.carbs - carbs) /
        Math.max(carbs, 20)) *
      2;
  }

  if (fat !== null) {
    result +=
      (Math.abs(meal.fat - fat) /
        Math.max(fat, 10)) *
      2;
  }

  if (meal.calories > calories) {
    result +=
      ((meal.calories - calories) /
        Math.max(calories, 1)) *
      4;
  }

  return result + items.length * 0.015;
}

function optimize(
  foods: AvailableFood[],
  calories: number,
  protein: number,
  carbs: number | null,
  fat: number | null
) {
  if (foods.length === 0) {
    return null;
  }

  const pool = foods.slice(0, 10);
  const portions = [
    25, 50, 75, 100, 125, 150, 200, 250, 300,
  ];

  let bestItems: MealItem[] | null = null;
  let bestScore = Infinity;

  for (const food of pool) {
    for (const grams of portions) {
      const items = [{ food, grams }];
      const currentScore = score(
        items,
        calories,
        protein,
        carbs,
        fat
      );

      if (currentScore < bestScore) {
        bestScore = currentScore;
        bestItems = items;
      }
    }
  }

  for (let a = 0; a < pool.length; a++) {
    for (let b = a + 1; b < pool.length; b++) {
      for (const gramsA of portions) {
        for (const gramsB of portions) {
          const items = [
            { food: pool[a], grams: gramsA },
            { food: pool[b], grams: gramsB },
          ];

          const currentScore = score(
            items,
            calories,
            protein,
            carbs,
            fat
          );

          if (currentScore < bestScore) {
            bestScore = currentScore;
            bestItems = items;
          }
        }
      }
    }
  }

  const threeFoodPool = pool.slice(0, 7);
  const threeFoodPortions = [
    50, 100, 150, 200, 250,
  ];

  for (
    let a = 0;
    a < threeFoodPool.length;
    a++
  ) {
    for (
      let b = a + 1;
      b < threeFoodPool.length;
      b++
    ) {
      for (
        let c = b + 1;
        c < threeFoodPool.length;
        c++
      ) {
        for (const gramsA of threeFoodPortions) {
          for (const gramsB of threeFoodPortions) {
            for (const gramsC of threeFoodPortions) {
              const items = [
                {
                  food: threeFoodPool[a],
                  grams: gramsA,
                },
                {
                  food: threeFoodPool[b],
                  grams: gramsB,
                },
                {
                  food: threeFoodPool[c],
                  grams: gramsC,
                },
              ];

              const currentScore = score(
                items,
                calories,
                protein,
                carbs,
                fat
              );

              if (currentScore < bestScore) {
                bestScore = currentScore;
                bestItems = items;
              }
            }
          }
        }
      }
    }
  }

  if (bestItems === null) {
    return null;
  }

  return {
    items: bestItems,
    match: Math.max(
      0,
      Math.min(
        100,
        Math.round(100 - bestScore * 18)
      )
    ),
  };
}

export default function MealOptimizer({
  caloriesRemaining,
  proteinRemaining,
  meals,
  onAddFoods,
}: MealOptimizerProps) {
  const [availableFoods, setAvailableFoods] =
    useState<AvailableFood[]>([]);

  const [myFoods, setMyFoods] =
    useState<MyFood[]>([]);

  const [addOpen, setAddOpen] = useState(false);
  const [addMode, setAddMode] =
    useState<AddMode>("search");

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<USDAFood[]>([]);

  const [barcode, setBarcode] = useState("");
  const [barcodeProduct, setBarcodeProduct] =
    useState<BarcodeProduct | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedMeal, setSelectedMeal] =
    useState(meals[0]?.id ?? "breakfast");

  const [targetCalories, setTargetCalories] =
    useState(
      String(
        Math.max(
          Math.round(caloriesRemaining),
          0
        )
      )
    );

  const [targetProtein, setTargetProtein] =
    useState(
      String(
        Math.max(
          Math.round(proteinRemaining),
          0
        )
      )
    );

  const [targetCarbs, setTargetCarbs] =
    useState("");

  const [targetFat, setTargetFat] =
    useState("");

  const [advanced, setAdvanced] =
    useState(false);

  const [result, setResult] =
    useState<ReturnType<typeof optimize>>(null);

  useEffect(() => {
    try {
      const pantryRaw = localStorage.getItem(
        "bodypilot-pantry-foods"
      );

      if (pantryRaw) {
        const parsed = JSON.parse(pantryRaw);

        if (Array.isArray(parsed)) {
          setAvailableFoods(parsed);
        }
      }

      const myFoodsRaw = localStorage.getItem(
        "bodypilot-my-foods"
      );

      if (myFoodsRaw) {
        const parsed = JSON.parse(myFoodsRaw);

        if (Array.isArray(parsed)) {
          setMyFoods(parsed);
        }
      }
    } catch (storageError) {
      console.error(storageError);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "bodypilot-pantry-foods",
      JSON.stringify(availableFoods)
    );
  }, [availableFoods]);

  const resultTotals = useMemo(
    () => (result ? totals(result.items) : null),
    [result]
  );

  function addAvailableFood(food: AvailableFood) {
    setAvailableFoods((current) => {
      const exists = current.some(
        (item) => item.id === food.id
      );

      if (exists) {
        return current;
      }

      return [...current, food];
    });

    setResult(null);
    setError("");
  }

  function removeAvailableFood(id: string) {
    setAvailableFoods((current) =>
      current.filter((food) => food.id !== id)
    );

    setResult(null);
  }

  async function searchUSDA() {
    if (!query.trim()) {
      setError("Enter a food name.");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResults([]);

    try {
      const response = await fetch(
        `/api/food-search?query=${encodeURIComponent(
          query.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Food search failed."
        );
        return;
      }

      setSearchResults(data.foods ?? []);
    } catch {
      setError("Could not search for food.");
    } finally {
      setLoading(false);
    }
  }

  function addUSDAFood(food: USDAFood) {
    const brand =
      food.brandName ||
      food.brandOwner ||
      "";

    addAvailableFood({
      id: `usda-${food.fdcId}`,
      name: brand
        ? `${food.description} — ${brand}`
        : food.description,
      source: "USDA",
      calories: round1(getCalories(food)),
      protein: round1(
        getNutrient(food, ["Protein"])
      ),
      carbs: round1(
        getNutrient(food, [
          "Carbohydrate, by difference",
        ])
      ),
      fat: round1(
        getNutrient(food, [
          "Total lipid (fat)",
        ])
      ),
    });
  }

  async function searchBarcode() {
    const cleanBarcode = barcode.trim();

    if (!cleanBarcode) {
      setError("Enter a barcode.");
      return;
    }

    setLoading(true);
    setError("");
    setBarcodeProduct(null);

    const localFood = myFoods.find(
      (food) =>
        food.barcode === cleanBarcode
    );

    if (localFood) {
      setBarcodeProduct({
        source: "My Foods",
        barcode: cleanBarcode,
        name: localFood.name,
        brand: localFood.brand,
        nutritionPer100g: {
          calories: localFood.calories,
          protein: localFood.protein,
          carbs: localFood.carbs,
          fat: localFood.fat,
        },
      });

      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/barcode?code=${encodeURIComponent(
          cleanBarcode
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Product not found."
        );
        return;
      }

      setBarcodeProduct(data);
    } catch {
      setError(
        "Could not search for this barcode."
      );
    } finally {
      setLoading(false);
    }
  }

  function addBarcodeProduct() {
    if (!barcodeProduct) {
      return;
    }

    const nutrition =
      barcodeProduct.nutritionPer100g;

    if (
      nutrition.calories === null ||
      nutrition.protein === null ||
      nutrition.carbs === null ||
      nutrition.fat === null
    ) {
      setError(
        "This product does not have complete macro data."
      );
      return;
    }

    addAvailableFood({
      id: `barcode-${barcodeProduct.barcode}`,
      name: barcodeProduct.brand
        ? `${barcodeProduct.name} — ${barcodeProduct.brand}`
        : barcodeProduct.name,
      source: barcodeProduct.source,
      calories: round1(
        nutrition.calories
      ),
      protein: round1(
        nutrition.protein
      ),
      carbs: round1(
        nutrition.carbs
      ),
      fat: round1(
        nutrition.fat
      ),
    });
  }

  function addMyFood(food: MyFood) {
    addAvailableFood({
      id: `my-${food.id}`,
      name: food.brand
        ? `${food.name} — ${food.brand}`
        : food.name,
      source: "My Foods",
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    });
  }

  function runOptimizer() {
    const calories = Number(targetCalories);
    const protein = Number(targetProtein);

    const carbs =
      advanced && targetCarbs !== ""
        ? Number(targetCarbs)
        : null;

    const fat =
      advanced && targetFat !== ""
        ? Number(targetFat)
        : null;

    if (availableFoods.length === 0) {
      setError(
        "Add at least one food to Foods available."
      );
      return;
    }

    if (
      !Number.isFinite(calories) ||
      calories <= 0
    ) {
      setError(
        "Enter a valid calorie target."
      );
      return;
    }

    if (
      !Number.isFinite(protein) ||
      protein < 0
    ) {
      setError(
        "Enter a valid protein target."
      );
      return;
    }

    if (
      (carbs !== null &&
        (!Number.isFinite(carbs) ||
          carbs < 0)) ||
      (fat !== null &&
        (!Number.isFinite(fat) ||
          fat < 0))
    ) {
      setError(
        "Enter valid macro targets."
      );
      return;
    }

    setError("");

    setResult(
      optimize(
        availableFoods,
        calories,
        protein,
        carbs,
        fat
      )
    );
  }

  function addResultToDiary() {
    if (!result) {
      return;
    }

    const now = Date.now();

    const foods: Food[] =
      result.items.map(
        (item, index) => {
          const multiplier =
            item.grams / 100;

          return {
            id: now + index,
            name:
              `${item.food.name} ` +
              `(${item.grams} g)`,
            calories: Math.round(
              item.food.calories *
                multiplier
            ),
            protein: round1(
              item.food.protein *
                multiplier
            ),
            carbs: round1(
              item.food.carbs *
                multiplier
            ),
            fat: round1(
              item.food.fat *
                multiplier
            ),
            mealId: selectedMeal,
          };
        }
      );

    onAddFoods(foods);
  }

  return (
    <section className="mt-4 rounded-3xl border border-green-400/30 bg-zinc-900 p-6 md:p-8">
      <p className="text-sm font-semibold tracking-widest text-green-400">
        BODYPILOT MEAL OPTIMIZER
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        What do you have at home?
      </h2>

      <p className="mt-2 text-zinc-400">
        Build a list of foods you have available,
        then BodyPilot will calculate how much of
        each food to use.
      </p>

      <div className="mt-7 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">
              Foods available
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              {availableFoods.length}{" "}
              {availableFoods.length === 1
                ? "food"
                : "foods"}{" "}
              available
            </p>
          </div>

          <button
            onClick={() => {
              setAddOpen(!addOpen);
              setError("");
            }}
            className="rounded-xl bg-green-400 px-5 py-3 font-semibold text-black transition hover:bg-green-300"
          >
            + Add food
          </button>
        </div>

        {availableFoods.length === 0 ? (
          <p className="mt-5 text-sm text-zinc-500">
            Nothing here yet. Click + Add food.
          </p>
        ) : (
          <div className="mt-5 space-y-2">
            {availableFoods.map(
              (food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {food.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {food.source} •{" "}
                      {Math.round(
                        food.calories
                      )}{" "}
                      kcal •{" "}
                      {round1(
                        food.protein
                      )}{" "}
                      g protein / 100 g
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeAvailableFood(
                        food.id
                      )
                    }
                    className="shrink-0 text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {addOpen && (
        <div className="mt-4 rounded-2xl border border-green-400/30 bg-zinc-950 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">
                Add food to Foods available
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                This does not add anything to
                today&apos;s calories.
              </p>
            </div>

            <button
              onClick={() =>
                setAddOpen(false)
              }
              className="text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-zinc-900 p-1">
            <button
              onClick={() => {
                setAddMode("search");
                setError("");
              }}
              className={`rounded-lg px-3 py-3 text-sm font-semibold ${
                addMode === "search"
                  ? "bg-green-400 text-black"
                  : "text-zinc-400"
              }`}
            >
              Search
            </button>

            <button
              onClick={() => {
                setAddMode("barcode");
                setError("");
              }}
              className={`rounded-lg px-3 py-3 text-sm font-semibold ${
                addMode === "barcode"
                  ? "bg-green-400 text-black"
                  : "text-zinc-400"
              }`}
            >
              Barcode
            </button>

            <button
              onClick={() => {
                setAddMode("my-foods");
                setError("");
              }}
              className={`rounded-lg px-3 py-3 text-sm font-semibold ${
                addMode === "my-foods"
                  ? "bg-green-400 text-black"
                  : "text-zinc-400"
              }`}
            >
              My Foods
            </button>
          </div>

          {addMode === "search" && (
            <div className="mt-5">
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter"
                    ) {
                      searchUSDA();
                    }
                  }}
                  placeholder="Chicken breast, rice, oats..."
                  className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none focus:border-green-400"
                />

                <button
                  onClick={searchUSDA}
                  disabled={loading}
                  className="rounded-xl bg-green-400 px-5 font-semibold text-black disabled:opacity-50"
                >
                  {loading
                    ? "Searching..."
                    : "Search"}
                </button>
              </div>

              {searchResults.length >
                0 && (
                <div className="mt-4 space-y-2">
                  {searchResults.map(
                    (food) => {
                      const alreadyAdded =
                        availableFoods.some(
                          (item) =>
                            item.id ===
                            `usda-${food.fdcId}`
                        );

                      return (
                        <div
                          key={food.fdcId}
                          className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                        >
                          <div className="min-w-0">
                            <p className="font-medium">
                              {
                                food.description
                              }
                            </p>

                            {(food.brandName ||
                              food.brandOwner) && (
                              <p className="mt-1 text-xs text-zinc-500">
                                {food.brandName ||
                                  food.brandOwner}
                              </p>
                            )}

                            <p className="mt-1 text-xs text-zinc-500">
                              {Math.round(
                                getCalories(
                                  food
                                )
                              )}{" "}
                              kcal •{" "}
                              {round1(
                                getNutrient(
                                  food,
                                  [
                                    "Protein",
                                  ]
                                )
                              )}{" "}
                              g protein /
                              100 g
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              addUSDAFood(
                                food
                              )
                            }
                            disabled={
                              alreadyAdded
                            }
                            className="shrink-0 rounded-lg border border-green-400 px-3 py-2 text-sm font-semibold text-green-400 disabled:border-zinc-700 disabled:text-zinc-600"
                          >
                            {alreadyAdded
                              ? "Added"
                              : "Add"}
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          )}

          {addMode === "barcode" && (
            <div className="mt-5">
              <div className="flex gap-2">
                <input
                  value={barcode}
                  onChange={(event) =>
                    setBarcode(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter"
                    ) {
                      searchBarcode();
                    }
                  }}
                  placeholder="Enter barcode"
                  className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none focus:border-green-400"
                />

                <button
                  onClick={searchBarcode}
                  disabled={loading}
                  className="rounded-xl bg-green-400 px-5 font-semibold text-black disabled:opacity-50"
                >
                  {loading
                    ? "Searching..."
                    : "Find"}
                </button>
              </div>

              {barcodeProduct && (
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <p className="font-semibold">
                    {
                      barcodeProduct.name
                    }
                  </p>

                  {barcodeProduct.brand && (
                    <p className="mt-1 text-sm text-zinc-500">
                      {
                        barcodeProduct.brand
                      }
                    </p>
                  )}

                  <button
                    onClick={
                      addBarcodeProduct
                    }
                    className="mt-4 rounded-lg border border-green-400 px-4 py-2 text-sm font-semibold text-green-400"
                  >
                    Add to Foods available
                  </button>
                </div>
              )}
            </div>
          )}

          {addMode === "my-foods" && (
            <div className="mt-5">
              {myFoods.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  You have no saved My Foods
                  yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {myFoods.map((food) => {
                    const id =
                      `my-${food.id}`;

                    const alreadyAdded =
                      availableFoods.some(
                        (item) =>
                          item.id === id
                      );

                    return (
                      <div
                        key={food.id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                      >
                        <div>
                          <p className="font-medium">
                            {food.name}
                          </p>

                          {food.brand && (
                            <p className="mt-1 text-xs text-zinc-500">
                              {
                                food.brand
                              }
                            </p>
                          )}

                          <p className="mt-1 text-xs text-zinc-500">
                            {Math.round(
                              food.calories
                            )}{" "}
                            kcal •{" "}
                            {round1(
                              food.protein
                            )}{" "}
                            g protein /
                            100 g
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            addMyFood(food)
                          }
                          disabled={
                            alreadyAdded
                          }
                          className="shrink-0 rounded-lg border border-green-400 px-3 py-2 text-sm font-semibold text-green-400 disabled:border-zinc-700 disabled:text-zinc-600"
                        >
                          {alreadyAdded
                            ? "Added"
                            : "Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <h3 className="font-semibold">
          Meal target
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-zinc-400">
            Calories
            <input
              type="number"
              min="1"
              value={targetCalories}
              onChange={(event) => {
                setTargetCalories(
                  event.target.value
                );
                setResult(null);
              }}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white outline-none focus:border-green-400"
            />
          </label>

          <label className="text-sm text-zinc-400">
            Protein (g)
            <input
              type="number"
              min="0"
              value={targetProtein}
              onChange={(event) => {
                setTargetProtein(
                  event.target.value
                );
                setResult(null);
              }}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white outline-none focus:border-green-400"
            />
          </label>
        </div>

        <button
          onClick={() =>
            setAdvanced(!advanced)
          }
          className="mt-4 text-sm font-semibold text-green-400"
        >
          {advanced
            ? "Hide advanced targets"
            : "Advanced targets"}
        </button>

        {advanced && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-zinc-400">
              Carbs (g) — optional
              <input
                type="number"
                min="0"
                value={targetCarbs}
                onChange={(event) => {
                  setTargetCarbs(
                    event.target.value
                  );
                  setResult(null);
                }}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white outline-none focus:border-green-400"
              />
            </label>

            <label className="text-sm text-zinc-400">
              Fat (g) — optional
              <input
                type="number"
                min="0"
                value={targetFat}
                onChange={(event) => {
                  setTargetFat(
                    event.target.value
                  );
                  setResult(null);
                }}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white outline-none focus:border-green-400"
              />
            </label>
          </div>
        )}

        <button
          onClick={runOptimizer}
          className="mt-5 w-full rounded-xl bg-green-400 p-4 font-bold text-black transition hover:bg-green-300"
        >
          Optimize meal
        </button>

        {!addOpen && error && (
          <p className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      {result && resultTotals && (
        <div className="mt-6 rounded-2xl border border-green-400/30 bg-zinc-950 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500">
                BODYPILOT SUGGESTION
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Your optimized meal
              </h3>
            </div>

            <span className="rounded-xl bg-green-400/10 px-3 py-2 text-sm font-semibold text-green-400">
              {result.match}% match
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {result.items.map(
              (item) => (
                <div
                  key={item.food.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div>
                    <p className="font-semibold">
                      {
                        item.food
                          .name
                      }
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {
                        item.food
                          .source
                      }
                    </p>
                  </div>

                  <p className="text-lg font-bold">
                    {item.grams} g
                  </p>
                </div>
              )
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat
              label="Calories"
              value={`${Math.round(
                resultTotals.calories
              )} kcal`}
            />

            <Stat
              label="Protein"
              value={`${round1(
                resultTotals.protein
              )} g`}
            />

            <Stat
              label="Carbs"
              value={`${round1(
                resultTotals.carbs
              )} g`}
            />

            <Stat
              label="Fat"
              value={`${round1(
                resultTotals.fat
              )} g`}
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-zinc-500">
              Add meal to
            </label>

            <select
              value={selectedMeal}
              onChange={(event) =>
                setSelectedMeal(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none focus:border-green-400"
            >
              {meals.map((meal) => (
                <option
                  key={meal.id}
                  value={meal.id}
                >
                  {meal.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={addResultToDiary}
            className="mt-4 w-full rounded-xl bg-green-400 p-4 font-bold text-black transition hover:bg-green-300"
          >
            Add optimized meal to today
          </button>
        </div>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs text-zinc-500">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>
    </div>
  );
}
