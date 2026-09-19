"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

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

type FoodSearchProps = {
  meals: Meal[];
  onAddFood: (food: Food) => void;
};

type USDAFoodNutrient = {
  nutrientName?: string;
  nutrientNumber?: string;
  nutrientId?: number;
  value?: number;
};

type USDAFood = {
  fdcId: number;
  description: string;
  brandName?: string;
  brandOwner?: string;
  foodNutrients?: USDAFoodNutrient[];
};

type BarcodeNutrition = {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

type BarcodeProduct = {
  source: string;
  barcode: string;
  name: string;
  brand: string;
  quantity: string;
  servingSize: string;
  image: string;
  nutritionPer100g: BarcodeNutrition;
  nutritionComplete: boolean;
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

type SearchMode = "search" | "barcode" | "my-foods";

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function displayNutrition(
  value: number | null,
  unit: string
) {
  if (value === null) {
    return "—";
  }

  return `${round1(value)} ${unit}`;
}

function getNutrient(
  food: USDAFood,
  nutrientNames: string[]
) {
  const nutrient = food.foodNutrients?.find((item) =>
    nutrientNames.some(
      (name) =>
        item.nutrientName?.toLowerCase() ===
        name.toLowerCase()
    )
  );

  return nutrient?.value ?? 0;
}

function getCalories(food: USDAFood) {
  const nutrient = food.foodNutrients?.find((item) => {
    const name =
      item.nutrientName?.toLowerCase() ?? "";

    return (
      name === "energy" ||
      name.includes(
        "energy (atwater general factors)"
      ) ||
      name.includes(
        "energy (atwater specific factors)"
      )
    );
  });

  return nutrient?.value ?? 0;
}

export default function FoodSearch({
  meals,
  onAddFood,
}: FoodSearchProps) {
  const [mode, setMode] =
    useState<SearchMode>("search");

  const [query, setQuery] = useState("");
  const [results, setResults] =
    useState<USDAFood[]>([]);
  const [selectedFood, setSelectedFood] =
    useState<USDAFood | null>(null);

  const [barcode, setBarcode] = useState("");
  const [barcodeProduct, setBarcodeProduct] =
    useState<BarcodeProduct | null>(null);

  const [grams, setGrams] = useState("100");

  const [selectedMeal, setSelectedMeal] =
    useState(meals[0]?.id ?? "breakfast");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [myFoods, setMyFoods] = useState<MyFood[]>([]);
  const [myFoodsLoaded, setMyFoodsLoaded] = useState(false);
  const [showCreateFood, setShowCreateFood] = useState(false);

  const [customName, setCustomName] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [customBarcode, setCustomBarcode] = useState("");
  const [customCalories, setCustomCalories] = useState("");
  const [customProtein, setCustomProtein] = useState("");
  const [customCarbs, setCustomCarbs] = useState("");
  const [customFat, setCustomFat] = useState("");

  const [scannerOpen, setScannerOpen] =
    useState(false);

  const [scannerStarting, setScannerStarting] =
    useState(false);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const scannerControlsRef =
    useRef<{ stop: () => void } | null>(null);

  const scanLockedRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bodypilot-my-foods");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMyFoods(parsed);
        }
      }
    } catch (storageError) {
      console.error("Could not load My Foods:", storageError);
    } finally {
      setMyFoodsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!myFoodsLoaded) {
      return;
    }

    localStorage.setItem(
      "bodypilot-my-foods",
      JSON.stringify(myFoods)
    );
  }, [myFoods, myFoodsLoaded]);

  useEffect(() => {
    if (!scannerOpen) {
      return;
    }

    let cancelled = false;

    async function startScanner() {
      if (!videoRef.current) {
        return;
      }

      setScannerStarting(true);
      setError("");
      scanLockedRef.current = false;

      try {
        const codeReader =
          new BrowserMultiFormatReader();

        const controls =
          await codeReader.decodeFromConstraints(
            {
              video: {
                facingMode: {
                  ideal: "environment",
                },
              },
            },
            videoRef.current,
            async (result) => {
              if (
                !result ||
                scanLockedRef.current ||
                cancelled
              ) {
                return;
              }

              const scannedCode =
                result.getText();

              if (!scannedCode) {
                return;
              }

              scanLockedRef.current = true;

              setBarcode(scannedCode);

              scannerControlsRef.current?.stop();

              setScannerOpen(false);

              await lookupBarcode(scannedCode);
            }
          );

        if (cancelled) {
          controls.stop();
          return;
        }

        scannerControlsRef.current = controls;
      } catch (scannerError) {
        console.error(scannerError);

        setError(
          "Camera could not start. Check camera permission in your browser."
        );

        setScannerOpen(false);
      } finally {
        if (!cancelled) {
          setScannerStarting(false);
        }
      }
    }

    startScanner();

    return () => {
      cancelled = true;

      scannerControlsRef.current?.stop();

      scannerControlsRef.current = null;
    };
  }, [scannerOpen]);

  async function searchFood() {
    if (!query.trim()) {
      setError("Enter a food name.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setSelectedFood(null);

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

      setResults(data.foods ?? []);
    } catch {
      setError("Could not search for food.");
    } finally {
      setLoading(false);
    }
  }

  async function lookupBarcode(code: string) {
    const cleanBarcode = code.trim();

    if (!cleanBarcode) {
      setError("Enter a barcode.");
      return;
    }

    setLoading(true);
    setError("");
    setBarcodeProduct(null);

    const localProduct = myFoods.find(
      (food) => food.barcode === cleanBarcode
    );

    if (localProduct) {
      setBarcodeProduct({
        source: "BodyPilot My Foods",
        barcode: localProduct.barcode,
        name: localProduct.name,
        brand: localProduct.brand,
        quantity: "",
        servingSize: "",
        image: "",
        nutritionPer100g: {
          calories: localProduct.calories,
          protein: localProduct.protein,
          carbs: localProduct.carbs,
          fat: localProduct.fat,
        },
        nutritionComplete: true,
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

  async function searchBarcode() {
    await lookupBarcode(barcode);
  }

  function openScanner() {
    setError("");
    setBarcodeProduct(null);
    setScannerOpen(true);
  }

  function closeScanner() {
    scannerControlsRef.current?.stop();

    scannerControlsRef.current = null;

    setScannerOpen(false);
    setScannerStarting(false);
  }

  function addUSDAFood() {
    if (!selectedFood) {
      setError("Select a food first.");
      return;
    }

    const gramsNumber = Number(grams);

    if (!gramsNumber || gramsNumber <= 0) {
      setError(
        "Enter a valid amount in grams."
      );
      return;
    }

    const multiplier = gramsNumber / 100;

    const calories =
      getCalories(selectedFood);

    const protein = getNutrient(
      selectedFood,
      ["Protein"]
    );

    const carbs = getNutrient(
      selectedFood,
      ["Carbohydrate, by difference"]
    );

    const fat = getNutrient(
      selectedFood,
      ["Total lipid (fat)"]
    );

    onAddFood({
      id: Date.now(),

      name:
        `${selectedFood.description} ` +
        `(${gramsNumber} g)`,

      calories: Math.round(
        calories * multiplier
      ),

      protein: round1(
        protein * multiplier
      ),

      carbs: round1(
        carbs * multiplier
      ),

      fat: round1(
        fat * multiplier
      ),

      mealId: selectedMeal,
    });

    setSelectedFood(null);
    setQuery("");
    setResults([]);
    setGrams("100");
    setError("");
  }

  function addBarcodeFood() {
    if (!barcodeProduct) {
      setError(
        "Search for a product first."
      );
      return;
    }

    const gramsNumber = Number(grams);

    if (!gramsNumber || gramsNumber <= 0) {
      setError(
        "Enter a valid amount in grams."
      );
      return;
    }

    const multiplier = gramsNumber / 100;

    const nutrition =
      barcodeProduct.nutritionPer100g;

    onAddFood({
      id: Date.now(),

      name:
        `${barcodeProduct.name} ` +
        `(${gramsNumber} g)`,

      calories: Math.round(
        (nutrition.calories ?? 0) *
          multiplier
      ),

      protein: round1(
        (nutrition.protein ?? 0) *
          multiplier
      ),

      carbs: round1(
        (nutrition.carbs ?? 0) *
          multiplier
      ),

      fat: round1(
        (nutrition.fat ?? 0) *
          multiplier
      ),

      mealId: selectedMeal,
    });

    setBarcodeProduct(null);
    setBarcode("");
    setGrams("100");
    setError("");
  }

  function saveCustomFood() {
    const name = customName.trim();

    const calories = Number(customCalories);
    const protein = Number(customProtein);
    const carbs = Number(customCarbs);
    const fat = Number(customFat);

    if (!name) {
      setError("Enter a food name.");
      return;
    }

    if (
      customCalories === "" ||
      customProtein === "" ||
      customCarbs === "" ||
      customFat === "" ||
      calories < 0 ||
      protein < 0 ||
      carbs < 0 ||
      fat < 0
    ) {
      setError("Enter valid nutrition values per 100 g.");
      return;
    }

    const cleanBarcode = customBarcode.trim();

    if (
      cleanBarcode &&
      !/^\d{8,14}$/.test(cleanBarcode)
    ) {
      setError("Barcode must contain 8 to 14 digits.");
      return;
    }

    if (
      cleanBarcode &&
      myFoods.some((food) => food.barcode === cleanBarcode)
    ) {
      setError("This barcode is already saved in My Foods.");
      return;
    }

    const newFood: MyFood = {
      id: Date.now(),
      name,
      brand: customBrand.trim(),
      barcode: cleanBarcode,
      calories: round1(calories),
      protein: round1(protein),
      carbs: round1(carbs),
      fat: round1(fat),
    };

    setMyFoods((current) => [newFood, ...current]);

    setCustomName("");
    setCustomBrand("");
    setCustomBarcode("");
    setCustomCalories("");
    setCustomProtein("");
    setCustomCarbs("");
    setCustomFat("");
    setShowCreateFood(false);
    setError("");
  }

  function deleteMyFood(id: number) {
    setMyFoods((current) =>
      current.filter((food) => food.id !== id)
    );
  }

  function addMyFoodToDiary(food: MyFood) {
    const gramsNumber = Number(grams);

    if (!gramsNumber || gramsNumber <= 0) {
      setError("Enter a valid amount in grams.");
      return;
    }

    const multiplier = gramsNumber / 100;

    onAddFood({
      id: Date.now(),
      name: `${food.name} (${gramsNumber} g)`,
      calories: Math.round(food.calories * multiplier),
      protein: round1(food.protein * multiplier),
      carbs: round1(food.carbs * multiplier),
      fat: round1(food.fat * multiplier),
      mealId: selectedMeal,
    });

    setError("");
  }

  function changeMode(newMode: SearchMode) {
    closeScanner();

    setMode(newMode);
    setError("");
    setSelectedFood(null);
    setBarcodeProduct(null);
  }

  return (
    <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <div>
        <p className="text-sm font-semibold tracking-widest text-green-400">
          ADD FOOD
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Find your food
        </h2>

        <p className="mt-2 text-zinc-500">
          Search foods or scan a packaged
          product.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-zinc-950 p-1">
        <button
          onClick={() =>
            changeMode("search")
          }
          className={`rounded-xl px-4 py-3 font-semibold transition ${
            mode === "search"
              ? "bg-green-400 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Search food
        </button>

        <button
          onClick={() =>
            changeMode("barcode")
          }
          className={`rounded-xl px-4 py-3 font-semibold transition ${
            mode === "barcode"
              ? "bg-green-400 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Barcode
        </button>

        <button
          onClick={() =>
            changeMode("my-foods")
          }
          className={`rounded-xl px-4 py-3 font-semibold transition ${
            mode === "my-foods"
              ? "bg-green-400 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          My Foods
        </button>
      </div>

      {mode === "search" && (
        <div className="mt-6">
          <div className="flex gap-3">
            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  searchFood();
                }
              }}
              placeholder="Chicken breast, rice, oats..."
              className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none focus:border-green-400"
            />

            <button
              onClick={searchFood}
              disabled={loading}
              className="rounded-xl bg-green-400 px-6 font-bold text-black transition hover:bg-green-300 disabled:opacity-50"
            >
              {loading
                ? "Searching..."
                : "Search"}
            </button>
          </div>

          {results.length > 0 && (
            <div className="mt-5 space-y-2">
              {results.map((food) => {
                const brand =
                  food.brandName ||
                  food.brandOwner;

                return (
                  <button
                    key={food.fdcId}
                    onClick={() =>
                      setSelectedFood(food)
                    }
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedFood?.fdcId ===
                      food.fdcId
                        ? "border-green-400 bg-green-400/10"
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                    }`}
                  >
                    <p className="font-semibold">
                      {food.description}
                    </p>

                    {brand && (
                      <p className="mt-1 text-sm text-zinc-500">
                        {brand}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {selectedFood && (
            <div className="mt-6 rounded-2xl border border-green-400/30 bg-zinc-950 p-5">
              <p className="text-sm text-zinc-500">
                Selected food
              </p>

              <p className="mt-1 font-semibold">
                {selectedFood.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <NutritionBox
                  label="Calories"
                  value={`${Math.round(
                    getCalories(selectedFood)
                  )} kcal`}
                />

                <NutritionBox
                  label="Protein"
                  value={`${round1(
                    getNutrient(
                      selectedFood,
                      ["Protein"]
                    )
                  )} g`}
                />

                <NutritionBox
                  label="Carbs"
                  value={`${round1(
                    getNutrient(
                      selectedFood,
                      [
                        "Carbohydrate, by difference",
                      ]
                    )
                  )} g`}
                />

                <NutritionBox
                  label="Fat"
                  value={`${round1(
                    getNutrient(
                      selectedFood,
                      [
                        "Total lipid (fat)",
                      ]
                    )
                  )} g`}
                />
              </div>

              <p className="mt-3 text-xs text-zinc-600">
                Nutrition shown per 100 g.
              </p>
            </div>
          )}
        </div>
      )}

      {mode === "barcode" && (
        <div className="mt-6">
          <button
            onClick={openScanner}
            className="w-full rounded-xl border border-green-400 bg-green-400/10 p-4 font-bold text-green-400 transition hover:bg-green-400/20"
          >
            📷 Scan barcode with camera
          </button>

          {scannerOpen && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-green-400/30 bg-black p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    Barcode scanner
                  </p>

                  <p className="text-sm text-zinc-400">
                    Point the camera at the
                    barcode.
                  </p>
                </div>

                <button
                  onClick={closeScanner}
                  className="rounded-lg bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
                >
                  Close
                </button>
              </div>

              <div className="relative overflow-hidden rounded-xl">
                <video
                  ref={videoRef}
                  className="max-h-[420px] w-full bg-black object-cover"
                  muted
                  playsInline
                />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-28 w-4/5 rounded-xl border-2 border-green-400" />
                </div>
              </div>

              {scannerStarting && (
                <p className="mt-3 text-center text-sm text-zinc-400">
                  Starting camera...
                </p>
              )}
            </div>
          )}

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />

            <span className="text-xs text-zinc-600">
              OR ENTER BARCODE
            </span>

            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <div className="flex gap-3">
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
              inputMode="numeric"
              placeholder="Enter barcode number..."
              className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none focus:border-green-400"
            />

            <button
              onClick={searchBarcode}
              disabled={loading}
              className="rounded-xl bg-green-400 px-6 font-bold text-black transition hover:bg-green-300 disabled:opacity-50"
            >
              {loading
                ? "Searching..."
                : "Find"}
            </button>
          </div>

          {barcodeProduct && (
            <div className="mt-6 rounded-2xl border border-green-400/30 bg-zinc-950 p-5">
              <div className="flex flex-col gap-5 sm:flex-row">
                {barcodeProduct.image && (
                  <img
                    src={
                      barcodeProduct.image
                    }
                    alt={
                      barcodeProduct.name
                    }
                    className="h-32 w-32 rounded-xl bg-white object-contain p-2"
                  />
                )}

                <div className="flex-1">
                  <p className="text-sm text-zinc-500">
                    Product found
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    {barcodeProduct.name}
                  </h3>

                  {barcodeProduct.brand && (
                    <p className="mt-1 text-zinc-400">
                      {
                        barcodeProduct.brand
                      }
                    </p>
                  )}

                  {barcodeProduct.quantity && (
                    <p className="mt-2 text-sm text-zinc-500">
                      Package:{" "}
                      {
                        barcodeProduct.quantity
                      }
                    </p>
                  )}

                  <p className="mt-2 text-xs text-zinc-600">
                    Barcode:{" "}
                    {
                      barcodeProduct.barcode
                    }
                  </p>
                </div>
              </div>

              {!barcodeProduct.nutritionComplete && (
                <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                  <p className="text-sm text-yellow-200">
                    Some nutrition data is
                    missing for this product.
                    Missing values are shown
                    as —.
                  </p>
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                <NutritionBox
                  label="Calories"
                  value={displayNutrition(
                    barcodeProduct
                      .nutritionPer100g
                      .calories,
                    "kcal"
                  )}
                />

                <NutritionBox
                  label="Protein"
                  value={displayNutrition(
                    barcodeProduct
                      .nutritionPer100g
                      .protein,
                    "g"
                  )}
                />

                <NutritionBox
                  label="Carbs"
                  value={displayNutrition(
                    barcodeProduct
                      .nutritionPer100g
                      .carbs,
                    "g"
                  )}
                />

                <NutritionBox
                  label="Fat"
                  value={displayNutrition(
                    barcodeProduct
                      .nutritionPer100g.fat,
                    "g"
                  )}
                />
              </div>

              <p className="mt-3 text-xs text-zinc-600">
                Nutrition shown per 100 g.
              </p>
            </div>
          )}
        </div>
      )}

      {mode === "my-foods" && (
        <div className="mt-6">
          <button
            onClick={() => {
              setShowCreateFood(!showCreateFood);
              setError("");
            }}
            className="w-full rounded-xl bg-green-400 p-4 font-bold text-black transition hover:bg-green-300"
          >
            {showCreateFood ? "Cancel" : "+ Create food"}
          </button>

          {showCreateFood && (
            <div className="mt-5 rounded-2xl border border-green-400/30 bg-zinc-950 p-5">
              <h3 className="text-xl font-bold">Create food</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Enter nutrition values per 100 g. Barcode is optional.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="Food name"
                  className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none focus:border-green-400"
                />

                <input
                  value={customBrand}
                  onChange={(event) => setCustomBrand(event.target.value)}
                  placeholder="Brand (optional)"
                  className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none focus:border-green-400"
                />

                <input
                  value={customBarcode}
                  onChange={(event) => setCustomBarcode(event.target.value)}
                  inputMode="numeric"
                  placeholder="Barcode (optional)"
                  className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none focus:border-green-400"
                />

                <input
                  type="number"
                  min="0"
                  value={customCalories}
                  onChange={(event) => setCustomCalories(event.target.value)}
                  placeholder="Calories / 100 g"
                  className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none focus:border-green-400"
                />

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={customProtein}
                  onChange={(event) => setCustomProtein(event.target.value)}
                  placeholder="Protein / 100 g"
                  className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none focus:border-green-400"
                />

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={customCarbs}
                  onChange={(event) => setCustomCarbs(event.target.value)}
                  placeholder="Carbs / 100 g"
                  className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none focus:border-green-400"
                />

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={customFat}
                  onChange={(event) => setCustomFat(event.target.value)}
                  placeholder="Fat / 100 g"
                  className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none focus:border-green-400"
                />
              </div>

              <button
                onClick={saveCustomFood}
                className="mt-5 w-full rounded-xl bg-green-400 p-4 font-bold text-black transition hover:bg-green-300"
              >
                Save to My Foods
              </button>
            </div>
          )}

          {myFoods.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-500">
              No custom foods saved yet.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-zinc-500">
                    Amount in grams
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={grams}
                    onChange={(event) => setGrams(event.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-500">
                    Add to meal
                  </label>
                  <select
                    value={selectedMeal}
                    onChange={(event) => setSelectedMeal(event.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none focus:border-green-400"
                  >
                    {meals.map((meal) => (
                      <option key={meal.id} value={meal.id}>
                        {meal.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {myFoods.map((food) => (
                <div
                  key={food.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{food.name}</p>
                      {food.brand && (
                        <p className="mt-1 text-sm text-zinc-500">
                          {food.brand}
                        </p>
                      )}
                      {food.barcode && (
                        <p className="mt-1 text-xs text-zinc-600">
                          Barcode: {food.barcode}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => deleteMyFood(food.id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="mt-4 text-sm text-zinc-400">
                    {food.calories} kcal • {food.protein}g P •{" "}
                    {food.carbs}g C • {food.fat}g F per 100 g
                  </p>

                  <button
                    onClick={() => addMyFoodToDiary(food)}
                    className="mt-4 w-full rounded-xl border border-green-400 px-4 py-3 font-semibold text-green-400 transition hover:bg-green-400/10"
                  >
                    Add to diary
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {(selectedFood ||
        barcodeProduct) && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-500">
              Amount in grams
            </label>

            <input
              type="number"
              min="1"
              value={grams}
              onChange={(event) =>
                setGrams(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-500">
              Add to meal
            </label>

            <select
              value={selectedMeal}
              onChange={(event) =>
                setSelectedMeal(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none focus:border-green-400"
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
        </div>
      )}

      {selectedFood && (
        <button
          onClick={addUSDAFood}
          className="mt-4 w-full rounded-xl bg-green-400 p-4 font-bold text-black transition hover:bg-green-300"
        >
          Add food
        </button>
      )}

      {barcodeProduct && (
        <button
          onClick={addBarcodeFood}
          className="mt-4 w-full rounded-xl bg-green-400 p-4 font-bold text-black transition hover:bg-green-300"
        >
          Add product
        </button>
      )}
    </section>
  );
}

function NutritionBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <p className="text-xs text-zinc-500">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>
    </div>
  );
}