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
  micronutrients?: Record<string, { value: number; unit: string }>;
};

type Meal = {
  id: string;
  name: string;
};

type FoodSearchProps = {
  meals: Meal[];
  onAddFood: (food: Food) => void;
  requestedMealId?: string;
};

type USDAFoodNutrient = {
  nutrientName?: string;
  nutrientNumber?: string;
  nutrientId?: number;
  value?: number;
  unitName?: string;
};

type USDAFood = {
  fdcId: number;
  description: string;
  brandName?: string;
  brandOwner?: string;
  foodNutrients?: USDAFoodNutrient[];
  source?: "USDA" | "Open Food Facts";
  barcode?: string;
  european?: boolean;
  dataType?: string;
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

type OptimizerLibraryFood = {
  id: string;
  name: string;
  brand: string;
  source: "USDA" | "Open Food Facts";
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

function getMicronutrients(food: USDAFood, multiplier: number) {
  const specs: Array<[string, string[]]> = [
    ["vitaminA", ["Vitamin A, RAE", "Vitamin A"]], ["vitaminC", ["Vitamin C, total ascorbic acid", "Vitamin C"]],
    ["vitaminD", ["Vitamin D (D2 + D3)"]], ["vitaminE", ["Vitamin E (alpha-tocopherol)", "Vitamin E"]],
    ["vitaminK", ["Vitamin K (phylloquinone)", "Vitamin K"]], ["thiamin", ["Thiamin"]],
    ["riboflavin", ["Riboflavin"]], ["niacin", ["Niacin"]], ["vitaminB6", ["Vitamin B-6", "Vitamin B6"]],
    ["folate", ["Folate, DFE", "Folate, total"]], ["vitaminB12", ["Vitamin B-12", "Vitamin B12"]],
    ["calcium", ["Calcium, Ca"]], ["iron", ["Iron, Fe"]], ["magnesium", ["Magnesium, Mg"]],
    ["potassium", ["Potassium, K"]], ["zinc", ["Zinc, Zn"]], ["selenium", ["Selenium, Se"]],
    ["sodium", ["Sodium, Na"]], ["fiber", ["Fiber, total dietary", "Fiber"]],
  ];
  const out: Record<string, { value: number; unit: string }> = {};
  for (const [key, names] of specs) {
    const nutrient = food.foodNutrients?.find((item) => names.some((name) => item.nutrientName?.toLowerCase() === name.toLowerCase()));
    if (typeof nutrient?.value === "number" && Number.isFinite(nutrient.value)) out[key] = { value: Math.round(nutrient.value * multiplier * 100) / 100, unit: nutrient.unitName || (key === "fiber" ? "g" : "mg") };
  }
  return out;
}

function saveToOptimizerLibrary(food: OptimizerLibraryFood) {
  try {
    const saved = localStorage.getItem(
      "bodypilot-optimizer-foods"
    );

    const parsed = saved ? JSON.parse(saved) : [];

    const current: OptimizerLibraryFood[] =
      Array.isArray(parsed) ? parsed : [];

    const withoutDuplicate = current.filter(
      (item) => item.id !== food.id
    );

    localStorage.setItem(
      "bodypilot-optimizer-foods",
      JSON.stringify([
        food,
        ...withoutDuplicate,
      ].slice(0, 100))
    );
  } catch (error) {
    console.error(
      "Could not save food to optimizer library:",
      error
    );
  }
}

export default function FoodSearch({
  meals,
  onAddFood,
  requestedMealId,
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

  useEffect(() => {
    if (
      requestedMealId &&
      meals.some((meal) => meal.id === requestedMealId)
    ) {
      setSelectedMeal(requestedMealId);
      setMode("search");
    }
  }, [requestedMealId, meals]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [myFoods, setMyFoods] = useState<MyFood[]>([]);
  const [myFoodsLoaded, setMyFoodsLoaded] = useState(false);
  const [showCreateFood, setShowCreateFood] = useState(false);
  const [favorites, setFavorites] = useState<USDAFood[]>([]);
  const [recentFoods, setRecentFoods] = useState<Food[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchCacheRef = useRef<Map<string, USDAFood[]>>(new Map());
  const searchRequestRef = useRef(0);

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
      const savedFavorites = localStorage.getItem("bodypilot-favorite-foods");
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) setFavorites(parsedFavorites);
      }

      const savedRecent = localStorage.getItem("bodypilot-recent-foods");
      if (savedRecent) {
        const parsedRecent = JSON.parse(savedRecent);
        if (Array.isArray(parsedRecent)) setRecentFoods(parsedRecent);
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

  async function searchFood(searchValue = query) {
    const cleanQuery = searchValue.trim();

    if (cleanQuery.length < 2) {
      setResults([]);
      setSelectedFood(null);
      setLoading(false);
      return;
    }

    const cacheKey = cleanQuery.toLowerCase();
    const cached = searchCacheRef.current.get(cacheKey);

    if (cached) {
      setResults(rankWithPreferences([...myFoodSearchResults(cleanQuery), ...cached]));
      setError("");
      return;
    }

    const requestId = ++searchRequestRef.current;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/food-search?query=${encodeURIComponent(cleanQuery)}`
      );

      const data = await response.json();

      if (requestId !== searchRequestRef.current) return;

      if (!response.ok) {
        setError(data.error || "Food search failed.");
        setResults([]);
        return;
      }

      const foods: USDAFood[] = Array.isArray(data.foods) ? data.foods : [];
      searchCacheRef.current.set(cacheKey, foods);
      setResults(rankWithPreferences([...myFoodSearchResults(cleanQuery), ...foods]));
    } catch {
      if (requestId === searchRequestRef.current) {
        setError("Could not search for food.");
        setResults([]);
      }
    } finally {
      if (requestId === searchRequestRef.current) setLoading(false);
    }
  }

  function myFoodSearchResults(searchValue: string): USDAFood[] {
    const q = searchValue.trim().toLowerCase();
    if (q.length < 2) return [];

    return myFoods
      .filter((food) =>
        `${food.name} ${food.brand}`.toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map((food) => ({
        fdcId: -2000000000 - food.id,
        description: food.name,
        brandName: food.brand || "My Foods",
        dataType: "Branded",
        foodNutrients: [
          { nutrientName: "Energy", value: food.calories },
          { nutrientName: "Protein", value: food.protein },
          { nutrientName: "Carbohydrate, by difference", value: food.carbs },
          { nutrientName: "Total lipid (fat)", value: food.fat },
        ],
      }));
  }

  function foodKey(food: USDAFood) {
    return `${food.source ?? "USDA"}:${food.barcode ?? food.fdcId}:${food.description.toLowerCase()}`;
  }

  function rankWithPreferences(foods: USDAFood[]) {
    const favoriteNames = new Set(
      favorites.map((food) => food.description.toLowerCase())
    );
    const recentNames = new Set(
      recentFoods.map((food) =>
        food.name.replace(/\s*\([^)]*g\)\s*$/, "").toLowerCase()
      )
    );

    return [...foods].sort((a, b) => {
      const aName = a.description.toLowerCase();
      const bName = b.description.toLowerCase();
      const aScore = (favoriteNames.has(aName) ? 2 : 0) + (recentNames.has(aName) ? 1 : 0);
      const bScore = (favoriteNames.has(bName) ? 2 : 0) + (recentNames.has(bName) ? 1 : 0);
      return bScore - aScore;
    });
  }

  function isFavorite(food: USDAFood) {
    return favorites.some((item) => foodKey(item) === foodKey(food));
  }

  function toggleFavorite(food: USDAFood) {
    setFavorites((current) => {
      const exists = current.some((item) => foodKey(item) === foodKey(food));
      const next = exists
        ? current.filter((item) => foodKey(item) !== foodKey(food))
        : [food, ...current].slice(0, 30);

      localStorage.setItem("bodypilot-favorite-foods", JSON.stringify(next));
      return next;
    });
  }

  function sourceLabel(food: USDAFood) {
    if (food.source === "Open Food Facts") {
      return food.european ? "EU product" : "Product";
    }

    if (food.dataType === "Foundation" || food.dataType === "SR Legacy") {
      return "Generic";
    }

    return food.brandName || food.brandOwner ? "Product" : "Generic";
  }

  function calculatedNutrition(food: USDAFood, amount = Number(grams) || 100) {
    const multiplier = amount / 100;
    return {
      calories: Math.round(getCalories(food) * multiplier),
      protein: round1(getNutrient(food, ["Protein"]) * multiplier),
      carbs: round1(getNutrient(food, ["Carbohydrate, by difference"]) * multiplier),
      fat: round1(getNutrient(food, ["Total lipid (fat)"]) * multiplier),
    };
  }

  useEffect(() => {
    if (mode !== "search") return;

    const cleanQuery = query.trim();

    if (cleanQuery.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      searchFood(cleanQuery);
    }, 300);

    return () => window.clearTimeout(timer);
    // Live search intentionally follows query changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, mode]);

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
        source: "Mucipes My Foods",
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

  function rememberFood(food: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealId?: string;
  }) {
    try {
      const current = JSON.parse(
        localStorage.getItem("bodypilot-recent-foods") || "[]"
      );
      const safe = Array.isArray(current) ? current : [];
      const item = { ...food, id: Date.now() };
      const next = [
        item,
        ...safe.filter(
          (saved: { name?: string }) =>
            saved.name?.toLowerCase() !== item.name.toLowerCase()
        ),
      ].slice(0, 20);
      localStorage.setItem("bodypilot-recent-foods", JSON.stringify(next));
      setRecentFoods(next);
    } catch {}
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

    saveToOptimizerLibrary({
      id: `usda-${selectedFood.fdcId}`,
      name: selectedFood.description,
      brand:
        selectedFood.brandName ||
        selectedFood.brandOwner ||
        "",
      source: "USDA",
      calories: round1(calories),
      protein: round1(protein),
      carbs: round1(carbs),
      fat: round1(fat),
    });

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

      micronutrients: getMicronutrients(selectedFood, multiplier),
      mealId: selectedMeal,
    });

    rememberFood({
      name: selectedFood.description,
      calories: Math.round(calories * multiplier),
      protein: round1(protein * multiplier),
      carbs: round1(carbs * multiplier),
      fat: round1(fat * multiplier),
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

    if (
      nutrition.calories !== null &&
      nutrition.protein !== null &&
      nutrition.carbs !== null &&
      nutrition.fat !== null
    ) {
      saveToOptimizerLibrary({
        id: `barcode-${barcodeProduct.barcode}`,
        name: barcodeProduct.name,
        brand: barcodeProduct.brand,
        source: "Open Food Facts",
        calories: round1(nutrition.calories),
        protein: round1(nutrition.protein),
        carbs: round1(nutrition.carbs),
        fat: round1(nutrition.fat),
      });
    }

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

    rememberFood({
      name: food.name,
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
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div>
        <p className="text-sm font-semibold tracking-widest text-emerald-600">
          ADD FOOD
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Find your food
        </h2>

        <p className="mt-2 text-slate-500">
          Search foods or scan a packaged
          product.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
        <button
          onClick={() =>
            changeMode("search")
          }
          className={`rounded-xl px-4 py-3 font-semibold transition ${
            mode === "search"
              ? "bg-emerald-500 text-white"
              : "text-slate-600 hover:text-slate-900"
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
              ? "bg-emerald-500 text-white"
              : "text-slate-600 hover:text-slate-900"
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
              ? "bg-emerald-500 text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          My Foods
        </button>
      </div>

      {mode === "search" && (
        <div className="mt-6">
          <div className="relative">
            <div className="flex gap-3">
              <input
                value={query}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") searchFood();
                }}
                placeholder="Search chicken, skyr, riž, Milbona..."
                className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
              />

              <button
                onClick={() => searchFood()}
                disabled={loading || query.trim().length < 2}
                className="rounded-xl bg-emerald-500 px-6 font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
              >
                {loading ? "..." : "Search"}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Results update automatically while you type.
            </p>
          </div>

          {!query.trim() && searchFocused && (
            <div className="mt-5 space-y-5">
              {favorites.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-700">★ Favorites</p>
                    <span className="text-xs text-slate-400">{favorites.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {favorites.slice(0, 8).map((food) => (
                      <button
                        key={foodKey(food)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setQuery(food.description);
                          setSelectedFood(food);
                          setResults([food]);
                        }}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700"
                      >
                        {food.description}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {recentFoods.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">Recent</p>
                  <div className="flex flex-wrap gap-2">
                    {recentFoods.slice(0, 8).map((food) => (
                      <button
                        key={food.id}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                          setQuery(food.name.replace(/\s*\([^)]*g\)\s*$/, ""))
                        }
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:border-slate-300"
                      >
                        {food.name.replace(/\s*\([^)]*g\)\s*$/, "")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-5 space-y-2">
              {results.map((food) => {
                const brand = food.brandName || food.brandOwner;
                const nutrition = calculatedNutrition(food, 100);

                return (
                  <div
                    key={foodKey(food)}
                    className={`rounded-2xl border p-4 transition ${
                      selectedFood && foodKey(selectedFood) === foodKey(food)
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => {
                          setSelectedFood(food);
                          setGrams("100");
                        }}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900">
                            {food.description}
                          </p>
                          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            {sourceLabel(food)}
                          </span>
                        </div>

                        {brand && (
                          <p className="mt-1 text-sm text-slate-500">{brand}</p>
                        )}

                        <p className="mt-3 text-sm text-slate-600">
                          <span className="font-bold text-slate-900">
                            {nutrition.calories} kcal
                          </span>
                          {" · "}
                          {nutrition.protein}g P
                          {" · "}
                          {nutrition.carbs}g C
                          {" · "}
                          {nutrition.fat}g F
                        </p>

                        <p className="mt-1 text-xs text-slate-400">per 100 g</p>
                      </button>

                      <div className="flex shrink-0 gap-2">
                        <button
                          title={isFavorite(food) ? "Remove favorite" : "Add favorite"}
                          onClick={() => toggleFavorite(food)}
                          className={`h-10 w-10 rounded-xl border text-lg ${
                            isFavorite(food)
                              ? "border-amber-300 bg-amber-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          {isFavorite(food) ? "★" : "☆"}
                        </button>

                        <button
                          title="Select food"
                          onClick={() => {
                            setSelectedFood(food);
                            setGrams("100");
                          }}
                          className="h-10 w-10 rounded-xl bg-emerald-500 text-xl font-bold text-black hover:bg-emerald-400"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && !error && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-semibold text-slate-900">No matching food found.</p>
              <p className="mt-1 text-sm text-slate-500">
                Try another name, scan the barcode, or create your own food.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => changeMode("barcode")}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
                >
                  Scan barcode
                </button>
                <button
                  onClick={() => {
                    changeMode("my-foods");
                    setShowCreateFood(true);
                  }}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-black"
                >
                  Create food
                </button>
              </div>
            </div>
          )}

          {selectedFood && (() => {
            const nutrition = calculatedNutrition(selectedFood);

            return (
              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-slate-100 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">Selected food</p>
                    <p className="mt-1 font-semibold">{selectedFood.description}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {sourceLabel(selectedFood)}
                      {(selectedFood.brandName || selectedFood.brandOwner)
                        ? ` · ${selectedFood.brandName || selectedFood.brandOwner}`
                        : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(selectedFood)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
                  >
                    {isFavorite(selectedFood) ? "★ Favorite" : "☆ Favorite"}
                  </button>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-sm text-slate-500">Quick amount</p>
                  <div className="grid grid-cols-4 gap-2">
                    {["100", "150", "200", "250"].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setGrams(amount)}
                        className={`rounded-xl border px-2 py-2 text-sm font-semibold ${
                          grams === amount
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        {amount} g
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <NutritionBox label="Calories" value={`${nutrition.calories} kcal`} />
                  <NutritionBox label="Protein" value={`${nutrition.protein} g`} />
                  <NutritionBox label="Carbs" value={`${nutrition.carbs} g`} />
                  <NutritionBox label="Fat" value={`${nutrition.fat} g`} />
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Nutrition updates live for {Number(grams) || 100} g.
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {mode === "barcode" && (
        <div className="mt-6">
          <button
            onClick={openScanner}
            className="w-full rounded-xl border border-emerald-500 bg-emerald-50 p-4 font-bold text-emerald-600 transition hover:bg-emerald-500/20"
          >
            📷 Scan barcode with camera
          </button>

          {scannerOpen && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    Barcode scanner
                  </p>

                  <p className="text-sm text-slate-600">
                    Point the camera at the
                    barcode.
                  </p>
                </div>

                <button
                  onClick={closeScanner}
                  className="rounded-lg bg-slate-200 px-3 py-2 text-sm hover:bg-slate-300"
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
                  <div className="h-28 w-4/5 rounded-xl border-2 border-emerald-500" />
                </div>
              </div>

              {scannerStarting && (
                <p className="mt-3 text-center text-sm text-slate-600">
                  Starting camera...
                </p>
              )}
            </div>
          )}

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs text-slate-400">
              OR ENTER BARCODE
            </span>

            <div className="h-px flex-1 bg-slate-200" />
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
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
            />

            <button
              onClick={searchBarcode}
              disabled={loading}
              className="rounded-xl bg-emerald-500 px-6 font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading
                ? "Searching..."
                : "Find"}
            </button>
          </div>

          {barcodeProduct && (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-slate-100 p-5">
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
                  <p className="text-sm text-slate-500">
                    Product found
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    {barcodeProduct.name}
                  </h3>

                  {barcodeProduct.brand && (
                    <p className="mt-1 text-slate-600">
                      {
                        barcodeProduct.brand
                      }
                    </p>
                  )}

                  {barcodeProduct.quantity && (
                    <p className="mt-2 text-sm text-slate-500">
                      Package:{" "}
                      {
                        barcodeProduct.quantity
                      }
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-400">
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

              <p className="mt-3 text-xs text-slate-400">
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
            className="w-full rounded-xl bg-emerald-500 p-4 font-bold text-black transition hover:bg-emerald-400"
          >
            {showCreateFood ? "Cancel" : "+ Create food"}
          </button>

          {showCreateFood && (
            <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-slate-100 p-5">
              <h3 className="text-xl font-bold">Create food</h3>
              <p className="mt-2 text-sm text-slate-500">
                Enter nutrition values per 100 g. Barcode is optional.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="Food name"
                  className="rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
                />

                <input
                  value={customBrand}
                  onChange={(event) => setCustomBrand(event.target.value)}
                  placeholder="Brand (optional)"
                  className="rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
                />

                <input
                  value={customBarcode}
                  onChange={(event) => setCustomBarcode(event.target.value)}
                  inputMode="numeric"
                  placeholder="Barcode (optional)"
                  className="rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
                />

                <input
                  type="number"
                  min="0"
                  value={customCalories}
                  onChange={(event) => setCustomCalories(event.target.value)}
                  placeholder="Calories / 100 g"
                  className="rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
                />

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={customProtein}
                  onChange={(event) => setCustomProtein(event.target.value)}
                  placeholder="Protein / 100 g"
                  className="rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
                />

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={customCarbs}
                  onChange={(event) => setCustomCarbs(event.target.value)}
                  placeholder="Carbs / 100 g"
                  className="rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
                />

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={customFat}
                  onChange={(event) => setCustomFat(event.target.value)}
                  placeholder="Fat / 100 g"
                  className="rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={saveCustomFood}
                className="mt-5 w-full rounded-xl bg-emerald-500 p-4 font-bold text-black transition hover:bg-emerald-400"
              >
                Save to My Foods
              </button>
            </div>
          )}

          {myFoods.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
              No custom foods saved yet.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-500">
                    Amount in grams
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={grams}
                    onChange={(event) => setGrams(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-500">
                    Add to meal
                  </label>
                  <select
                    value={selectedMeal}
                    onChange={(event) => setSelectedMeal(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
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
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{food.name}</p>
                      {food.brand && (
                        <p className="mt-1 text-sm text-slate-500">
                          {food.brand}
                        </p>
                      )}
                      {food.barcode && (
                        <p className="mt-1 text-xs text-slate-400">
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

                  <p className="mt-4 text-sm text-slate-600">
                    {food.calories} kcal • {food.protein}g P •{" "}
                    {food.carbs}g C • {food.fat}g F per 100 g
                  </p>

                  <button
                    onClick={() => addMyFoodToDiary(food)}
                    className="mt-4 w-full rounded-xl border border-emerald-500 px-4 py-3 font-semibold text-emerald-600 transition hover:bg-emerald-50"
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
            <label className="mb-2 block text-sm text-slate-500">
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
              className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500">
              Add to meal
            </label>

            <select
              value={selectedMeal}
              onChange={(event) =>
                setSelectedMeal(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
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
          className="mt-4 w-full rounded-xl bg-emerald-500 p-4 font-bold text-black transition hover:bg-emerald-400"
        >
          Add food
        </button>
      )}

      {barcodeProduct && (
        <button
          onClick={addBarcodeFood}
          className="mt-4 w-full rounded-xl bg-emerald-500 p-4 font-bold text-black transition hover:bg-emerald-400"
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
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-3">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>
    </div>
  );
}