"use client";

import { mergeDatedDiaries, diaryForDate } from "@/lib/nutrition/dailyDiary";
import SyncStatus from "@/components/system/SyncStatus";
import cygLogo from "./cyg-logo.jpeg";
import { useEffect, useMemo, useState, useRef } from "react";
import FoodDiary from "@/components/FoodDiary";
import FoodSearch from "@/components/FoodSearch";
import NutritionInsights from "@/components/nutrition/NutritionInsights";
import MealOptimizer from "@/components/MealOptimizer";
import Training from "@/components/training/Training";
import AccountPanel from "@/components/account/AccountPanel";
import NutritionHub from "@/components/nutrition/NutritionHub";
import FriendsPanel from "@/components/social/FriendsPanel";
import CoachPage from "@/components/coach/CoachPage";
import Looksmaxing from "@/components/looksmaxing/Looksmaxing";
import PremiumPaywall from "@/components/premium/PremiumPaywall";
import { applyMucipesAppearance, cmToDisplay, displayToCm, displayToKg, formatEnergy, formatLength, formatWeight, kgToDisplay, lengthUnitLabel, weightUnitLabel } from "@/lib/mucipes/display";
import { loadCloudData, saveCloudData } from "@/lib/supabase/storage";

type Page =
  | "dashboard"
  | "nutrition"
  | "training"
  | "progress"
  | "plan"
  | "profile"
  | "looksmaxing";

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

type Goals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type AppMode = "guided" | "self-managed";
type PlanTier = "free" | "premium";

type Sex = "male" | "female";
type FitnessGoal = "lose" | "maintain" | "gain";
type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "athlete";

type BodyProfile = {
  sex: Sex;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  goal: FitnessGoal;
  activity: ActivityLevel;
  weeklyRate: number;
  trainingDays: number;
  experience: "beginner" | "intermediate" | "advanced";
  equipment: "full-gym" | "home" | "bodyweight";
  cardioGoal:
    | "none"
    | "health"
    | "fat-loss"
    | "endurance"
    | "performance";
  cardioDays: number;
  cardioType:
    | "walking"
    | "running"
    | "cycling"
    | "incline-walk"
    | "stairmaster"
    | "rowing";
  preferredTrainingDays: number[];
};

const defaultProfile: BodyProfile = {
  sex: "male",
  age: 25,
  height: 180,
  weight: 80,
  targetWeight: 75,
  goal: "maintain",
  activity: "moderate",
  weeklyRate: 0.25,
  trainingDays: 4,
  experience: "intermediate",
  equipment: "full-gym",
  cardioGoal: "health",
  cardioDays: 2,
  cardioType: "cycling",
  preferredTrainingDays: [0, 1, 3, 4],
};

type NutritionDay = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type FoodDiaryDay = {
  date: string;
  foods: Food[];
};

type WeightEntry = {
  id: number;
  date: string;
  weight: number;
};

type TrainingSet = {
  id: string;
  weight: number;
  reps: number;
  rir: number | null;
  completed: boolean;
};

type TrainingExercise = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: TrainingSet[];
};

type TrainingHistoryEntry = {
  id: string;
  name: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  exercises: TrainingExercise[];
};

type HomeActiveWorkout = {
  id: string;
  name: string;
  startedAt: string;
  exercises?: Array<{ sets?: Array<{ completed?: boolean }> }>;
};

type HomeFastingState = {
  active: boolean;
  startedAt: string | null;
  targetHours: number;
};

function readLocalJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function formatLiveDuration(ms: number) {
  const safe = Math.max(0, ms);
  const hours = Math.floor(safe / 3600000);
  const minutes = Math.floor((safe % 3600000) / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function roundEstimated1RM(kg: number, units: "metric" | "imperial") {
  if (units === "imperial") {
    return Math.round(kgToDisplay(kg, units));
  }
  return Math.round(kg * 2) / 2;
}

function formatEstimated1RM(kg: number, units: "metric" | "imperial") {
  return `${roundEstimated1RM(kg, units).toLocaleString(undefined, { maximumFractionDigits: units === "metric" ? 1 : 0 })} ${weightUnitLabel(units)}`;
}

const micronutrientLookupAttempts = new Set<string>();

type FoodSearchNutrient = { nutrientName?: string; unitName?: string; value?: number };
type FoodSearchApiFood = { description?: string; source?: string; foodNutrients?: FoodSearchNutrient[] };

const microAliases: Record<string, string[]> = {
  vitaminA: ["vitamin a, rae", "vitamin a"],
  vitaminC: ["vitamin c, total ascorbic acid", "vitamin c"],
  vitaminD: ["vitamin d (d2 + d3)"],
  vitaminE: ["vitamin e (alpha-tocopherol)", "vitamin e"],
  vitaminK: ["vitamin k (phylloquinone)", "vitamin k"],
  thiamin: ["thiamin", "vitamin b-1"],
  riboflavin: ["riboflavin", "vitamin b-2"],
  niacin: ["niacin", "vitamin b-3"],
  vitaminB6: ["vitamin b-6", "vitamin b6"],
  folate: ["folate, dfe", "folate, total", "folate"],
  vitaminB12: ["vitamin b-12", "vitamin b12"],
  calcium: ["calcium, ca", "calcium"],
  iron: ["iron, fe", "iron"],
  magnesium: ["magnesium, mg", "magnesium"],
  potassium: ["potassium, k", "potassium"],
  zinc: ["zinc, zn", "zinc"],
  selenium: ["selenium, se", "selenium"],
  sodium: ["sodium, na", "sodium"],
  fiber: ["fiber, total dietary", "fiber"],
};

function micronutrientsFromApiFood(food: FoodSearchApiFood, grams: number) {
  const out: Record<string, { value: number; unit: string }> = {};
  const multiplier = grams / 100;
  for (const [key, aliases] of Object.entries(microAliases)) {
    const nutrient = food.foodNutrients?.find((item) => {
      const name = item.nutrientName?.trim().toLowerCase() ?? "";
      return aliases.includes(name);
    });
    if (typeof nutrient?.value !== "number" || !Number.isFinite(nutrient.value)) continue;
    const unit = (nutrient.unitName || (key === "fiber" ? "g" : "mg")).replace("UG", "µg").replace("ug", "µg");
    out[key] = { value: Math.round(nutrient.value * multiplier * 100) / 100, unit };
  }
  return out;
}

const defaultGoals: Goals = {
  calories: 2500,
  protein: 180,
  carbs: 300,
  fat: 75,
};

const defaultMeals: Meal[] = [
  {
    id: "breakfast",
    name: "Breakfast",
  },
  {
    id: "lunch",
    name: "Lunch",
  },
  {
    id: "dinner",
    name: "Dinner",
  },
  {
    id: "snacks",
    name: "Snacks",
  },
];

export default function Home() {
  const [pinLooks, setPinLooks] = useState(false);
  useEffect(() => {
    const sync = () => setPinLooks(localStorage.getItem("cyg-pin-looksmaxing") === "true");
    sync(); window.addEventListener("cyg-navigation", sync); window.addEventListener("storage", sync);
    return () => { window.removeEventListener("cyg-navigation", sync); window.removeEventListener("storage", sync); };
  }, []);
  const [globalDisplay, setGlobalDisplay] = useState(() => readMucipesDisplaySettings());
  useEffect(() => {
    const sync = () => setGlobalDisplay(readMucipesDisplaySettings());
    window.addEventListener("mucipes-settings-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mucipes-settings-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => applyMucipesAppearance(globalDisplay), [globalDisplay]);

  const [activePage, setActivePage] =
    useState<Page>("dashboard");

  const [diaryDate, setDiaryDate] = useState(getTodayDateInput);
  const diaryDateRef = useRef(diaryDate);
  const [foods, setFoods] =
    useState<Food[]>([]);

  const [meals, setMeals] =
    useState<Meal[]>(defaultMeals);

  const [goals, setGoals] =
    useState<Goals>(defaultGoals);

  const [weightEntries, setWeightEntries] =
    useState<WeightEntry[]>([]);

  const [bodyProfile, setBodyProfile] =
    useState<BodyProfile>(defaultProfile);

  const [nutritionHistory, setNutritionHistory] =
    useState<NutritionDay[]>([]);

  const [foodDiaryHistory, setFoodDiaryHistory] =
    useState<FoodDiaryDay[]>([]);

  const [dashboardTrainingHistory, setDashboardTrainingHistory] =
    useState<TrainingHistoryEntry[]>([]);

  const [loaded, setLoaded] =
    useState(false);

  const [cloudReady, setCloudReady] = useState(false);

  const [showOnboarding, setShowOnboarding] =
    useState(false);

  const [appMode, setAppMode] =
    useState<AppMode>("guided");

  const [planTier, setPlanTier] = useState<PlanTier>(() => {
    if (typeof window === "undefined") return "free";
    return localStorage.getItem("bodypilot-plan-tier") === "premium" ? "premium" : "free";
  });

  function previewPlanTier(tier: PlanTier) {
    setPlanTier(tier);
    localStorage.setItem("bodypilot-plan-tier", tier);
    window.dispatchEvent(new Event("mucipes-plan-tier-changed"));
  }

  useEffect(() => {
    try {
      const savedFoods =
        localStorage.getItem(
          "bodypilot-foods"
        );

      const savedMeals =
        localStorage.getItem(
          "bodypilot-meals"
        );

      const savedGoals =
        localStorage.getItem(
          "bodypilot-goals"
        );

      const savedWeight =
        localStorage.getItem(
          "bodypilot-weight"
        );

      const savedProfile =
        localStorage.getItem(
          "bodypilot-profile"
        );

      const savedNutritionHistory =
        localStorage.getItem(
          "bodypilot-nutrition-history"
        );

      const savedFoodDiaryHistory =
        localStorage.getItem(
          "bodypilot-food-diary-history"
        );

      const savedFoodDiaryDate =
        localStorage.getItem(
          "bodypilot-food-diary-date"
        );

      const savedAppMode =
        localStorage.getItem("bodypilot-app-mode");

      if (savedAppMode === "guided" || savedAppMode === "self-managed") {
        setAppMode(savedAppMode);
      }

      const today = getTodayDateInput();
      const savedDate =
        normalizeDateKey(savedFoodDiaryDate) || today;
      const parsedFoods = parseFoodList(savedFoods);
      const parsedDiaryHistory =
        parseFoodDiaryHistory(savedFoodDiaryHistory);
      const migratedDiaryHistory =
        migrateLegacyFoodsIntoDiary(
          parsedDiaryHistory,
          parsedFoods,
          savedDate
        );

      setFoodDiaryHistory(migratedDiaryHistory);

      if (savedDate === today && parsedFoods.length > 0) {
        setFoods(parsedFoods);
      } else {
        setFoods(diaryForDate(migratedDiaryHistory, today));
      }

      localStorage.setItem("bodypilot-food-diary-date", today);
      localStorage.setItem(
        "bodypilot-food-diary-history",
        JSON.stringify(migratedDiaryHistory)
      );

      if (savedMeals) {
        const parsedMeals =
          JSON.parse(savedMeals);

        if (
          Array.isArray(parsedMeals) &&
          parsedMeals.length > 0
        ) {
          setMeals(parsedMeals);
        }
      }

      if (savedGoals) {
        setGoals(
          JSON.parse(savedGoals)
        );
      }

      if (savedWeight) {
        const parsedWeight =
          JSON.parse(savedWeight);

        if (
          Array.isArray(parsedWeight)
        ) {
          setWeightEntries(
            parsedWeight
          );
        }
      }

      if (savedProfile) {
        const parsedProfile =
          JSON.parse(savedProfile);

        if (
          parsedProfile &&
          typeof parsedProfile === "object"
        ) {
          setBodyProfile({
            ...defaultProfile,
            ...parsedProfile,
            targetWeight:
              typeof parsedProfile.targetWeight === "number"
                ? parsedProfile.targetWeight
                : typeof parsedProfile.weight === "number"
                  ? parsedProfile.weight
                  : defaultProfile.targetWeight,
            trainingDays:
              typeof parsedProfile.trainingDays === "number"
                ? parsedProfile.trainingDays
                : defaultProfile.trainingDays,
            experience:
              parsedProfile.experience ??
              defaultProfile.experience,
            equipment:
              parsedProfile.equipment ??
              defaultProfile.equipment,
            cardioGoal:
              parsedProfile.cardioGoal ??
              defaultProfile.cardioGoal,
            cardioDays:
              typeof parsedProfile.cardioDays === "number"
                ? parsedProfile.cardioDays
                : defaultProfile.cardioDays,
            cardioType:
              parsedProfile.cardioType ??
              defaultProfile.cardioType,
            preferredTrainingDays:
              Array.isArray(parsedProfile.preferredTrainingDays)
                ? parsedProfile.preferredTrainingDays
                : defaultProfile.preferredTrainingDays,
          });
        }
      }

      if (savedNutritionHistory) {
        const parsedNutritionHistory =
          JSON.parse(savedNutritionHistory);

        if (Array.isArray(parsedNutritionHistory)) {
          setNutritionHistory(parsedNutritionHistory);
        }
      }
    } catch (error) {
      console.error(
        "Could not load CYG data:",
        error
      );
    } finally {
      const onboardingComplete =
        localStorage.getItem("bodypilot-onboarding-complete");

      setShowOnboarding(onboardingComplete !== "true");
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    let cancelled = false;

    async function hydrateFromCloud() {
      const diaryBeforeHydration = parseFoodDiaryHistory(
        localStorage.getItem("bodypilot-food-diary-history")
      );
      const [
        cloudFoods,
        cloudMeals,
        cloudGoals,
        cloudWeight,
        cloudProfile,
        cloudNutritionHistory,
        cloudFoodDiaryHistory,
        cloudAppMode,
        cloudOnboarding,
      ] = await Promise.all([
        loadCloudData<Food[]>("foods"),
        loadCloudData<Meal[]>("meals"),
        loadCloudData<Goals>("goals"),
        loadCloudData<WeightEntry[]>("weight"),
        loadCloudData<BodyProfile>("profile"),
        loadCloudData<NutritionDay[]>("nutrition_history"),
        loadCloudData<FoodDiaryDay[]>("food_diary_history"),
        loadCloudData<AppMode>("app_mode"),
        loadCloudData<boolean>("onboarding"),
      ]);

      if (cancelled) return;

      // Legacy cloud `foods` has no date and must never overwrite today's diary.
      if (Array.isArray(cloudFoodDiaryHistory)) {
        const localDiary = parseFoodDiaryHistory(
          localStorage.getItem("bodypilot-food-diary-history")
        );
        const merged = mergeDatedDiaries(
          parseFoodDiaryHistory(JSON.stringify(cloudFoodDiaryHistory)),
          localDiary,
          diaryBeforeHydration.map(day=>day.date)
        );
        setFoodDiaryHistory(merged);
        const today = getTodayDateInput();
        setDiaryDate(today); diaryDateRef.current = today;
        setFoods(diaryForDate(merged, today));
      } else if (Array.isArray(cloudFoods)) {
        const today = getTodayDateInput();
        setDiaryDate(today); diaryDateRef.current = today;
        setFoods(diaryForDate(diaryBeforeHydration, today));
      }
      if (Array.isArray(cloudMeals) && cloudMeals.length) setMeals(cloudMeals);
      if (cloudGoals) setGoals(cloudGoals);
      if (Array.isArray(cloudWeight)) setWeightEntries(cloudWeight);
      if (cloudProfile) setBodyProfile({ ...defaultProfile, ...cloudProfile });
      if (Array.isArray(cloudNutritionHistory)) setNutritionHistory(local => Array.from(new Map([...cloudNutritionHistory,...local].map(day=>[day.date,day])).values()).sort((a,b)=>a.date.localeCompare(b.date)));

      if (cloudAppMode === "guided" || cloudAppMode === "self-managed") setAppMode(cloudAppMode);
      if (cloudOnboarding === true) setShowOnboarding(false);

      setCloudReady(true);
    }

    void hydrateFromCloud();
    return () => { cancelled = true; };
  }, [loaded]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      "bodypilot-foods",
      JSON.stringify(foods)
    );

    localStorage.setItem(
      "bodypilot-meals",
      JSON.stringify(meals)
    );

    localStorage.setItem(
      "bodypilot-goals",
      JSON.stringify(goals)
    );

    localStorage.setItem(
      "bodypilot-weight",
      JSON.stringify(weightEntries)
    );

    if (cloudReady) {
      void Promise.all([
        saveCloudData("meals", meals),
        saveCloudData("goals", goals),
        saveCloudData("weight", weightEntries),
      ]);
    }

  }, [
    foods,
    meals,
    goals,
    weightEntries,
    loaded,
    cloudReady,
  ]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const today = diaryDate;

    setFoodDiaryHistory((current) => {
      const withoutToday = current.filter((day) => day.date !== today);
      const next = [...withoutToday, { date: today, foods }]
        .sort((a, b) => a.date.localeCompare(b.date))
;

      localStorage.setItem(
        "bodypilot-food-diary-history",
        JSON.stringify(next)
      );
      localStorage.setItem("bodypilot-food-diary-date", today);
      if (cloudReady) void saveCloudData("food_diary_history", next);

      return next;
    });
  }, [foods, diaryDate, loaded, cloudReady]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      "bodypilot-profile",
      JSON.stringify(bodyProfile)
    );
    if (cloudReady) void saveCloudData("profile", bodyProfile);
  }, [bodyProfile, loaded, cloudReady]);

  useEffect(() => {
    if (activePage !== "dashboard") {
      return;
    }

    try {
      const savedTrainingHistory = localStorage.getItem(
        "bodypilot-workout-history"
      );

      if (savedTrainingHistory) {
        const parsed = JSON.parse(savedTrainingHistory);

        if (Array.isArray(parsed)) {
          setDashboardTrainingHistory(parsed);
        }
      } else {
        setDashboardTrainingHistory([]);
      }
    } catch (error) {
      console.error(
        "Could not refresh dashboard training history:",
        error
      );
    }
  }, [activePage]);

  const caloriesEaten =
    foods.reduce(
      (total, food) =>
        total + food.calories,
      0
    );

  const proteinEaten =
    foods.reduce(
      (total, food) =>
        total + food.protein,
      0
    );

  const carbsEaten =
    foods.reduce(
      (total, food) =>
        total + food.carbs,
      0
    );

  const fatEaten =
    foods.reduce(
      (total, food) =>
        total + food.fat,
      0
    );

  useEffect(() => {
    if (!loaded || foods.length === 0) return;

    const candidates = foods
      .filter((food) => !food.micronutrients || Object.keys(food.micronutrients).length === 0)
      .map((food) => {
        const match = food.name.match(/^(.*?)\s*\((\d+(?:\.\d+)?)\s*g\)\s*$/i);
        if (!match) return null;
        return { food, query: match[1].trim(), grams: Number(match[2]) };
      })
      .filter((item): item is { food: Food; query: string; grams: number } => Boolean(item && item.query && item.grams > 0))
      .filter((item) => !micronutrientLookupAttempts.has(`${item.food.id}:${item.query.toLowerCase()}`))
      .slice(0, 8);

    if (candidates.length === 0) return;
    let cancelled = false;

    async function enrichMicronutrients() {
      const patches = new Map<number, Record<string, { value: number; unit: string }>>();
      for (const item of candidates) {
        const attemptKey = `${item.food.id}:${item.query.toLowerCase()}`;
        micronutrientLookupAttempts.add(attemptKey);
        try {
          const response = await fetch(`/api/food-search?query=${encodeURIComponent(item.query)}`);
          if (!response.ok) continue;
          const data = await response.json() as { foods?: FoodSearchApiFood[] };
          const match = data.foods?.find((candidate) => candidate.source === "USDA") ?? data.foods?.[0];
          if (!match) continue;
          const micros = micronutrientsFromApiFood(match, item.grams);
          if (Object.keys(micros).length > 0) patches.set(item.food.id, micros);
        } catch {
          // Keep macro logging usable even when enrichment is unavailable.
        }
      }
      if (cancelled || patches.size === 0) return;
      setFoods((current) => current.map((food) => patches.has(food.id) ? { ...food, micronutrients: patches.get(food.id) } : food));
    }

    void enrichMicronutrients();
    return () => { cancelled = true; };
  }, [loaded, foods]);

  const caloriesRemaining =
    goals.calories - caloriesEaten;

  const proteinRemaining =
    goals.protein - proteinEaten;

  const carbsRemaining =
    goals.carbs - carbsEaten;

  const fatRemaining =
    goals.fat - fatEaten;

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const today = diaryDate;

    setNutritionHistory((current) => {
      const todaySnapshot: NutritionDay = {
        date: today,
        calories: Math.round(caloriesEaten),
        protein: round1(proteinEaten),
        carbs: round1(carbsEaten),
        fat: round1(fatEaten),
      };

      const withoutToday = current.filter(
        (day) => day.date !== today
      );

      const next = [...withoutToday, todaySnapshot]
        .sort(
          (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
        )
;

      localStorage.setItem(
        "bodypilot-nutrition-history",
        JSON.stringify(next)
      );
      if (cloudReady) void saveCloudData("nutrition_history", next);

      return next;
    });
  }, [
    loaded,
    diaryDate,
    caloriesEaten,
    proteinEaten,
    carbsEaten,
    fatEaten,
    cloudReady,
  ]);

  useEffect(() => {
    if (!loaded) return;
    const rollover = () => {
      const today = getTodayDateInput();
      if (today === diaryDateRef.current) return;
      diaryDateRef.current = today;
      let entries: FoodDiaryDay[] = [];
      try { entries = JSON.parse(localStorage.getItem("bodypilot-food-diary-history") || "[]"); } catch {}
      setDiaryDate(today);
      setFoods(diaryForDate(entries, today));
    };
    const timer = window.setInterval(rollover, 1000);
    window.addEventListener("focus", rollover);
    document.addEventListener("visibilitychange", rollover);
    rollover();
    return () => { clearInterval(timer); window.removeEventListener("focus", rollover); document.removeEventListener("visibilitychange", rollover); };
  }, [loaded]);

  function addFood(food: Food) {
    setFoods((current) => [
      ...current,
      food,
    ]);
  }

  function addFoods(
    newFoods: Food[]
  ) {
    setFoods((current) => [
      ...current,
      ...newFoods,
    ]);
  }

  function deleteFood(id: number) {
    setFoods((current) =>
      current.filter(
        (food) => food.id !== id
      )
    );
  }

  function moveFood(
    foodId: number,
    mealId: string
  ) {
    setFoods((current) =>
      current.map((food) =>
        food.id === foodId
          ? {
              ...food,
              mealId,
            }
          : food
      )
    );
  }

  function updateFood(updatedFood: Food) {
    setFoods((current) =>
      current.map((food) =>
        food.id === updatedFood.id ? updatedFood : food
      )
    );
  }

  function duplicateFood(id: number) {
    setFoods((current) => {
      const food = current.find((item) => item.id === id);
      if (!food) return current;

      return [
        ...current,
        {
          ...food,
          id: Date.now() + Math.floor(Math.random() * 1000),
        },
      ];
    });
  }

  function duplicateMeal(mealId: string) {
    setFoods((current) => {
      const mealFoods = current.filter(
        (food) => (food.mealId || "breakfast") === mealId
      );

      if (mealFoods.length === 0) return current;

      const now = Date.now();

      return [
        ...current,
        ...mealFoods.map((food, index) => ({
          ...food,
          id: now + index + 1,
        })),
      ];
    });
  }

  function copyYesterdayFoods() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = [
      yesterday.getFullYear(),
      String(yesterday.getMonth() + 1).padStart(2, "0"),
      String(yesterday.getDate()).padStart(2, "0"),
    ].join("-");

    const previousDay = foodDiaryHistory.find(
      (day) => day.date === yesterdayKey
    );

    if (!previousDay || previousDay.foods.length === 0) {
      return false;
    }

    const now = Date.now();

    setFoods(
      previousDay.foods.map((food, index) => ({
        ...food,
        id: now + index + 1,
      }))
    );

    return true;
  }

  function addMeal(name: string) {
    const cleanName = name.trim();

    if (!cleanName) {
      return;
    }

    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name: cleanName,
    };

    setMeals((current) => [
      ...current,
      newMeal,
    ]);
  }

  function deleteMeal(
    mealId: string
  ) {
    const isDefault =
      defaultMeals.some(
        (meal) =>
          meal.id === mealId
      );

    if (isDefault) {
      return;
    }

    setFoods((current) =>
      current.map((food) =>
        food.mealId === mealId
          ? {
              ...food,
              mealId: "snacks",
            }
          : food
      )
    );

    setMeals((current) =>
      current.filter(
        (meal) =>
          meal.id !== mealId
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f9] text-slate-950">
      {loaded && showOnboarding && (
        <OnboardingModal
          profile={bodyProfile}
          setProfile={setBodyProfile}
          onComplete={(mode) => {
            setAppMode(mode);
            localStorage.setItem("bodypilot-app-mode", mode);
            localStorage.setItem(
              "bodypilot-onboarding-complete",
              "true"
            );
            void saveCloudData("app_mode", mode);
            void saveCloudData("onboarding", true);
            setShowOnboarding(false);
            setActivePage(mode === "guided" ? "plan" : "dashboard");
          }}
        />
      )}
      <nav className="sticky top-0 z-50 hidden border-b border-slate-200 bg-white/95 backdrop-blur md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <button
            onClick={() => setActivePage("dashboard")}
            className="flex items-center gap-3 text-xl font-black tracking-tight"
          >
            <img src={cygLogo.src} alt="CYG" className="h-11 w-11 rounded-xl object-cover" />
            <span>CYG<small className="block text-[10px] font-semibold tracking-widest text-slate-500">Choose Your Goal</small></span>
          </button>

          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
            <AppNavButton label="Home" page="dashboard" activePage={activePage} setActivePage={setActivePage} />
            <AppNavButton label="Workout" page="training" activePage={activePage} setActivePage={setActivePage} />
            <AppNavButton label="Nutrition" page="nutrition" activePage={activePage} setActivePage={setActivePage} />
            {appMode === "guided" && (
              <AppNavButton label="Plan" page="plan" activePage={activePage} setActivePage={setActivePage} />
            )}
            {pinLooks && <AppNavButton label="Looksmaxing" page="looksmaxing" activePage={activePage} setActivePage={setActivePage} />}
            <AppNavButton label="More" page="profile" activePage={activePage} setActivePage={setActivePage} />
          </div>
        </div>
      </nav>

      <SyncStatus />
      <div className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6 sm:py-10 md:pb-10">
        {activePage ===
          "dashboard" && (
          <Dashboard
            goals={goals}
            caloriesEaten={
              caloriesEaten
            }
            proteinEaten={
              proteinEaten
            }
            carbsEaten={
              carbsEaten
            }
            fatEaten={
              fatEaten
            }
            caloriesRemaining={
              caloriesRemaining
            }
            weightEntries={
              weightEntries
            }
            trainingHistory={
              dashboardTrainingHistory
            }
            bodyProfile={bodyProfile}
            nutritionHistory={nutritionHistory}
            displaySettings={globalDisplay}
            setActivePage={
              setActivePage
            }
          />
        )}

        {activePage ===
          "nutrition" && (
          <NutritionHub key={diaryDate}
            foods={foods}
            meals={meals}
            goals={goals}
            setGoals={
              setGoals
            }
            addFood={addFood}
            addFoods={addFoods}
            deleteFood={
              deleteFood
            }
            moveFood={
              moveFood
            }
            addMeal={addMeal}
            deleteMeal={
              deleteMeal
            }
            caloriesEaten={
              caloriesEaten
            }
            proteinEaten={
              proteinEaten
            }
            carbsEaten={
              carbsEaten
            }
            fatEaten={
              fatEaten
            }
            caloriesRemaining={
              caloriesRemaining
            }
            proteinRemaining={
              proteinRemaining
            }
            carbsRemaining={
              carbsRemaining
            }
            fatRemaining={
              fatRemaining
            }
            nutritionHistory={
              nutritionHistory
            }
            foodDiaryHistory={foodDiaryHistory}
            onUpdateDiary={(date, updatedFoods)=>{
              if(date===diaryDate){setFoods(updatedFoods);return;}
              const diary=[...foodDiaryHistory.filter(d=>d.date!==date),{date,foods:updatedFoods}].sort((a,b)=>a.date.localeCompare(b.date));
              const totals=updatedFoods.reduce((t,f)=>({calories:t.calories+f.calories,protein:t.protein+f.protein,carbs:t.carbs+f.carbs,fat:t.fat+f.fat}),{calories:0,protein:0,carbs:0,fat:0});
              const snapshots=[...nutritionHistory.filter(d=>d.date!==date),{date,...totals}].sort((a,b)=>a.date.localeCompare(b.date));
              setFoodDiaryHistory(diary);setNutritionHistory(snapshots);
              localStorage.setItem("bodypilot-food-diary-history",JSON.stringify(diary));localStorage.setItem("bodypilot-nutrition-history",JSON.stringify(snapshots));
              if(cloudReady){void saveCloudData("food_diary_history",diary);void saveCloudData("nutrition_history",snapshots);}
            }}
            updateFood={updateFood}
            duplicateFood={duplicateFood}
            duplicateMeal={duplicateMeal}
            copyYesterdayFoods={copyYesterdayFoods}
            displaySettings={globalDisplay}
            planTier={planTier}
          />
        )}

        {activePage ===
          "training" && (
          <Training />
        )}

        {appMode === "guided" && activePage ===
          "plan" && (
          <GetFitPlan
            profile={bodyProfile}
            setProfile={setBodyProfile}
            goals={goals}
            setGoals={setGoals}
            weightEntries={weightEntries}
            nutritionHistory={nutritionHistory}
            setActivePage={setActivePage}
            displaySettings={globalDisplay}
          />
        )}

        {activePage ===
          "progress" && (
          <Progress
            weightEntries={
              weightEntries
            }
            setWeightEntries={
              setWeightEntries
            }
            displaySettings={globalDisplay}
          />
        )}

        {activePage === "looksmaxing" && (
          <Looksmaxing planTier={planTier} onPreviewPremium={() => previewPlanTier("premium")} />
        )}

        {activePage === "profile" && (
          <ProfilePage
            profile={bodyProfile}
            setProfile={setBodyProfile}
            appMode={appMode}
            setAppMode={setAppMode}
            setActivePage={setActivePage}
            trainingHistory={dashboardTrainingHistory}
            nutritionHistory={nutritionHistory}
            goals={goals}
            weightEntries={weightEntries}
            displaySettings={globalDisplay}
            planTier={planTier}
            setPlanTier={previewPlanTier}
          />
        )}
      </div>

      <nav className="cyg-mobile-nav fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          <MobileNavButton icon="⌂" label="Home" page="dashboard" activePage={activePage} setActivePage={setActivePage} />
          <MobileNavButton icon="◉" label="Workout" page="training" activePage={activePage} setActivePage={setActivePage} />
          <MobileNavButton icon="●" label="Nutrition" page="nutrition" activePage={activePage} setActivePage={setActivePage} />
          {appMode === "guided" && (
            <MobileNavButton icon="✦" label="Plan" page="plan" activePage={activePage} setActivePage={setActivePage} />
          )}
          {pinLooks && <MobileNavButton icon="✧" label="Looksmaxing" page="looksmaxing" activePage={activePage} setActivePage={setActivePage} />}
          <MobileNavButton icon="•••" label="More" page="profile" activePage={activePage} setActivePage={setActivePage} />
        </div>
      </nav>
    </main>
  );
}

function OnboardingModal({
  profile,
  setProfile,
  onComplete,
}: {
  profile: BodyProfile;
  setProfile: React.Dispatch<React.SetStateAction<BodyProfile>>;
  onComplete: (mode: AppMode) => void;
}) {
  const [draft, setDraft] = useState<BodyProfile>({
    ...profile,
    preferredTrainingDays:
      profile.preferredTrainingDays ??
      defaultProfile.preferredTrainingDays,
  });
  const [step, setStep] = useState(-1);

  const steps = [
    "Goal",
    "Body",
    "Training",
    "Cardio",
  ];

  function update<K extends keyof BodyProfile>(
    key: K,
    value: BodyProfile[K]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function finish() {
    setProfile(draft);
    onComplete("guided");
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/15 p-4 backdrop-blur-sm">
      <div className="mx-auto my-6 max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              Welcome to CYG
            </p>
            <h1 className="mt-2 text-3xl font-black">
              {step === -1 ? "Choose your CYG experience" : "Personalize your starting plan"}
            </h1>
          </div>
          <span className="text-sm text-slate-500">
            {step === -1 ? "Start" : `${step + 1}/${steps.length}`}
          </span>
        </div>

        {step === -1 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {["Training","Nutrition","Progress","Adaptive plan"].map(item=><span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600">{item}</span>)}
          </div>
        )}

        {step >= 0 && (
        <div className="mt-6 flex gap-2">
          {steps.map((name, index) => (
            <div key={name} className="flex-1">
              <div
                className={`h-1.5 rounded-full ${
                  index <= step
                    ? "bg-blue-500"
                    : "bg-slate-100"
                }`}
              />
              <p className="mt-2 hidden text-xs text-slate-600 sm:block">
                {name}
              </p>
            </div>
          ))}
        </div>
        )}

        {step === -1 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setStep(0)}
              className="rounded-3xl border border-blue-500 bg-blue-500/10 p-6 text-left transition hover:bg-blue-500/15"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Guided</p>
              <h2 className="mt-3 text-2xl font-black">Guided by CYG</h2>
              <p className="mt-3 leading-6 text-slate-600">CYG builds your nutrition, training and cardio plan from your goals and progress, then helps you adjust it over time.</p>
              <p className="mt-5 font-semibold text-blue-600">Create my plan →</p>
            </button>

            <button
              onClick={() => onComplete("self-managed")}
              className="rounded-3xl border border-slate-200 bg-white p-6 text-left transition hover:border-slate-400"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Experienced</p>
              <h2 className="mt-3 text-2xl font-black">Self-managed</h2>
              <p className="mt-3 leading-6 text-slate-600">Use CYG as your tracker. Set your own targets, build your own workouts and log nutrition, weight and progress yourself.</p>
              <p className="mt-5 font-semibold text-slate-950">Go to dashboard →</p>
            </button>
          </div>
        )}

        {step === 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold">
              What do you want to achieve?
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["lose", "Lose fat", "Create a controlled deficit"],
                ["maintain", "Maintain", "Keep weight roughly stable"],
                ["gain", "Build muscle", "Support gradual weight gain"],
              ].map(([value, title, detail]) => (
                <button
                  key={value}
                  onClick={() =>
                    update("goal", value as FitnessGoal)
                  }
                  className={`rounded-2xl border p-5 text-left ${
                    draft.goal === value
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="font-bold">{title}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {detail}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <PlanSelect
              label="Sex"
              value={draft.sex}
              onChange={(value) =>
                update("sex", value as Sex)
              }
              options={[
                ["male", "Male"],
                ["female", "Female"],
              ]}
            />
            <PlanNumber
              label="Age"
              value={draft.age}
              unit="years"
              min={18}
              max={100}
              step={1}
              onChange={(value) => update("age", value)}
            />
            <PlanNumber
              label="Height"
              value={draft.height}
              unit="cm"
              min={120}
              max={230}
              step={1}
              onChange={(value) => update("height", value)}
            />
            <PlanNumber
              label="Weight"
              value={draft.weight}
              unit="kg"
              min={35}
              max={300}
              step={0.1}
              onChange={(value) => update("weight", value)}
            />
            <PlanNumber
              label="Target weight"
              value={draft.targetWeight}
              unit="kg"
              min={35}
              max={300}
              step={0.1}
              onChange={(value) =>
                update("targetWeight", value)
              }
            />
            <PlanSelect
              label="Activity"
              value={draft.activity}
              onChange={(value) =>
                update(
                  "activity",
                  value as ActivityLevel
                )
              }
              options={[
                ["sedentary", "Sedentary"],
                ["light", "Lightly active"],
                ["moderate", "Moderately active"],
                ["very", "Very active"],
                ["athlete", "Athlete / highly active"],
              ]}
            />
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <PlanSelect
              label="Training days"
              value={String(draft.trainingDays)}
              onChange={(value) =>
                update("trainingDays", Number(value))
              }
              options={[
                ["2", "2 days / week"],
                ["3", "3 days / week"],
                ["4", "4 days / week"],
                ["5", "5 days / week"],
                ["6", "6 days / week"],
              ]}
            />
            <PlanSelect
              label="Experience"
              value={draft.experience}
              onChange={(value) =>
                update(
                  "experience",
                  value as BodyProfile["experience"]
                )
              }
              options={[
                ["beginner", "Beginner"],
                ["intermediate", "Intermediate"],
                ["advanced", "Advanced"],
              ]}
            />
            <PlanSelect
              label="Equipment"
              value={draft.equipment}
              onChange={(value) =>
                update(
                  "equipment",
                  value as BodyProfile["equipment"]
                )
              }
              options={[
                ["full-gym", "Full gym"],
                ["home", "Home gym / dumbbells"],
                ["bodyweight", "Bodyweight only"],
              ]}
            />
          </div>
        )}

        {step === 3 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <PlanSelect
              label="Cardio goal"
              value={draft.cardioGoal}
              onChange={(value) =>
                update(
                  "cardioGoal",
                  value as BodyProfile["cardioGoal"]
                )
              }
              options={[
                ["none", "No planned cardio"],
                ["health", "General health"],
                ["fat-loss", "Fat loss support"],
                ["endurance", "Improve endurance"],
                ["performance", "Sport performance"],
              ]}
            />
            {draft.cardioGoal !== "none" && (
              <>
                <PlanSelect
                  label="Cardio days"
                  value={String(draft.cardioDays)}
                  onChange={(value) =>
                    update("cardioDays", Number(value))
                  }
                  options={[
                    ["1", "1 day / week"],
                    ["2", "2 days / week"],
                    ["3", "3 days / week"],
                    ["4", "4 days / week"],
                    ["5", "5 days / week"],
                  ]}
                />
                <PlanSelect
                  label="Preferred cardio"
                  value={draft.cardioType}
                  onChange={(value) =>
                    update(
                      "cardioType",
                      value as BodyProfile["cardioType"]
                    )
                  }
                  options={[
                    ["walking", "Walking"],
                    ["running", "Running"],
                    ["cycling", "Cycling"],
                    ["incline-walk", "Incline treadmill"],
                    ["stairmaster", "Stairmaster"],
                    ["rowing", "Rowing"],
                  ]}
                />
              </>
            )}
          </div>
        )}

        {step >= 0 && (
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
          <button
            onClick={() =>
              setStep((current) => Math.max(-1, current - 1))
            }
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold"
          >
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() =>
                setStep((current) =>
                  Math.min(steps.length - 1, current + 1)
                )
              }
              className="rounded-xl bg-blue-500 px-6 py-3 font-bold text-white hover:bg-blue-400"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={finish}
              className="rounded-xl bg-blue-500 px-6 py-3 font-bold text-white hover:bg-blue-400"
            >
              Create my plan
            </button>
          )}
        </div>
        )}
      </div>
    </div>
  );
}



type MorePanel = "calendar" | "achievements" | "notifications" | "devices" | "support" | "about" | "account" | "friends" | "coach";

function MoreActionCard({
  title,
  detail,
  onClick,
}: {
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-black text-slate-900">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className="text-xl text-slate-300">›</span>
      </div>
    </button>
  );
}

function morePanelTitle(panel: MorePanel) {
  return ({
    calendar: "Calendar",
    achievements: "Achievements",
    notifications: "Notifications",
    devices: "Apps & Devices",
    support: "Support",
    about: "About CYG",
    account: "Account & Sync",
    friends: "Friends",
    coach: "CYG Coach",
  } as Record<MorePanel, string>)[panel];
}

function MorePanelContent({
  panel,
  trainingHistory,
  nutritionHistory,
  goals,
  weightEntries,
  displaySettings,
}: {
  panel: MorePanel;
  trainingHistory: TrainingHistoryEntry[];
  nutritionHistory: NutritionDay[];
  goals: Goals;
  weightEntries: WeightEntry[];
  displaySettings: ReturnType<typeof readMucipesDisplaySettings>;
}) {
  const completedSets = trainingHistory.reduce(
    (sum, workout) =>
      sum +
      workout.exercises.reduce(
        (exerciseSum, exercise) =>
          exerciseSum + exercise.sets.filter((set) => set.completed).length,
        0
      ),
    0
  );

  if (panel === "calendar") {
    const recentWorkouts = [...trainingHistory]
      .sort((a,b) => new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime())
      .slice(0, 6);
    return (
      <div className="mt-6 space-y-3">
        <p className="text-sm text-slate-500">Recent training and nutrition activity.</p>
        {recentWorkouts.map((workout) => (
          <div key={workout.id} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex justify-between gap-3">
              <p className="font-black text-slate-900">{workout.name}</p>
              <p className="text-xs text-slate-600">{new Date(workout.finishedAt).toLocaleDateString()}</p>
            </div>
            <p className="mt-1 text-sm text-slate-500">{Math.round(workout.durationSeconds/60)} min · {workout.exercises.length} exercises</p>
          </div>
        ))}
        {recentWorkouts.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No workouts logged yet.</p>}
        <p className="pt-2 text-xs font-bold uppercase tracking-widest text-slate-600">{nutritionHistory.length} nutrition days saved</p>
      </div>
    );
  }

  if (panel === "achievements") {
    return (
      <div className="mt-6 grid grid-cols-2 gap-3">
        <MoreStat label="Workouts logged" value={trainingHistory.length} />
        <MoreStat label="Completed sets" value={completedSets} />
        <MoreStat label="Nutrition days" value={nutritionHistory.length} />
        <MoreStat label="Milestone" value={trainingHistory.length >= 10 ? "10+ workouts" : `${Math.max(0,10-trainingHistory.length)} to 10`} />
      </div>
    );
  }

  if (panel === "notifications") {
    return (
      <div className="mt-6 space-y-3">
        <MoreToggle storageKey="bodypilot-notify-workout" title="Workout reminder" detail="Remind me about planned training." />
        <MoreToggle storageKey="bodypilot-notify-nutrition" title="Nutrition reminder" detail="Remind me to finish daily logging." />
        <MoreToggle storageKey="bodypilot-notify-weighin" title="Weigh-in reminder" detail="Weekly bodyweight reminder." />
      </div>
    );
  }

  if (panel === "devices") {
    return (
      <div className="mt-6 space-y-3">
        {["Apple Health", "Garmin", "Strava"].map((name) => (
          <div key={name} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div><p className="font-black">{name}</p><p className="text-xs text-slate-500">External platform connection requires its production API and user permission.</p></div>
            <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">Soon</span>
          </div>
        ))}
      </div>
    );
  }

  if (panel === "support") {
    return (
      <div className="mt-6 space-y-3 text-sm text-slate-600">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="font-black text-slate-900">Quick help</p><p className="mt-1">Your data is synced to your CYG cloud account with local browser caching for fast loading.</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="font-black text-slate-900">Feedback</p><p className="mt-1">Support and feedback submission will connect to the production backend later.</p></div>
      </div>
    );
  }

  return <AboutContactCard />;
}

function AboutContactCard() {
  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" aria-label="About CYG">
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 p-6 sm:p-8">
        <img src={cygLogo.src} alt="CYG logo" className="h-20 w-20 rounded-2xl object-cover shadow-lg" />
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Choose Your Goal</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white">CYG by Mucipes</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-blue-100">Training, nutrition and progress in one focused app.</p>
      </div>
      <div className="p-5 sm:p-8">
        <h3 className="text-lg font-black text-slate-950">Stay connected</h3>
        <p className="mt-1 text-sm text-slate-500">Follow our updates or get in touch.</p>
        <div className="mt-5 grid gap-3">
          <a href="https://www.instagram.com/chooseyourgoal/" target="_blank" rel="noopener noreferrer" className="group flex min-h-20 items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-950 text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </span>
            <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-500">Instagram</span><span className="mt-1 block break-words text-sm font-bold text-slate-950">@chooseyourgoal</span></span>
            <span aria-hidden="true" className="text-xl text-blue-800">↗</span>
            <span className="sr-only">Opens in a new tab</span>
          </a>
          <a href="mailto:chooseyourowngoal@gmail.com" className="flex min-h-20 items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-blue-950">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>
            </span>
            <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-500">Email</span><span className="mt-1 block break-all text-sm font-bold text-slate-950">chooseyourowngoal@gmail.com</span></span>
            <span aria-hidden="true" className="text-xl text-blue-800">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function MoreStat({label,value}:{label:string;value:string|number}) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</p><p className="mt-2 text-xl font-black">{value}</p></div>;
}

function MoreToggle({storageKey,title,detail}:{storageKey:string;title:string;detail:string}) {
  const [enabled,setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKey) === "true";
  });
  return (
    <button onClick={() => { const next=!enabled; setEnabled(next); localStorage.setItem(storageKey,String(next)); }} className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 text-left">
      <div><p className="font-black text-slate-900">{title}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>
      <span className={`relative h-7 w-12 rounded-full transition ${enabled ? "bg-blue-500" : "bg-slate-200"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${enabled ? "left-6" : "left-1"}`} /></span>
    </button>
  );
}


function CloudFeatureFallback({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return <div className="rounded-xl border border-slate-200 bg-white p-5 text-slate-700">Account and Friends need the Supabase URL and publishable key configured for this deployment.</div>;
  }
  return <>{children}</>;
}

function MoreFullPage({
  page,
  trainingHistory,
  nutritionHistory,
  profile,
}: {
  page: MorePanel;
  trainingHistory: TrainingHistoryEntry[];
  nutritionHistory: NutritionDay[];
  profile: BodyProfile;
}) {
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  if (page === "account") {
    return <CloudFeatureFallback><AccountPanel /></CloudFeatureFallback>;
  }

  if (page === "calendar") {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const first = new Date(year, month, 1);
    const days = new Date(year, month + 1, 0).getDate();
    const calendarSettings = readMucipesDisplaySettings();
    const mondayOffset = calendarSettings.weekStarts === "sunday" ? first.getDay() : (first.getDay() + 6) % 7;
    const workoutDates = new Set(trainingHistory.map(w => w.finishedAt.slice(0,10)));
    const nutritionDates = new Set(nutritionHistory.map((d:any) => String(d.date).slice(0,10)));
    const cells = Array.from({length:mondayOffset + days}, (_,i) => i < mondayOffset ? null : i-mondayOffset+1);
    const keyFor=(day:number)=>`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const selectedWorkouts = selectedDay ? trainingHistory.filter(w=>w.finishedAt.slice(0,10)===selectedDay) : [];

    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_.55fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <button onClick={()=>setCalendarMonth(new Date(year,month-1,1))} className="rounded-xl border border-slate-200 px-3 py-2 font-black">←</button>
            <h2 className="text-xl font-black">{calendarMonth.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h2>
            <button onClick={()=>setCalendarMonth(new Date(year,month+1,1))} className="rounded-xl border border-slate-200 px-3 py-2 font-black">→</button>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-600">
            {(calendarSettings.weekStarts === "sunday" ? ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]).map(d=><div key={d}>{d}</div>)}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {cells.map((day,i)=>{
              if(!day) return <div key={`e-${i}`} />;
              const key=keyFor(day);
              const workout=workoutDates.has(key), nutrition=nutritionDates.has(key);
              return (
                <button key={key} onClick={()=>setSelectedDay(key)}
                  className={`min-h-20 rounded-2xl border p-2 text-left transition ${selectedDay===key?"border-blue-500 bg-blue-50":"border-slate-200 hover:bg-slate-50"}`}>
                  <span className="font-black text-slate-800">{day}</span>
                  <div className="mt-3 flex gap-1">
                    {workout && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                    {nutrition && <span className="h-2 w-2 rounded-full bg-amber-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-black">{selectedDay || "Select a day"}</h3>
          <div className="mt-4 space-y-3">
            {selectedWorkouts.map(w=><div key={w.id} className="rounded-2xl bg-slate-50 p-4"><p className="font-black">{w.name}</p><p className="mt-1 text-sm text-slate-500">{Math.round(w.durationSeconds/60)} min · {w.exercises.length} exercises</p></div>)}
            {selectedDay && selectedWorkouts.length===0 && <p className="text-sm text-slate-500">No workout logged on this day.</p>}
          </div>
        </section>
      </div>
    );
  }

  if (page === "achievements") {
    const totalSets=trainingHistory.reduce((sum,w)=>sum+w.exercises.reduce((a,e)=>a+e.sets.filter(x=>x.completed).length,0),0);
    const totalVolume=Math.round(trainingHistory.reduce((sum,w)=>sum+w.exercises.reduce((a,e)=>a+e.sets.reduce((z,x)=>z+(x.weight||0)*(x.reps||0),0),0),0));
    const achievements=[
      ["First Flight","Complete your first workout",trainingHistory.length>=1],
      ["Consistency","Complete 10 workouts",trainingHistory.length>=10],
      ["Century","Complete 100 working sets",totalSets>=100],
      ["Volume Builder","Lift 100,000 kg total volume",totalVolume>=100000],
      ["Nutrition Logger","Save 7 nutrition days",nutritionHistory.length>=7],
      ["Committed","Complete 50 workouts",trainingHistory.length>=50],
    ];
    return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{achievements.map(([title,detail,done]:any)=><div key={title} className={`rounded-3xl border p-5 ${done?"border-blue-200 bg-blue-50":"border-slate-200 bg-white"}`}><div className={`grid h-12 w-12 place-items-center rounded-2xl text-xl font-black ${done?"bg-blue-500 text-white":"bg-slate-100 text-slate-600"}`}>{done?"✓":"○"}</div><p className="mt-4 text-lg font-black">{title}</p><p className="mt-1 text-sm text-slate-500">{detail}</p></div>)}</div>;
  }

  if (page === "notifications") {
    return <div className="max-w-2xl space-y-4"><MoreToggle storageKey="bodypilot-notify-workout" title="Workout reminder" detail="Remind me about today's planned workout."/><MoreToggle storageKey="bodypilot-notify-nutrition" title="Nutrition reminder" detail="Remind me if daily nutrition logging is incomplete."/><MoreToggle storageKey="bodypilot-notify-weighin" title="Weekly weigh-in" detail="Get a weekly reminder to record bodyweight."/><MoreToggle storageKey="bodypilot-notify-rest" title="Rest-day check-in" detail="CYG can surface recovery reminders."/></div>;
  }

  if (page === "devices") {
    const devices = [
      { name: "Apple Health", detail: "Health, workouts, weight and activity", status: "Native iOS bridge required" },
      { name: "Apple Watch", detail: "Workout and heart-rate data", status: "Syncs through Apple Health" },
      { name: "Health Connect", detail: "Android health and activity data", status: "Native Android bridge required" },
      { name: "Garmin", detail: "Training and activity data", status: "Garmin API authorization required" },
      { name: "Strava", detail: "Workout activity sync", status: "OAuth integration not configured" },
    ];
    return <div className="space-y-4"><div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900"><p className="font-black">No fake connections</p><p className="mt-1">CYG only shows a connection as available when the required platform authorization is actually configured. Your current web build keeps these integrations read-only on this screen.</p></div><div className="grid gap-4 md:grid-cols-2">{devices.map((device)=><div key={device.name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-lg font-black">{device.name}</p><p className="mt-1 text-sm text-slate-500">{device.detail}</p></div><span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500">Unavailable</span></div><div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">{device.status}</div></div>)}</div></div>;
  }

  if (page === "support") {
    return <div className="grid gap-4 lg:grid-cols-2"><section className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-black">Help center</h2><div className="mt-5 space-y-3">{[
      ["How do I start a workout?","Open Workout, choose Start New Workout or a saved routine, add exercises and complete each set. Your finished session feeds History, Progress, Coach and weekly summaries."],
      ["How is my calorie goal calculated?","Guided Plan estimates a starting target from your profile, activity and goal. Weekly trend data can suggest small adjustments that you choose whether to apply."],
      ["Where is my data stored?","CYG keeps a fast local browser cache and syncs supported app data to your Supabase account."],
      ["How do I back up CYG?","Open More → Data & Backup to export a JSON backup. The same screen can restore that file later."],
    ].map(([q,a])=><details key={q} className="rounded-2xl bg-slate-50 p-4"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{a}</p></details>)}</div></section><FeedbackBox /></div>;
  }

  return (
    <div className="max-w-3xl space-y-5">
      <AboutContactCard />
      <section className="grid gap-3 sm:grid-cols-3">
        <MoreStat label="Mode" value="CYG" />
        <MoreStat label="Storage" value="Cloud + local" />
        <MoreStat label="Profile" value={formatWeight(profile.weight, readMucipesDisplaySettings().units)} />
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h3 className="font-black">About this version</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">Core training, nutrition, progress, social, fasting and guided-plan flows are active. External health/device integrations remain intentionally unavailable until their platform authorization is configured.</p>
      </section>
    </div>
  );
}

function FeedbackBox() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function submitFeedback() {
    const clean = text.trim();
    if (!clean || status === "saving") return;
    setStatus("saving");
    const entry = { id: `${Date.now()}`, createdAt: new Date().toISOString(), message: clean };
    try {
      const raw = localStorage.getItem("bodypilot-feedback");
      const current = raw ? JSON.parse(raw) : [];
      const next = [...(Array.isArray(current) ? current : []), entry].slice(-50);
      localStorage.setItem("bodypilot-feedback", JSON.stringify(next));
      await saveCloudData("feedback", next);
      setText("");
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch (error) {
      console.error("Could not save feedback", error);
      setStatus("error");
    }
  }

  return <section className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-black">Send feedback</h2><p className="mt-2 text-sm text-slate-500">Share your ideas or report a problem.</p><textarea value={text} onChange={(event)=>{setText(event.target.value); if(status==="error") setStatus("idle");}} className="mt-4 min-h-40 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-blue-400" placeholder="Tell us what should be improved..." /><div className="mt-3 flex flex-wrap items-center gap-3"><button type="button" disabled={!text.trim() || status==="saving"} onClick={()=>void submitFeedback()} className="rounded-xl bg-blue-500 px-5 py-3 font-black text-white disabled:opacity-50">{status==="saving"?"Saving…":status==="saved"?"Saved ✓":"Send feedback"}</button>{status==="error"&&<p className="text-sm font-semibold text-red-500">Could not sync feedback. Try again.</p>}</div></section>;
}

function ProfilePage({
  profile,
  setProfile,
  appMode,
  setAppMode,
  setActivePage,
  trainingHistory,
  nutritionHistory,
  goals,
  weightEntries,
  displaySettings,
  planTier,
  setPlanTier,
}: {
  profile: BodyProfile;
  setProfile: React.Dispatch<React.SetStateAction<BodyProfile>>;
  appMode: AppMode;
  setAppMode: React.Dispatch<React.SetStateAction<AppMode>>;
  setActivePage: React.Dispatch<React.SetStateAction<Page>>;
  trainingHistory: TrainingHistoryEntry[];
  nutritionHistory: NutritionDay[];
  goals: Goals;
  weightEntries: WeightEntry[];
  displaySettings: ReturnType<typeof readMucipesDisplaySettings>;
  planTier: PlanTier;
  setPlanTier: (tier: PlanTier) => void;
}) {
  const [morePage, setMorePage] = useState<
    "main" | "calendar" | "achievements" | "notifications" | "devices" | "support" | "about" | "account" | "friends" | "coach"
  >("main");
  const [detailPage, setDetailPage] = useState<"main" | "profile" | "goals" | "display" | "data" | "fasting">("main");
  const [moreSearch, setMoreSearch] = useState("");
  const [showLooksShortcut, setShowLooksShortcut] = useState(false);
  useEffect(() => setShowLooksShortcut(localStorage.getItem("cyg-pin-looksmaxing") === "true"), []);
  const [profileSaved, setProfileSaved] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    const intent = localStorage.getItem("mucipes-more-detail-intent");
    if (intent === "fasting" || intent === "profile" || intent === "goals" || intent === "display" || intent === "data") {
      setDetailPage(intent);
      localStorage.removeItem("mucipes-more-detail-intent");
    }
  }, []);

  type Settings = {
    units: "metric" | "imperial";
    weekStarts: "monday" | "sunday";
    appearance: "light" | "dark" | "system";
    energyUnit: "kcal" | "kj";
    density: "comfortable" | "compact";
    showRir: boolean;
    restTimer: boolean;
    restSeconds: number;
  };

  const defaultSettings: Settings = {
    units: "metric",
    weekStarts: "monday",
    appearance: "light",
    energyUnit: "kcal",
    density: "comfortable",
    showRir: true,
    restTimer: true,
    restSeconds: 120,
  };

  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === "undefined") return defaultSettings;
    try {
      const saved = localStorage.getItem("bodypilot-settings");
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    void loadCloudData<Settings>("settings").then((cloud) => {
      if (cloud) {
        setSettings((current) => ({ ...current, ...cloud }));
      }
    });
  }, []);

  function updateSettings(patch: Partial<Settings>) {
    setSettings((current) => ({ ...current, ...patch }));
    setSettingsSaved(false);
  }

  async function saveSettingsNow() {
    localStorage.setItem("bodypilot-settings", JSON.stringify(settings));
    try {
      await saveCloudData("settings", settings);
      window.dispatchEvent(new Event("mucipes-settings-changed"));
      setSettingsSaved(true);
      window.setTimeout(() => setSettingsSaved(false), 1800);
    } catch (error) {
      console.error("Could not save CYG display settings:", error);
      alert("Settings were saved on this device, but cloud sync failed.");
    }
  }

  function update<K extends keyof BodyProfile>(key: K, value: BodyProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setProfileSaved(false);
  }

  function changeMode(mode: AppMode) {
    setAppMode(mode);
    localStorage.setItem("bodypilot-app-mode", mode);
    void saveCloudData("app_mode", mode);
  }

  function saveProfileNow() {
    localStorage.setItem("bodypilot-profile", JSON.stringify(profile));
    void saveCloudData("profile", profile);
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 1800);
  }

  async function importBackup(file: File) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { localData?: Record<string, unknown> };
      if (!parsed || typeof parsed !== "object" || !parsed.localData || typeof parsed.localData !== "object") {
        alert("This does not look like a CYG backup.");
        return;
      }
      if (!window.confirm("Import this backup? Existing CYG local data with the same keys will be replaced.")) return;
      for (const [key, value] of Object.entries(parsed.localData)) {
        if (!["bodypilot-","mucipes-","cyg-"].some(prefix=>key.startsWith(prefix))) continue;
        localStorage.setItem(key, JSON.stringify(value));
      }
      window.dispatchEvent(new Event("mucipes-settings-changed"));
      alert("Backup imported. CYG will reload now.");
      window.location.reload();
    } catch (error) {
      console.error("CYG backup import failed", error);
      alert("Could not import this backup file.");
    }
  }

  function exportBackup() {
    const backup: Record<string, unknown> = {
      exportedAt: new Date().toISOString(),
      app: "CYG",
      profile,
      settings,
      appMode,
      trainingHistory,
      nutritionHistory,
    };
    const localData: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !["bodypilot-","mucipes-","cyg-"].some(prefix=>key.startsWith(prefix))) continue;
      const raw = localStorage.getItem(key);
      try { localData[key] = raw ? JSON.parse(raw) : null; }
      catch { localData[key] = raw; }
    }
    backup.localData = localData;
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mucipes-backup-${getTodayDateInput()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const goalLabel = profile.goal === "lose" ? "Lose fat" : profile.goal === "gain" ? "Build muscle" : "Maintain";
  const openDetail = (page: "profile" | "goals" | "display" | "data" | "fasting") => {
    setDetailPage(page);
  };

  const moreItems: Array<{ title: string; detail: string; icon: string; action: () => void }> = [
    { title: "Account", detail: "Login, security and cloud sync", icon: "◎", action: () => setMorePage("account") },
    { title: "Profile", detail: "Personal information and physical stats", icon: "○", action: () => openDetail("profile") },
    { title: "Goals & Targets", detail: "Weight, nutrition and training goals", icon: "◉", action: () => openDetail("goals") },
    { title: "Display & Appearance", detail: "Units and app preferences", icon: "▣", action: () => openDetail("display") },
    { title: "Fasting", detail: "Timer, schedule, history and streaks", icon: "◷", action: () => openDetail("fasting") },
    { title: "Looksmaxing", detail: planTier === "premium" ? "Premium appearance routine, scans and progress" : "Preview the Premium appearance module", icon: "✦", action: () => setActivePage("looksmaxing") },
    { title: "Show Looksmaxing in navigation", detail: showLooksShortcut ? "On · shown beside Workout and Nutrition" : "Off · available from More", icon: showLooksShortcut ? "✓" : "＋", action: () => { const next = !showLooksShortcut; setShowLooksShortcut(next); localStorage.setItem("cyg-pin-looksmaxing", String(next)); window.dispatchEvent(new Event("cyg-navigation")); } },
    { title: "Friends", detail: "Add friends and control what they can see", icon: "♧", action: () => setMorePage("friends") },
    { title: "CYG Coach", detail: "Insights across training, nutrition and progress", icon: "✦", action: () => setMorePage("coach") },
    { title: "Progress", detail: "Weight, strength, records and measurements", icon: "↗", action: () => setActivePage("progress") },
    { title: "Calendar", detail: "Workout and nutrition history", icon: "□", action: () => setMorePage("calendar") },
    { title: "Achievements", detail: "PRs, streaks and milestones", icon: "★", action: () => setMorePage("achievements") },
    { title: "Notifications", detail: "Workout, nutrition and weigh-in reminders", icon: "◌", action: () => setMorePage("notifications") },
    { title: "Connect Apps & Devices", detail: "Apple Health, Strava, Garmin and more", icon: "↻", action: () => setMorePage("devices") },
    { title: "Data & Backup", detail: "Local data, export and cloud status", icon: "⇅", action: () => openDetail("data") },
    { title: "Support", detail: "Help center and feedback", icon: "?", action: () => setMorePage("support") },
    { title: "About", detail: "Version, privacy and CYG information", icon: "i", action: () => setMorePage("about") },
  ];

  if (morePage !== "main") {
    return (
      <div className="min-h-[70vh]">
        <button onClick={() => setMorePage("main")} className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">← Back to More</button>
        <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">CYG</p><h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">{morePanelTitle(morePage)}</h1></div>
        {morePage === "friends" ? (
          <CloudFeatureFallback><FriendsPanel /></CloudFeatureFallback>
        ) : morePage === "coach" ? (
          planTier === "premium" ? (
            <CoachPage
              goals={goals}
              profile={profile}
              nutritionHistory={nutritionHistory}
              weightEntries={weightEntries}
              trainingHistory={trainingHistory}
              displaySettings={displaySettings}
              onOpenPlan={() => setActivePage("plan")}
            />
          ) : (
            <PremiumPaywall title="Advanced Coach is Premium" detail="Unlock deeper cross-app coaching across training, nutrition and progress. Your basic dashboard insights stay available on Free." onPreviewPremium={() => setPlanTier("premium")} />
          )
        ) : (
          <MoreFullPage page={morePage} trainingHistory={trainingHistory} nutritionHistory={nutritionHistory} profile={profile} />
        )}
      </div>
    );
  }

  if (detailPage !== "main") {
    const titles = { profile: "Profile", goals: "Goals & Targets", display: "Display & Appearance", data: "Data & Backup", fasting: "Fasting" };
    return (
      <div className="min-h-[70vh]">
        <button onClick={() => setDetailPage("main")} className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">← Back to More</button>
        <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">CYG</p><h1 className="mt-2 text-4xl font-black tracking-tight">{titles[detailPage]}</h1></div>

        {detailPage === "profile" && (
          <div className="max-w-4xl space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Personal & body data</h2>
              <p className="mt-1 text-sm text-slate-500">Used for your targets, progress and guided plan.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <PlanSelect label="Sex" value={profile.sex} onChange={(v) => update("sex", v as Sex)} options={[["male","Male"],["female","Female"]]} />
                <PlanNumber label="Age" value={profile.age} unit="years" min={16} max={100} step={1} onChange={(v) => update("age", v)} />
                <PlanNumber label="Height" value={round1(cmToDisplay(profile.height, settings.units))} unit={lengthUnitLabel(settings.units)} min={settings.units === "imperial" ? 47 : 120} max={settings.units === "imperial" ? 91 : 230} step={settings.units === "imperial" ? 0.5 : 1} onChange={(v) => update("height", round1(displayToCm(v, settings.units)))} />
                <PlanNumber label="Current weight" value={round1(kgToDisplay(profile.weight, settings.units))} unit={weightUnitLabel(settings.units)} min={settings.units === "imperial" ? 77 : 35} max={settings.units === "imperial" ? 660 : 300} step={0.1} onChange={(v) => update("weight", round1(displayToKg(v, settings.units)))} />
                <PlanNumber label="Target weight" value={round1(kgToDisplay(profile.targetWeight, settings.units))} unit={weightUnitLabel(settings.units)} min={settings.units === "imperial" ? 77 : 35} max={settings.units === "imperial" ? 660 : 300} step={0.1} onChange={(v) => update("targetWeight", round1(displayToKg(v, settings.units)))} />
                <PlanSelect label="Activity" value={profile.activity} onChange={(v) => update("activity", v as ActivityLevel)} options={[["sedentary","Sedentary"],["light","Lightly active"],["moderate","Moderately active"],["very","Very active"],["athlete","Athlete / highly active"]]} />
                <PlanSelect label="Experience" value={profile.experience} onChange={(v) => update("experience", v as BodyProfile["experience"])} options={[["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]]} />
                <PlanSelect label="Equipment" value={profile.equipment} onChange={(v) => update("equipment", v as BodyProfile["equipment"])} options={[["full-gym","Full gym"],["home","Home gym / dumbbells"],["bodyweight","Bodyweight only"]]} />
              </div>
              <button onClick={saveProfileNow} className="mt-6 rounded-2xl bg-blue-500 px-6 py-3 font-black text-white">{profileSaved ? "Saved ✓" : "Save profile"}</button>
            </section>
          </div>
        )}

        {detailPage === "goals" && (
          <div className="max-w-4xl space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Goal setup</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <PlanSelect label="Primary goal" value={profile.goal} onChange={(v) => update("goal", v as FitnessGoal)} options={[["lose","Lose fat"],["maintain","Maintain"],["gain","Build muscle"]]} />
                <PlanNumber label="Target weight" value={round1(kgToDisplay(profile.targetWeight, settings.units))} unit={weightUnitLabel(settings.units)} min={settings.units === "imperial" ? 77 : 35} max={settings.units === "imperial" ? 660 : 300} step={0.1} onChange={(v) => update("targetWeight", round1(displayToKg(v, settings.units)))} />
                <PlanSelect label="Training days" value={String(profile.trainingDays)} onChange={(v) => update("trainingDays", Number(v))} options={[["2","2 days / week"],["3","3 days / week"],["4","4 days / week"],["5","5 days / week"],["6","6 days / week"]]} />
                <PlanSelect label="Cardio goal" value={profile.cardioGoal} onChange={(v) => update("cardioGoal", v as BodyProfile["cardioGoal"])} options={[["none","No planned cardio"],["health","General health"],["fat-loss","Fat loss support"],["endurance","Improve endurance"],["performance","Sport performance"]]} />
                <PlanSelect label="Cardio days" value={String(profile.cardioDays)} onChange={(v) => update("cardioDays", Number(v))} options={[["1","1 day / week"],["2","2 days / week"],["3","3 days / week"],["4","4 days / week"],["5","5 days / week"]]} />
                <PlanSelect label="Preferred cardio" value={profile.cardioType} onChange={(v) => update("cardioType", v as BodyProfile["cardioType"])} options={[["walking","Walking"],["running","Running"],["cycling","Cycling"],["incline-walk","Incline treadmill"],["stairmaster","Stairmaster"],["rowing","Rowing"]]} />
              </div>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4"><p className="text-sm font-black">App mode</p><div className="mt-3 flex gap-2"><button onClick={() => changeMode("guided")} className={`rounded-xl px-4 py-2 text-sm font-black ${appMode === "guided" ? "bg-blue-500 text-white" : "bg-white border border-slate-200"}`}>Guided</button><button onClick={() => changeMode("self-managed")} className={`rounded-xl px-4 py-2 text-sm font-black ${appMode === "self-managed" ? "bg-blue-500 text-white" : "bg-white border border-slate-200"}`}>Self-managed</button></div></div>
              <button onClick={saveProfileNow} className="mt-6 rounded-2xl bg-blue-500 px-6 py-3 font-black text-white">{profileSaved ? "Saved ✓" : "Save goals"}</button>
            </section>
          </div>
        )}

        {detailPage === "display" && (
          <div className="max-w-3xl space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Appearance</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">{(["light","dark","system"] as const).map(v => <button key={v} onClick={() => updateSettings({ appearance: v })} className={`rounded-2xl border p-4 text-left font-black capitalize ${settings.appearance===v?"border-blue-500 bg-blue-50":"border-slate-200"}`}>{v}<span className="mt-1 block text-xs font-normal text-slate-500">{v === "system" ? "Follow device" : `${v} interface`}</span></button>)}</div>
            </section>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Units & layout</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <PlanSelect label="Measurement units" value={settings.units} onChange={(v) => updateSettings({ units: v as Settings["units"] })} options={[["metric","Metric (kg, cm)"],["imperial","Imperial (lb, in)"]]} />
                <PlanSelect label="Energy" value={settings.energyUnit} onChange={(v) => updateSettings({ energyUnit: v as Settings["energyUnit"] })} options={[["kcal","Calories (kcal)"],["kj","Kilojoules (kJ)"]]} />
                <PlanSelect label="Week starts" value={settings.weekStarts} onChange={(v) => updateSettings({ weekStarts: v as Settings["weekStarts"] })} options={[["monday","Monday"],["sunday","Sunday"]]} />
                <PlanSelect label="Layout density" value={settings.density} onChange={(v) => updateSettings({ density: v as Settings["density"] })} options={[["comfortable","Comfortable"],["compact","Compact"]]} />
              </div>
              <div className="mt-5 divide-y divide-slate-100"><SettingToggle title="Show RIR" detail="Show reps-in-reserve controls during workouts." enabled={settings.showRir} onClick={()=>updateSettings({ showRir: !settings.showRir })}/><SettingToggle title="Rest timer" detail="Automatically use a rest timer between sets." enabled={settings.restTimer} onClick={()=>updateSettings({ restTimer: !settings.restTimer })}/></div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button onClick={() => void saveSettingsNow()} className="rounded-2xl bg-blue-500 px-6 py-3 font-black text-white hover:bg-blue-400">
                  {settingsSaved ? "Settings saved ✓" : "Save settings"}
                </button>
                <p className="text-xs text-slate-500">Saves to this device and your CYG cloud account.</p>
              </div>
              <p className="mt-4 text-xs text-slate-500">Display preferences are shared across CYG and sync to your cloud account.</p>
            </section>
          </div>
        )}

        {detailPage === "fasting" && (
          <div className="max-w-4xl">
            <FastingTracker />
          </div>
        )}

        {detailPage === "data" && (
          <div className="max-w-3xl space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-blue-600">Cloud status</p><h2 className="mt-2 text-2xl font-black">CYG data is synced</h2><p className="mt-2 text-sm leading-6 text-slate-500">Supabase cloud storage is active, with local browser storage kept as a fast cache and fallback.</p></div><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">Active</span></div>
            </section>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Backup & restore</h2><p className="mt-2 text-sm text-slate-500">Export your CYG data or restore a previous CYG JSON backup. Import asks for confirmation before replacing matching local keys.</p><div className="mt-5 flex flex-wrap gap-3"><button onClick={exportBackup} className="rounded-2xl bg-blue-500 px-5 py-3 font-black text-white">Download backup</button><label className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700">Import backup<input type="file" accept="application/json,.json" className="hidden" onChange={(event)=>{const file=event.target.files?.[0]; if(file) void importBackup(file); event.currentTarget.value="";}} /></label></div></section>
            <section className="grid gap-3 sm:grid-cols-3"><MoreStat label="Workouts" value={trainingHistory.length}/><MoreStat label="Nutrition days" value={nutritionHistory.length}/><MoreStat label="Storage" value="Cloud + local"/></section>
            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5"><p className="font-black text-amber-900">Safe migration</p><p className="mt-2 text-sm leading-6 text-amber-800">Internal keys still use bodypilot-* for compatibility. They are intentionally not renamed yet so existing user data is not lost.</p></section>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-sm font-semibold tracking-widest text-blue-600">MORE</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">More</h1><p className="mt-3 max-w-2xl text-slate-600">Profile, goals, calendar, achievements, devices, settings and your data.</p></div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-black text-blue-700">CYG</div><div><div className="flex items-center gap-2"><p className="font-bold">CYG profile</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${planTier === "premium" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{planTier}</span></div><p className="text-xs text-slate-500">{goalLabel} · {profile.trainingDays} days/week</p></div></div>
      </div>
      <section className="mt-7">
        <div className="mb-5 rounded-[28px] border border-blue-200 bg-blue-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-widest text-blue-700">Plan preview</p><p className="mt-1 text-sm font-semibold text-slate-700">See CYG exactly as a Free or Premium user. This is a preview switch, not billing.</p></div>
            <div className="flex rounded-2xl bg-white p-1 shadow-sm">
              {(["free","premium"] as const).map((tier) => <button key={tier} type="button" onClick={() => setPlanTier(tier)} className={`rounded-xl px-4 py-2 text-sm font-black capitalize ${planTier === tier ? "bg-blue-500 text-white" : "text-slate-500"}`}>{tier}</button>)}
            </div>
          </div>
        </div>
        <div className="mb-5 rounded-[28px] bg-slate-100 px-5 py-4"><div className="flex items-center gap-3"><span className="text-xl text-slate-500">⌕</span><input value={moreSearch} onChange={(e)=>setMoreSearch(e.target.value)} placeholder="Search settings..." className="w-full bg-transparent text-base font-medium outline-none placeholder:text-slate-600"/></div></div>
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">{moreItems.filter(item => `${item.title} ${item.detail}`.toLowerCase().includes(moreSearch.toLowerCase())).map((item,index,arr)=><button key={item.title} onClick={item.action} className={`flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50 ${index<arr.length-1?"border-b border-slate-100":""}`}><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-lg font-black text-slate-800">{item.icon}</span><span className="min-w-0 flex-1"><span className="block font-black text-slate-950">{item.title}</span><span className="mt-0.5 block text-xs text-slate-500">{item.detail}</span></span><span className="text-2xl font-light text-slate-600">›</span></button>)}</div>
      </section>
    </>
  );
}

function FastingTracker() {
  type FastingState = { active: boolean; startedAt: string | null; targetHours: number; history: Array<{ startedAt: string; endedAt: string; hours: number }> };
  const defaults: FastingState = { active: false, startedAt: null, targetHours: 16, history: [] };
  const [state, setState] = useState<FastingState>(() => {
    if (typeof window === "undefined") return defaults;
    try { return { ...defaults, ...JSON.parse(localStorage.getItem("bodypilot-fasting") || "{}") }; } catch { return defaults; }
  });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    void loadCloudData<FastingState>("fasting").then((cloud) => { if (cloud) setState((v) => ({ ...v, ...cloud })); });
  }, []);
  useEffect(() => {
    localStorage.setItem("bodypilot-fasting", JSON.stringify(state));
    window.dispatchEvent(new Event("mucipes-fasting-changed"));
    void saveCloudData("fasting", state);
  }, [state]);
  useEffect(() => {
    if (!state.active) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [state.active]);

  const elapsedMs = state.active && state.startedAt ? Math.max(0, now - new Date(state.startedAt).getTime()) : 0;
  const elapsedHours = elapsedMs / 3600000;
  const pct = Math.min(100, (elapsedHours / Math.max(1, state.targetHours)) * 100);
  const h = Math.floor(elapsedMs / 3600000);
  const m = Math.floor((elapsedMs % 3600000) / 60000);
  const sec = Math.floor((elapsedMs % 60000) / 1000);

  function start() { setNow(Date.now()); setState((v) => ({ ...v, active: true, startedAt: new Date().toISOString() })); }
  function finish() {
    if (!state.startedAt) return;
    const endedAt = new Date();
    const hours = Math.round(((endedAt.getTime() - new Date(state.startedAt).getTime()) / 3600000) * 10) / 10;
    setState((v) => ({ ...v, active: false, startedAt: null, history: [{ startedAt: state.startedAt!, endedAt: endedAt.toISOString(), hours }, ...v.history].slice(0, 60) }));
  }

  const completed = state.history.filter(x => x.hours >= state.targetHours).length;
  const avg = state.history.length ? Math.round((state.history.reduce((sum,x)=>sum+x.hours,0)/state.history.length)*10)/10 : 0;
  const longest = state.history.length ? Math.max(...state.history.map(x=>x.hours)) : 0;
  let streak = 0;
  for (const x of state.history) { if (x.hours >= state.targetHours) streak += 1; else break; }
  const endAt = state.active && state.startedAt ? new Date(new Date(state.startedAt).getTime()+state.targetHours*3600000) : null;

  return <div className="space-y-5">
    <section className="rounded-[28px] border border-blue-200 bg-white p-6 shadow-sm">
    <div><p className="text-xs font-black uppercase tracking-widest text-blue-600">Current fast</p><h3 className="mt-1 text-3xl font-black">{state.active ? `${h}h ${String(m).padStart(2,"0")}m ${String(sec).padStart(2,"0")}s` : `${state.targetHours} hour target`}</h3><p className="mt-1 text-sm text-slate-500">Cloud-synced fasting timer. {endAt ? `Target ends ${endAt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}.` : 'Choose a target and start when you are ready.'}</p></div>
    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500 transition-all" style={{width:`${pct}%`}} /></div>
    {!state.active && <div className="mt-5 flex flex-wrap gap-2">{[12,14,16,18,20].map(hours=><button key={hours} onClick={()=>setState(v=>({...v,targetHours:hours}))} className={`rounded-xl px-4 py-2 text-sm font-black ${state.targetHours===hours?"bg-blue-500 text-white":"bg-slate-100 text-slate-700"}`}>{hours}h</button>)}</div>}
    <button onClick={state.active ? finish : start} className={`mt-5 w-full rounded-2xl py-4 font-black text-white ${state.active?"bg-rose-500":"bg-blue-500"}`}>{state.active ? "End fast" : "Start fast"}</button>
    </section>
    <section className="grid gap-3 sm:grid-cols-4">
      <MoreStat label="Current streak" value={`${streak}`} />
      <MoreStat label="Completed" value={`${completed}`} />
      <MoreStat label="Average" value={`${avg} h`} />
      <MoreStat label="Longest" value={`${longest} h`} />
    </section>
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-slate-600">History</p><h3 className="mt-1 text-xl font-black">Recent fasts</h3></div><span className="text-xs font-bold text-slate-600">{state.history.length} total</span></div>
      {state.history.length ? <div className="mt-4 space-y-2">{state.history.slice(0,12).map((x,i)=><div key={`${x.endedAt}-${i}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"><div><p className="font-bold">{new Date(x.endedAt).toLocaleDateString()}</p><p className="text-xs text-slate-600">{new Date(x.startedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} → {new Date(x.endedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</p></div><span className={`font-black ${x.hours>=state.targetHours?'text-blue-600':'text-slate-600'}`}>{x.hours} h</span></div>)}</div> : <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Your completed fasts will appear here.</div>}
    </section>
  </div>;
}

function SettingToggle({ title, detail, enabled, onClick }: { title: string; detail: string; enabled: boolean; onClick: () => void }) {
  return <div className="flex items-center justify-between gap-5 py-4"><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-slate-500">{detail}</p></div><button type="button" onClick={onClick} aria-pressed={enabled} className={`relative h-7 w-12 shrink-0 rounded-full transition ${enabled ? 'bg-blue-500' : 'bg-slate-200'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${enabled ? 'left-6' : 'left-1'}`} /></button></div>;
}

function Dashboard({
  goals,
  caloriesEaten,
  proteinEaten,
  carbsEaten,
  fatEaten,
  caloriesRemaining,
  weightEntries,
  trainingHistory,
  bodyProfile,
  nutritionHistory,
  displaySettings,
  setActivePage,
}: {
  goals: Goals;
  caloriesEaten: number;
  proteinEaten: number;
  carbsEaten: number;
  fatEaten: number;
  caloriesRemaining: number;
  weightEntries: WeightEntry[];
  trainingHistory: TrainingHistoryEntry[];
  bodyProfile: BodyProfile;
  nutritionHistory: NutritionDay[];
  displaySettings: ReturnType<typeof readMucipesDisplaySettings>;
  setActivePage: (page: Page) => void;
}) {
  // Keep the first server render and the first client render identical.
  // Browser-only state is loaded after hydration to avoid SSR/localStorage mismatches.
  const [activeWorkout, setActiveWorkout] = useState<HomeActiveWorkout | null>(null);
  const [activeFast, setActiveFast] = useState<HomeFastingState | null>(null);
  const [liveNow, setLiveNow] = useState(0);

  useEffect(() => {
    const syncActive = () => {
      setActiveWorkout(readLocalJson<HomeActiveWorkout>("bodypilot-active-workout"));
      setActiveFast(readLocalJson<HomeFastingState>("bodypilot-fasting"));
      setLiveNow(Date.now());
    };
    syncActive();
    window.addEventListener("mucipes-workout-changed", syncActive);
    window.addEventListener("mucipes-fasting-changed", syncActive);
    window.addEventListener("storage", syncActive);
    return () => {
      window.removeEventListener("mucipes-workout-changed", syncActive);
      window.removeEventListener("mucipes-fasting-changed", syncActive);
      window.removeEventListener("storage", syncActive);
    };
  }, []);

  useEffect(() => {
    if (!activeWorkout && !activeFast?.active) return;
    const id = window.setInterval(() => setLiveNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [activeWorkout, activeFast?.active]);

  const sortedWeights = [...weightEntries].sort(
    (a, b) => getWeightEntryTime(a) - getWeightEntryTime(b)
  );
  const latestWeight = sortedWeights.at(-1);
  const olderWeight = sortedWeights.length > 1 ? sortedWeights.at(-2) : undefined;
  const weightChange =
    latestWeight && olderWeight
      ? round1(latestWeight.weight - olderWeight.weight)
      : null;

  const sortedWorkouts = [...(trainingHistory || [])].sort(
    (a, b) => new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime()
  );
  const lastWorkout = sortedWorkouts[0];

  const recentDates = new Set(
    sortedWorkouts.slice(0, 30).map((w) => w.finishedAt.slice(0, 10))
  );
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 30; i++) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth()+1).padStart(2,"0")}-${String(cursor.getDate()).padStart(2,"0")}`;
    if (recentDates.has(key)) streak++;
    else if (i > 0) break;
    cursor.setDate(cursor.getDate() - 1);
  }

  const proteinLeft = Math.max(0, Math.round(goals.protein - proteinEaten));
  const insight =
    proteinLeft > 0
      ? `You are ${proteinLeft} g below your protein target.`
      : caloriesRemaining > 0
        ? `${formatEnergy(Math.max(0, caloriesRemaining), displaySettings.energyUnit)} remaining today.`
        : "Daily nutrition targets are on track.";

  const dateLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyWorkouts = sortedWorkouts.filter(
    (workout) => new Date(workout.finishedAt).getTime() >= sevenDaysAgo
  ).length;
  const recentNutrition = [...nutritionHistory]
    .filter((day) => new Date(day.date).getTime() >= sevenDaysAgo)
    .slice(-7);
  const nutritionAdherence = recentNutrition.length
    ? Math.round(
        recentNutrition.reduce((sum, day) => {
          const distance = Math.abs(day.calories - goals.calories);
          return sum + Math.max(0, 100 - (distance / Math.max(1, goals.calories)) * 100);
        }, 0) / recentNutrition.length
      )
    : 0;
  const hoursSinceWorkout = lastWorkout
    ? (Date.now() - new Date(lastWorkout.finishedAt).getTime()) / 3600000
    : 72;
  const recoveryScore = Math.max(
    35,
    Math.min(100, Math.round(55 + Math.min(30, hoursSinceWorkout / 2) + Math.min(15, nutritionAdherence / 7)))
  );
  const recoveryLabel = recoveryScore >= 80 ? "Ready" : recoveryScore >= 60 ? "Moderate" : "Recover";

  const avgProtein7 = recentNutrition.length
    ? Math.round(recentNutrition.reduce((sum, day) => sum + day.protein, 0) / recentNutrition.length)
    : null;

  const weekWeights = sortedWeights.filter((entry) => getWeightEntryTime(entry) >= sevenDaysAgo);
  const weekWeightChange = weekWeights.length >= 2
    ? round1(weekWeights.at(-1)!.weight - weekWeights[0].weight)
    : null;

  const bestBefore = new Map<string, number>();
  let weeklyPrs = 0;
  [...trainingHistory]
    .sort((a, b) => new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime())
    .forEach((workout) => {
      const isThisWeek = new Date(workout.finishedAt).getTime() >= sevenDaysAgo;
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (set.weight <= 0 || set.reps <= 0) return;
          const e1rm = set.weight * (1 + set.reps / 30);
          const previousBest = bestBefore.get(exercise.exerciseId) ?? 0;
          if (isThisWeek && previousBest > 0 && e1rm > previousBest * 1.002) weeklyPrs += 1;
          if (e1rm > previousBest) bestBefore.set(exercise.exerciseId, e1rm);
        });
      });
    });

  const hour = new Date().getHours();
  const todayKey = getTodayDateInput();
  const weighedToday = sortedWeights.some((entry) => entry.date.slice(0, 10) === todayKey);
  const smartFocus = !weighedToday && hour < 12
    ? { eyebrow: "Morning check-in", title: "Log your body weight", detail: "A quick weigh-in makes the weekly trend more useful.", page: "progress" as Page, action: "Add weigh-in" }
    : weeklyWorkouts < bodyProfile.trainingDays && hoursSinceWorkout >= 20 && hour >= 10 && hour < 20
      ? { eyebrow: "Next best action", title: "Training fits today", detail: `${weeklyWorkouts} of ${bodyProfile.trainingDays} planned sessions are logged this week.`, page: "training" as Page, action: "Open workout" }
      : hour >= 17 && caloriesRemaining > 150
        ? { eyebrow: "Evening focus", title: `${formatEnergy(Math.max(0, caloriesRemaining), displaySettings.energyUnit)} remaining`, detail: proteinLeft > 0 ? `${proteinLeft} g protein is still open today.` : "Protein is covered; finish the day close to your energy target.", page: "nutrition" as Page, action: "Open nutrition" }
        : { eyebrow: "Today", title: recoveryScore >= 80 ? "You're set up well" : "Keep today simple", detail: insight, page: proteinLeft > 0 ? "nutrition" as Page : "training" as Page, action: proteinLeft > 0 ? "Open nutrition" : "Open workout" };

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Today · {dateLabel}
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Today
          </h1>
          <p className="mt-2 text-slate-500">
            Your training, nutrition and progress — today.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <span className="text-slate-500">Goal </span>
          <span className="font-black text-slate-900">
            {bodyProfile.goal === "lose" ? "Lose fat" : bodyProfile.goal === "gain" ? "Build muscle" : "Maintain"}
          </span>
        </div>
      </section>

      <button onClick={() => setActivePage(smartFocus.page)} className="flex w-full flex-wrap items-center justify-between gap-4 rounded-3xl border border-blue-200 bg-blue-50 p-5 text-left transition hover:border-blue-300">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-blue-700">{smartFocus.eyebrow}</p>
          <p className="mt-1 text-xl font-black text-slate-950">{smartFocus.title}</p>
          <p className="mt-1 text-sm text-slate-600">{smartFocus.detail}</p>
        </div>
        <span className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-black text-white">{smartFocus.action} →</span>
      </button>

      {(activeWorkout || activeFast?.active) && (
        <section className="grid gap-3 lg:grid-cols-2">
          {activeWorkout && (
            <button onClick={() => setActivePage("training")} className="rounded-3xl border border-blue-200 bg-blue-50 p-5 text-left shadow-sm transition hover:border-blue-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-700">Workout in progress</p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">{activeWorkout.name || "Workout"}</h2>
                  <p className="mt-1 text-sm text-slate-600">{activeWorkout.exercises?.length ?? 0} exercises · {activeWorkout.exercises?.reduce((sum, exercise) => sum + (exercise.sets?.filter((set) => set.completed).length ?? 0), 0) ?? 0} completed sets</p>
                </div>
                <span className="rounded-xl bg-white px-3 py-2 text-sm font-black text-blue-700 shadow-sm">{liveNow - new Date(activeWorkout.startedAt).getTime() > 12 * 3600000 ? "Resume timer" : formatLiveDuration(liveNow - new Date(activeWorkout.startedAt).getTime())}</span>
              </div>
              <span className="mt-4 inline-flex rounded-xl bg-blue-500 px-4 py-2 text-sm font-black text-white">Resume workout →</span>
            </button>
          )}
          {activeFast?.active && activeFast.startedAt && (
            <button onClick={() => { localStorage.setItem("mucipes-more-detail-intent", "fasting"); setActivePage("profile"); }} className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-600">Fast in progress</p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">{formatLiveDuration(liveNow - new Date(activeFast.startedAt).getTime())}</h2>
                  <p className="mt-1 text-sm text-slate-500">Target {activeFast.targetHours}h · ends {new Date(new Date(activeFast.startedAt).getTime() + activeFast.targetHours * 3600000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">Active</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(100, ((liveNow - new Date(activeFast.startedAt).getTime()) / (activeFast.targetHours * 3600000)) * 100)}%` }} /></div>
              <span className="mt-4 inline-flex text-sm font-black text-blue-700">Open fasting →</span>
            </button>
          )}
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <button onClick={() => setActivePage("training")} className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-600">Readiness</p>
          <div className="mt-3 flex items-end justify-between"><p className="text-3xl font-black">{recoveryScore}</p><span className={`rounded-full px-3 py-1 text-xs font-black ${recoveryScore>=80?"bg-blue-100 text-blue-700":recoveryScore>=60?"bg-amber-100 text-amber-700":"bg-rose-100 text-rose-700"}`}>{recoveryLabel}</span></div>
          <p className="mt-2 text-xs text-slate-500">Based on recent training and nutrition logging.</p>
        </button>
        <button onClick={() => setActivePage("training")} className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-600">This week</p>
          <p className="mt-3 text-3xl font-black">{weeklyWorkouts}<span className="text-base text-slate-600"> workouts</span></p>
          <p className="mt-2 text-xs text-slate-500">Keep the week moving without overcomplicating it.</p>
        </button>
        <button onClick={() => setActivePage("nutrition")} className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-600">Nutrition consistency</p>
          <p className="mt-3 text-3xl font-black">{nutritionAdherence}<span className="text-base text-slate-600">%</span></p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{width:`${nutritionAdherence}%`}} /></div>
        </button>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <button
          onClick={() => setActivePage("nutrition")}
          className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Calories</p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {formatEnergy(caloriesEaten, displaySettings.energyUnit)} <span className="text-lg text-slate-600">/ {formatEnergy(goals.calories, displaySettings.energyUnit)}</span>
              </p>
            </div>
            <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
              {formatEnergy(Math.max(0, caloriesRemaining), displaySettings.energyUnit)} left
            </span>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${Math.min(100, goals.calories ? (caloriesEaten / goals.calories) * 100 : 0)}%` }}
            />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <TodayMacro label="Protein" value={proteinEaten} goal={goals.protein} />
            <TodayMacro label="Carbs" value={carbsEaten} goal={goals.carbs} />
            <TodayMacro label="Fat" value={fatEaten} goal={goals.fat} />
          </div>
        </button>

        <button
          onClick={() => setActivePage("training")}
          className="rounded-3xl border border-blue-200 bg-white p-6 text-left text-slate-950 shadow-sm transition hover:-translate-y-0.5"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Today's workout</p>
          <h2 className="mt-3 text-2xl font-black">
            {lastWorkout ? "Ready for the next session?" : "Start your first workout"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {lastWorkout
              ? `Last: ${lastWorkout.name} · ${Math.round(lastWorkout.durationSeconds / 60)} min`
              : "Build a routine or start an empty workout."}
          </p>
          <span className="mt-6 inline-flex rounded-xl bg-blue-400 px-4 py-3 text-sm font-black text-white">
            Start Workout →
          </span>
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <TodayInfoCard
          label="Weight trend"
          value={latestWeight ? formatWeight(latestWeight.weight, displaySettings.units) : "No data"}
          detail={weightChange === null ? "Add a weigh-in" : `${weightChange > 0 ? "+" : ""}${formatWeight(weightChange, displaySettings.units)} vs previous`}
          onClick={() => setActivePage("progress")}
        />
        <TodayInfoCard
          label="Training streak"
          value={`${streak} day${streak === 1 ? "" : "s"}`}
          detail={`${sortedWorkouts.length} workouts logged`}
          onClick={() => setActivePage("progress")}
        />
        <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700">CYG Coach</p>
          <p className="mt-3 text-lg font-black text-slate-950">{insight}</p>
          <p className="mt-2 text-sm text-slate-600">Based on today's logged data.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">Weekly summary</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">The signals that matter</h2>
          </div>
          <span className="text-xs font-bold text-slate-600">Last 7 days</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <WeeklySummaryStat label="Workouts" value={`${weeklyWorkouts}/${bodyProfile.trainingDays}`} />
          <WeeklySummaryStat label="New PRs" value={`${weeklyPrs}`} />
          <WeeklySummaryStat label="Avg protein" value={avgProtein7 === null ? "—" : `${avgProtein7} g`} />
          <WeeklySummaryStat label="Calorie adherence" value={recentNutrition.length ? `${nutritionAdherence}%` : "—"} />
          <WeeklySummaryStat label="Weight" value={weekWeightChange === null ? "—" : `${weekWeightChange > 0 ? "+" : ""}${formatWeight(weekWeightChange, displaySettings.units)}`} />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500">{weeklyWorkouts >= bodyProfile.trainingDays && nutritionAdherence >= 85 ? "Strong consistency this week. Keep the plan stable unless your longer-term trend says otherwise." : "Use this summary for direction, not perfection. One off day does not require a plan change."}</p>
      </section>
    </div>
  );
}

function WeeklySummaryStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase tracking-wider text-slate-600">{label}</p><p className="mt-1 text-lg font-black text-slate-900">{value}</p></div>;
}

function TodayMacro({ label, value, goal }: { label: string; value: number; goal: number }) {
  const pct = goal > 0 ? Math.min(100, (value / goal) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="text-slate-600">{Math.round(value)}/{goal}g</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function TodayInfoCard({
  label, value, detail, onClick,
}: {
  label: string; value: string; detail: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </button>
  );
}

function DashboardMetric({
  label,
  value,
  detail,
  progress,
  goal,
}: {
  label: string;
  value: string;
  detail: string;
  progress: number;
  goal: number;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">
        {value}
        <span className="ml-2 text-sm font-normal text-slate-600">
          {detail}
        </span>
      </p>
      <ProgressBar value={progress} goal={goal} />
    </section>
  );
}

function MiniWeightTrend({
  entries,
}: {
  entries: WeightEntry[];
}) {
  if (entries.length < 2) {
    return null;
  }

  const width = 420;
  const height = 110;
  const padding = 10;
  const values = entries.map((entry) => entry.weight);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 0.5);

  const points = entries
    .map((entry, index) => {
      const x =
        padding +
        (index / Math.max(entries.length - 1, 1)) *
          (width - padding * 2);
      const y =
        padding +
        ((max + spread * 0.15 - entry.weight) /
          (spread * 1.3)) *
          (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-28 w-full"
        role="img"
        aria-label="Recent body weight trend"
      >
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          className="text-blue-600"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}


function GetFitPlan({
  profile,
  setProfile,
  goals,
  setGoals,
  weightEntries,
  nutritionHistory,
  setActivePage,
  displaySettings,
}: {
  profile: BodyProfile;
  setProfile: React.Dispatch<React.SetStateAction<BodyProfile>>;
  goals: Goals;
  setGoals: React.Dispatch<React.SetStateAction<Goals>>;
  weightEntries: WeightEntry[];
  nutritionHistory: NutritionDay[];
  setActivePage: (page: Page) => void;
  displaySettings: ReturnType<typeof readMucipesDisplaySettings>;
}) {
  const [draft, setDraft] = useState<BodyProfile>(profile);
  const [calculated, setCalculated] = useState(false);
  const [planSavedToTraining, setPlanSavedToTraining] = useState(false);
  const planWeightUnit = weightUnitLabel(displaySettings.units);
  const planLengthUnit = lengthUnitLabel(displaySettings.units);
  const formatWeeklyRate = (kgPerWeek: number) => `${kgToDisplay(kgPerWeek, displaySettings.units).toFixed(kgPerWeek < 0.2 ? 2 : 1)} ${planWeightUnit} / week`;
  const formatSignedWeeklyRate = (kgPerWeek: number) => `${kgPerWeek > 0 ? "+" : ""}${kgToDisplay(kgPerWeek, displaySettings.units).toFixed(2)} ${planWeightUnit}/week`;

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const result = useMemo(
    () => calculateNutritionTargets(draft),
    [draft]
  );

  const adaptive = useMemo(
    () =>
      calculateAdaptiveAdjustment(
        weightEntries,
        profile,
        goals
      ),
    [weightEntries, profile, goals]
  );

  const trainingPlan = useMemo(
    () =>
      buildTrainingPlan(draft).map((day) => ({
        ...day,
        exercises: day.exercises.filter(
          (exercise, index, all) =>
            all.findIndex(
              (candidate) =>
                candidate.name.toLowerCase() ===
                exercise.name.toLowerCase()
            ) === index
        ),
      })),
    [draft]
  );

  const weeklySchedule = useMemo(
    () => buildWeeklySchedule(draft, trainingPlan),
    [draft, trainingPlan]
  );

  const recentNutrition = useMemo(() => {
    const completedDays = nutritionHistory
      .filter((day) => day.date !== getTodayDateInput())
      .slice(-14);

    if (completedDays.length === 0) {
      return null;
    }

    const sum = completedDays.reduce(
      (total, day) => ({
        calories: total.calories + day.calories,
        protein: total.protein + day.protein,
        carbs: total.carbs + day.carbs,
        fat: total.fat + day.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      days: completedDays.length,
      calories: Math.round(sum.calories / completedDays.length),
      protein: Math.round(sum.protein / completedDays.length),
      carbs: Math.round(sum.carbs / completedDays.length),
      fat: Math.round(sum.fat / completedDays.length),
    };
  }, [nutritionHistory]);

  function saveTrainingPlanToTraining() {
    try {
      const existingRaw = localStorage.getItem(
        "bodypilot-saved-workouts"
      );

      const existing = existingRaw
        ? JSON.parse(existingRaw)
        : [];

      const safeExisting = Array.isArray(existing)
        ? existing
        : [];

      const generated = trainingPlan.map((day, dayIndex) => ({
        id: `bodypilot-plan-${Date.now()}-${dayIndex}`,
        name: day.name,
        createdAt: new Date().toISOString(),
        exercises: day.exercises.map((exercise) => ({
          exerciseId: `generated-${exercise.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}`,
          exerciseName: exercise.name,
          defaultSets: exercise.sets,
        })),
      }));

      const generatedNames = new Set(
        generated.map((workout) => workout.name)
      );

      const withoutOldGenerated = safeExisting.filter(
        (workout: { id?: string; name?: string }) =>
          !(
            workout.id?.startsWith("bodypilot-plan-") ||
            (workout.name && generatedNames.has(workout.name))
          )
      );

      localStorage.setItem(
        "bodypilot-saved-workouts",
        JSON.stringify([
          ...withoutOldGenerated,
          ...generated,
        ])
      );

      localStorage.setItem(
        "bodypilot-generated-training-plan",
        JSON.stringify({
          savedAt: new Date().toISOString(),
          days: trainingPlan,
          weeklySchedule,
        })
      );

      setPlanSavedToTraining(true);
    } catch (error) {
      console.error(
        "Could not save CYG training plan:",
        error
      );
    }
  }

  function applyAdaptiveAdjustment() {
    if (!adaptive.ready || adaptive.suggestedCalories === null) {
      return;
    }

    const calorieDifference =
      adaptive.suggestedCalories - goals.calories;

    const adjustedCarbs = Math.max(
      50,
      Math.round(
        goals.carbs + calorieDifference / 4
      )
    );

    setGoals((current) => ({
      ...current,
      calories: adaptive.suggestedCalories as number,
      carbs: adjustedCarbs,
    }));
  }

  function update<K extends keyof BodyProfile>(
    key: K,
    value: BodyProfile[K]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setCalculated(false);
  }

  function applyPlan() {
    const next = calculateNutritionTargets(draft);

    setProfile(draft);
    setGoals({
      calories: next.calories,
      protein: next.protein,
      carbs: next.carbs,
      fat: next.fat,
    });
    setCalculated(true);
  }


  const planCompletion = Math.min(100, Math.round(
    (nutritionHistory.slice(-7).length / 7) * 45 +
    (weightEntries.slice(-7).length > 0 ? 20 : 0) +
    (profile.trainingDays > 0 ? 35 : 0)
  ));
  const planStatus = adaptive.ready ? "Ready for check-in" : planCompletion >= 60 ? "On track" : "Build consistency";

  return (
    <>
      <p className="text-sm font-semibold tracking-widest text-blue-600">
        GET FIT PLAN
      </p>

      <h1 className="mt-2 text-4xl font-black tracking-tight">
        Build your starting plan
      </h1>

      <p className="mt-3 max-w-3xl text-slate-600">
        CYG estimates your maintenance calories from your body
        data and activity, then adjusts calories and macros for your
        selected goal. You can still edit the targets later.
      </p>

      <section className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 text-slate-950"><p className="text-xs font-black uppercase tracking-widest text-blue-400">Plan status</p><p className="mt-2 text-2xl font-black">{planStatus}</p><p className="mt-2 text-xs text-slate-600">CYG uses your logged trend before suggesting changes.</p></div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase tracking-widest text-slate-600">Consistency</p><p className="mt-2 text-3xl font-black">{planCompletion}%</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-blue-500" style={{width:`${planCompletion}%`}} /></div></div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase tracking-widest text-slate-600">Current target</p><p className="mt-2 text-3xl font-black">{formatEnergy(goals.calories, displaySettings.energyUnit)}</p><p className="mt-2 text-xs text-slate-500">{goals.protein} g protein · {profile.trainingDays} training days</p></div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-7">
          <h2 className="text-2xl font-bold">Your data</h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <PlanSelect
              label="Sex"
              value={draft.sex}
              onChange={(value) => update("sex", value as Sex)}
              options={[
                ["male", "Male"],
                ["female", "Female"],
              ]}
            />

            <PlanNumber
              label="Age"
              value={draft.age}
              unit="years"
              min={16}
              max={100}
              onChange={(value) => update("age", value)}
            />

            <PlanNumber
              label="Height"
              value={round1(cmToDisplay(draft.height, displaySettings.units))}
              unit={planLengthUnit}
              min={displaySettings.units === "imperial" ? 47 : 120}
              max={displaySettings.units === "imperial" ? 91 : 230}
              step={0.1}
              onChange={(value) => update("height", round1(displayToCm(value, displaySettings.units)))}
            />

            <PlanNumber
              label="Weight"
              value={round1(kgToDisplay(draft.weight, displaySettings.units))}
              unit={planWeightUnit}
              min={displaySettings.units === "imperial" ? 77 : 35}
              max={displaySettings.units === "imperial" ? 660 : 300}
              step={0.1}
              onChange={(value) => update("weight", round1(displayToKg(value, displaySettings.units)))}
            />

            <PlanNumber
              label="Target weight"
              value={round1(kgToDisplay(draft.targetWeight, displaySettings.units))}
              unit={planWeightUnit}
              min={displaySettings.units === "imperial" ? 77 : 35}
              max={displaySettings.units === "imperial" ? 660 : 300}
              step={0.1}
              onChange={(value) => update("targetWeight", round1(displayToKg(value, displaySettings.units)))}
            />

            <PlanSelect
              label="Goal"
              value={draft.goal}
              onChange={(value) =>
                update("goal", value as FitnessGoal)
              }
              options={[
                ["lose", "Lose fat"],
                ["maintain", "Maintain"],
                ["gain", "Build muscle"],
              ]}
            />

            <PlanSelect
              label="Activity"
              value={draft.activity}
              onChange={(value) =>
                update("activity", value as ActivityLevel)
              }
              options={[
                ["sedentary", "Mostly sedentary"],
                ["light", "Lightly active"],
                ["moderate", "Moderately active"],
                ["very", "Very active"],
                ["athlete", "Extremely active"],
              ]}
            />

            <PlanSelect
              label="Training days"
              value={String(draft.trainingDays)}
              onChange={(value) =>
                update("trainingDays", Number(value))
              }
              options={[
                ["2", "2 days / week"],
                ["3", "3 days / week"],
                ["4", "4 days / week"],
                ["5", "5 days / week"],
                ["6", "6 days / week"],
              ]}
            />

            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Preferred training days
              </p>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, index) => {
                    const selected = (
                      draft.preferredTrainingDays ?? []
                    ).includes(index);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const current =
                            draft.preferredTrainingDays ?? [];
                          const next = selected
                            ? current.filter((value) => value !== index)
                            : [...current, index].sort((a, b) => a - b);

                          if (
                            !selected &&
                            next.length > draft.trainingDays
                          ) {
                            return;
                          }

                          update("preferredTrainingDays", next);
                        }}
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                          selected
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-slate-300 bg-slate-50 text-slate-600 hover:border-slate-400"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  }
                )}
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Pick up to {draft.trainingDays} days. CYG uses these first
                and fills any missing days automatically.
              </p>
            </div>

            <PlanSelect
              label="Training experience"
              value={draft.experience}
              onChange={(value) =>
                update(
                  "experience",
                  value as BodyProfile["experience"]
                )
              }
              options={[
                ["beginner", "Beginner"],
                ["intermediate", "Intermediate"],
                ["advanced", "Advanced"],
              ]}
            />

            <PlanSelect
              label="Equipment"
              value={draft.equipment}
              onChange={(value) =>
                update(
                  "equipment",
                  value as BodyProfile["equipment"]
                )
              }
              options={[
                ["full-gym", "Full gym"],
                ["home", "Home gym / dumbbells"],
                ["bodyweight", "Bodyweight only"],
              ]}
            />

            <PlanSelect
              label="Cardio goal"
              value={draft.cardioGoal ?? "health"}
              onChange={(value) =>
                update(
                  "cardioGoal",
                  value as BodyProfile["cardioGoal"]
                )
              }
              options={[
                ["none", "No planned cardio"],
                ["health", "General health"],
                ["fat-loss", "Fat loss support"],
                ["endurance", "Improve endurance"],
                ["performance", "Sport performance"],
              ]}
            />

            {(draft.cardioGoal ?? "health") !== "none" && (
              <>
                <PlanSelect
                  label="Cardio days"
                  value={String(draft.cardioDays ?? 2)}
                  onChange={(value) =>
                    update("cardioDays", Number(value))
                  }
                  options={[
                    ["1", "1 day / week"],
                    ["2", "2 days / week"],
                    ["3", "3 days / week"],
                    ["4", "4 days / week"],
                    ["5", "5 days / week"],
                  ]}
                />

                <PlanSelect
                  label="Preferred cardio"
                  value={draft.cardioType ?? "cycling"}
                  onChange={(value) =>
                    update(
                      "cardioType",
                      value as BodyProfile["cardioType"]
                    )
                  }
                  options={[
                    ["walking", "Walking"],
                    ["running", "Running"],
                    ["cycling", "Cycling"],
                    ["incline-walk", "Incline treadmill"],
                    ["stairmaster", "Stairmaster"],
                    ["rowing", "Rowing"],
                  ]}
                />
              </>
            )}

            {draft.goal !== "maintain" && (
              <PlanSelect
                label={
                  draft.goal === "lose"
                    ? "Target loss"
                    : "Target gain"
                }
                value={String(draft.weeklyRate)}
                onChange={(value) =>
                  update("weeklyRate", Number(value))
                }
                options={
                  draft.goal === "lose"
                    ? [
                        ["0.25", formatWeeklyRate(0.25)],
                        ["0.5", formatWeeklyRate(0.5)],
                        ["0.75", formatWeeklyRate(0.75)],
                      ]
                    : [
                        ["0.1", formatWeeklyRate(0.1)],
                        ["0.25", formatWeeklyRate(0.25)],
                        ["0.5", formatWeeklyRate(0.5)],
                      ]
                }
              />
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            Activity level matters a lot for the calorie estimate.
            CYG uses this as a starting estimate; later we can
            make it adaptive from your real weight trend and intake.
          </div>
        </section>

        <section className="rounded-3xl border border-blue-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Estimated targets
          </p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Body-weight goal
            </p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <p className="text-2xl font-bold">
                {formatWeight(draft.weight, displaySettings.units)} → {formatWeight(draft.targetWeight, displaySettings.units)}
              </p>
              <p className="text-sm text-slate-500">
                {formatWeight(Math.abs(draft.targetWeight - draft.weight), displaySettings.units)} difference
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <PlanResult
              label="BMR"
              value={formatEnergy(result.bmr, displaySettings.energyUnit)}
              detail="Estimated resting needs"
            />
            <PlanResult
              label="Maintenance"
              value={formatEnergy(result.maintenance, displaySettings.energyUnit)}
              detail="Estimated daily expenditure"
            />
          </div>

          <div className="mt-5 rounded-3xl border border-blue-500/20 bg-white p-6">
            <p className="text-sm text-slate-500">
              Daily calorie target
            </p>
            <p className="mt-2 text-5xl font-black text-blue-600">
              {energyDisplay(result.calories, displaySettings.energyUnit).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {displaySettings.energyUnit === "kj" ? "kJ" : "kcal"} / day
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <PlanMacro label="Protein" value={result.protein} />
            <PlanMacro label="Carbs" value={result.carbs} />
            <PlanMacro label="Fat" value={result.fat} />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-semibold">How it is calculated</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              BMR uses the Mifflin-St Jeor equation. Maintenance is
              BMR multiplied by the selected activity factor. Goal
              calories are adjusted from maintenance. Protein and fat
              receive minimum targets first, and remaining calories
              are assigned to carbohydrates.
            </p>
          </div>

          <button
            onClick={applyPlan}
            className="mt-6 w-full rounded-xl bg-blue-500 py-4 text-lg font-bold text-white transition hover:bg-blue-400"
          >
            Apply these targets
          </button>

          {calculated && (
            <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-500">
              Plan applied. Your Nutrition and Dashboard targets are
              now updated.
              <button
                onClick={() => setActivePage("dashboard")}
                className="ml-2 font-bold underline"
              >
                Open Dashboard
              </button>
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-slate-600">
            These are estimates, not medical or dietetic advice.
            Real maintenance can differ, so future CYG versions
            should adjust the plan from actual weight trends.
          </p>
        </section>
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              Weekly Schedule
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Strength + cardio together
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              CYG spreads strength and cardio across the week and tries
              to avoid placing harder cardio directly before lower-body training.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {weeklySchedule.map((day) => (
            <div
              key={day.day}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {day.day}
              </p>

              <div className="mt-3 space-y-2">
                {day.items.length > 0 ? (
                  day.items.map((item, index) => (
                    <div
                      key={`${item.label}-${index}`}
                      className="rounded-xl bg-white p-3"
                    >
                      <p className="text-sm font-bold">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-semibold text-slate-500">
                    Rest
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {(draft.cardioGoal ?? "health") !== "none" && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-bold">
              Cardio approach
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {getCardioGuidance(draft)}
            </p>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              Training Plan
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Your {draft.trainingDays}-day starting program
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Built from your weekly availability, experience and equipment.
              Use it as your starting structure and log the sessions in Training.
            </p>
          </div>

          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-500">
            {draft.experience ?? "intermediate"} · {(draft.equipment ?? "full-gym").replace("-", " ")}
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {trainingPlan.map((day, index) => (
            <div
              key={`${day.name}-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                    Day {index + 1}
                  </p>
                  <h3 className="mt-1 text-xl font-bold">{day.name}</h3>
                </div>
                <span className="rounded-lg bg-white px-3 py-2 text-xs text-slate-500">
                  {day.exercises.length} exercises
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {day.exercises.map((exercise, exerciseIndex) => (
                  <div
                    key={`${day.name}-${exercise.name}-${exerciseIndex}`}
                    className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3 first:border-t-0 first:pt-0"
                  >
                    <div>
                      <p className="font-semibold">{exercise.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {exercise.note}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-slate-700">
                      {exercise.sets} × {exercise.reps}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          Start with loads that leave roughly 1–3 good reps in reserve on most
          working sets. When you reach the top of the rep range with solid form,
          add a small amount of weight next time. Save the generated program
          directly into Saved Workouts when you are ready.
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={saveTrainingPlanToTraining}
            className="rounded-xl bg-blue-500 px-5 py-3 font-bold text-white transition hover:bg-blue-400"
          >
            Save plan to Training
          </button>

          <button
            onClick={() => setActivePage("training")}
            className="rounded-xl border border-slate-300 px-5 py-3 font-bold transition hover:bg-slate-100"
          >
            Open Training
          </button>
        </div>

        {planSavedToTraining && (
          <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-500">
            Training plan saved. Open Training → Saved Workouts to use it.
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              Nutrition History
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Your recent intake
            </h2>
          </div>
          <span className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
            Last 14 completed days
          </span>
        </div>

        {recentNutrition ? (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <PlanResult
                label="Average calories"
                value={formatEnergy(recentNutrition.calories, displaySettings.energyUnit)}
                detail={`${recentNutrition.days} logged day${recentNutrition.days === 1 ? "" : "s"}`}
              />
              <PlanResult
                label="Average protein"
                value={`${recentNutrition.protein} g`}
                detail={`Target ${goals.protein} g`}
              />
              <PlanResult
                label="Average carbs"
                value={`${recentNutrition.carbs} g`}
                detail={`Target ${goals.carbs} g`}
              />
              <PlanResult
                label="Average fat"
                value={`${recentNutrition.fat} g`}
                detail={`Target ${goals.fat} g`}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-600">
                Average calorie adherence
              </p>
              <p className="mt-2 text-2xl font-bold">
                {recentNutrition.calories - goals.calories > 0 ? "+" : ""}
                {formatEnergy(recentNutrition.calories - goals.calories, displaySettings.energyUnit)}/day
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Difference between your logged average and current target.
              </p>
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <p className="font-semibold">No completed nutrition days yet.</p>
            <p className="mt-2 text-sm text-slate-500">
              CYG now saves a daily nutrition snapshot automatically.
              Tomorrow, today's totals will become your first completed day.
            </p>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              Adaptive CYG
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Weight-trend check-in
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              CYG compares your recent weight trend with the weekly
              rate selected in your Get Fit Plan. It only suggests a small
              calorie change; you decide whether to apply it.
            </p>
          </div>

          <span className={`rounded-full border px-4 py-2 text-xs font-semibold ${
            adaptive.ready
              ? "border-blue-500/30 bg-blue-500/10 text-blue-500"
              : "border-slate-300 bg-slate-50 text-slate-600"
          }`}>
            {adaptive.ready ? "Analysis ready" : "Collecting data"}
          </span>
        </div>

        {!adaptive.ready ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <p className="font-semibold">
              {adaptive.message}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Add body-weight measurements in Progress. For a useful trend,
              CYG needs at least 4 measurements spanning at least 7 days.
            </p>
            <button
              onClick={() => setActivePage("progress")}
              className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-white"
            >
              Open Progress
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <PlanResult
                label="Observed trend"
                value={formatSignedWeeklyRate(adaptive.observedRate!)}
                detail="Based on recent weigh-ins"
              />
              <PlanResult
                label="Planned trend"
                value={formatSignedWeeklyRate(adaptive.targetRate!)}
                detail="From your Get Fit Plan"
              />
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
              <p className="text-sm font-semibold text-blue-500">
                CYG recommendation
              </p>
              <p className="mt-3 text-xl font-bold">
                {adaptive.suggestedCalories !== null && adaptive.suggestedCalories !== goals.calories
                  ? `${adaptive.suggestedCalories > goals.calories ? "Increase" : "Decrease"} calories by ${formatEnergy(Math.abs(adaptive.suggestedCalories - goals.calories), displaySettings.energyUnit)}/day.`
                  : adaptive.recommendation}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {adaptive.explanation}
              </p>

              {recentNutrition &&
                adaptive.ready &&
                adaptive.observedRate !== null && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-600">
                      Estimated real maintenance
                    </p>
                    <p className="mt-2 text-xl font-bold">
                      {formatEnergy(
                        Math.round(recentNutrition.calories - (adaptive.observedRate * 7700) / 7),
                        displaySettings.energyUnit
                      )}/day
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Early estimate from logged intake and recent weight trend.
                      Accuracy improves with consistent logging.
                    </p>
                  </div>
                )}

              {adaptive.suggestedCalories !== null &&
                adaptive.suggestedCalories !== goals.calories && (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-xs text-slate-500">Suggested target</p>
                      <p className="mt-1 text-2xl font-black">
                        {formatEnergy(adaptive.suggestedCalories, displaySettings.energyUnit)}
                      </p>
                    </div>

                    <button
                      onClick={applyAdaptiveAdjustment}
                      className="rounded-xl bg-blue-500 px-5 py-3 font-bold text-white transition hover:bg-blue-400"
                    >
                      Apply adjustment
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}

        <p className="mt-5 text-xs leading-5 text-slate-600">
          CYG uses your weight trend together with completed nutrition-day history.
          More consistent logging makes the recommendation more representative.
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <h2 className="text-xl font-bold">Current saved targets</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <PlanResult
            label="Calories"
            value={formatEnergy(goals.calories, displaySettings.energyUnit)}
            detail="Current Nutrition goal"
          />
          <PlanResult
            label="Protein"
            value={`${goals.protein} g`}
            detail="Current goal"
          />
          <PlanResult
            label="Carbs"
            value={`${goals.carbs} g`}
            detail="Current goal"
          />
          <PlanResult
            label="Fat"
            value={`${goals.fat} g`}
            detail="Current goal"
          />
        </div>
      </section>
    </>
  );
}

type WeeklyScheduleItem = {
  label: string;
  detail: string;
};

type WeeklyScheduleDay = {
  day: string;
  items: WeeklyScheduleItem[];
};

function cardioLabel(type: BodyProfile["cardioType"]) {
  const labels: Record<BodyProfile["cardioType"], string> = {
    walking: "Walking",
    running: "Running",
    cycling: "Cycling",
    "incline-walk": "Incline walk",
    stairmaster: "Stairmaster",
    rowing: "Rowing",
  };

  return labels[type] ?? "Cardio";
}

function getCardioSession(
  profile: BodyProfile,
  sessionIndex: number
): WeeklyScheduleItem {
  const type = profile.cardioType ?? "cycling";
  const activity = cardioLabel(type);
  const goal = profile.cardioGoal ?? "health";

  if (goal === "endurance" || goal === "performance") {
    if (sessionIndex === 1 && (profile.cardioDays ?? 2) >= 2) {
      return {
        label: `${activity} · Quality`,
        detail:
          "20–35 min total. Use controlled tempo/interval work; avoid taking every interval to maximum effort.",
      };
    }

    return {
      label: `${activity} · Zone 2`,
      detail:
        "30–50 min easy aerobic work at a sustainable conversational effort.",
    };
  }

  if (goal === "fat-loss") {
    return {
      label: `${activity} · Easy`,
      detail:
        "25–45 min mostly easy aerobic work. Use cardio to support the plan, not to compensate for food.",
    };
  }

  return {
    label: `${activity} · Zone 2`,
    detail:
      "20–40 min easy aerobic work at a sustainable conversational effort.",
  };
}

function getCardioGuidance(profile: BodyProfile) {
  const goal = profile.cardioGoal ?? "health";

  if (goal === "fat-loss") {
    return "Keep most cardio easy and recoverable. Nutrition still drives the planned calorie deficit; cardio adds activity without needing to make every session hard.";
  }

  if (goal === "endurance") {
    return "Most sessions stay easy. When you have at least two cardio days, one session can be a controlled quality session while the others build aerobic volume.";
  }

  if (goal === "performance") {
    return "Combine easy aerobic work with one quality session. CYG keeps harder cardio away from lower-body sessions where possible to reduce interference.";
  }

  return "Use mostly easy Zone 2-style cardio for general fitness and recovery. You should finish with more in the tank rather than exhausted.";
}

function buildWeeklySchedule(
  profile: BodyProfile,
  trainingPlan: GeneratedTrainingDay[]
): WeeklyScheduleDay[] {
  const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const week: WeeklyScheduleDay[] = names.map((day) => ({
    day,
    items: [],
  }));

  const strengthSlots: Record<number, number[]> = {
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 4, 5],
    6: [0, 1, 2, 4, 5, 6],
  };

  const fallbackSlots =
    strengthSlots[Math.min(6, Math.max(2, trainingPlan.length))] ??
    strengthSlots[4];

  const preferred = Array.isArray(profile.preferredTrainingDays)
    ? [...new Set(profile.preferredTrainingDays)]
        .filter((day) => day >= 0 && day <= 6)
        .slice(0, trainingPlan.length)
    : [];

  const slots = [...preferred];

  for (const fallback of fallbackSlots) {
    if (slots.length >= trainingPlan.length) {
      break;
    }

    if (!slots.includes(fallback)) {
      slots.push(fallback);
    }
  }

  for (let day = 0; day < 7 && slots.length < trainingPlan.length; day++) {
    if (!slots.includes(day)) {
      slots.push(day);
    }
  }

  trainingPlan.forEach((trainingDay, index) => {
    const slot = slots[index] ?? index;

    if (week[slot]) {
      week[slot].items.push({
        label: trainingDay.name,
        detail: "Strength training",
      });
    }
  });

  if ((profile.cardioGoal ?? "health") === "none") {
    return week;
  }

  const cardioDays = Math.min(
    5,
    Math.max(1, profile.cardioDays ?? 2)
  );

  const lowerBodyDays = new Set<number>();

  trainingPlan.forEach((trainingDay, index) => {
    const slot = slots[index] ?? index;
    const lowerName = trainingDay.name.toLowerCase();

    if (
      lowerName.includes("leg") ||
      lowerName.includes("lower") ||
      lowerName.includes("full body")
    ) {
      lowerBodyDays.add(slot);
    }
  });

  const isHardCardio =
    profile.cardioGoal === "endurance" ||
    profile.cardioGoal === "performance";

  const scoredDays = week.map((day, index) => {
    const hasStrength = day.items.length > 0;
    const tomorrowLower = lowerBodyDays.has((index + 1) % 7);
    const todayLower = lowerBodyDays.has(index);

    let score = 0;

    if (!hasStrength) score += 5;
    if (!todayLower) score += 3;
    if (!tomorrowLower) score += isHardCardio ? 4 : 1;

    // Prefer spreading cardio through the week.
    score += index % 2 === 1 ? 1 : 0;

    return { index, score };
  });

  const selected: number[] = [];

  for (const candidate of scoredDays.sort((a, b) => b.score - a.score)) {
    if (selected.length >= cardioDays) break;

    const tooClose = selected.some(
      (chosen) => Math.abs(chosen - candidate.index) === 1
    );

    if (!tooClose || cardioDays >= 4) {
      selected.push(candidate.index);
    }
  }

  // Fill any remaining requested sessions.
  for (let i = 0; i < 7 && selected.length < cardioDays; i++) {
    if (!selected.includes(i)) {
      selected.push(i);
    }
  }

  selected
    .sort((a, b) => a - b)
    .forEach((dayIndex, sessionIndex) => {
      week[dayIndex].items.push(
        getCardioSession(profile, sessionIndex)
      );
    });

  return week;
}

type GeneratedTrainingExercise = {
  name: string;
  sets: number;
  reps: string;
  note: string;
};

type GeneratedTrainingDay = {
  name: string;
  exercises: GeneratedTrainingExercise[];
};

function buildTrainingPlan(
  profile: BodyProfile
): GeneratedTrainingDay[] {
  const days = Math.max(
    2,
    Math.min(6, profile.trainingDays || 4)
  );

  const sets =
    profile.experience === "beginner"
      ? 2
      : profile.experience === "advanced"
        ? 4
        : 3;

  const gym = profile.equipment === "full-gym";
  const home = profile.equipment === "home";

  const chestPress = gym
    ? "Chest Press (Machine)"
    : home
      ? "Dumbbell Bench Press"
      : "Push Up";

  const inclinePress = gym
    ? "Incline Dumbbell Press"
    : home
      ? "Incline Dumbbell Press"
      : "Feet-Elevated Push Up";

  const verticalPull = gym
    ? "Lat Pulldown"
    : home
      ? "One Arm Dumbbell Row"
      : "Pull Up";

  const row = gym
    ? "Seated Cable Row"
    : home
      ? "One Arm Dumbbell Row"
      : "Inverted Row";

  const shoulderPress = gym
    ? "Shoulder Press (Dumbbell)"
    : home
      ? "Dumbbell Shoulder Press"
      : "Pike Push Up";

  const lateralRaise = gym || home
    ? "Lateral Raise"
    : "Side Plank";

  const squat = gym
    ? "Squat (Barbell)"
    : home
      ? "Goblet Squat"
      : "Bodyweight Squat";

  const hinge = gym
    ? "Romanian Deadlift"
    : home
      ? "Dumbbell Romanian Deadlift"
      : "Single Leg Glute Bridge";

  const quad = gym
    ? "Leg Press"
    : home
      ? "Bulgarian Split Squat"
      : "Reverse Lunge";

  const hamstring = gym
    ? "Leg Curl (Seated)"
    : home
      ? "Dumbbell Romanian Deadlift"
      : "Sliding Leg Curl";

  const calves = gym
    ? "Standing Calf Raise"
    : "Single Leg Calf Raise";

  const biceps = gym
    ? "Cable Curl"
    : home
      ? "Dumbbell Curl"
      : "Chin Up";

  const triceps = gym
    ? "Triceps Pushdown"
    : home
      ? "Dumbbell Overhead Triceps Extension"
      : "Close Grip Push Up";

  const ex = (
    name: string,
    reps: string,
    note = "Controlled reps · progress when the rep range is completed"
  ): GeneratedTrainingExercise => ({
    name,
    sets,
    reps,
    note,
  });

  const uniqueExercises = (
    exercises: GeneratedTrainingExercise[]
  ) => {
    const seen = new Set<string>();

    return exercises.filter((exercise) => {
      const key = exercise.name.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  };

  const push: GeneratedTrainingDay = {
    name: "Push",
    exercises: uniqueExercises([
      ex(chestPress, "6–10"),
      ex(inclinePress, "8–12"),
      ex(shoulderPress, "6–10"),
      ex(lateralRaise, "10–15"),
      ex(triceps, "8–15"),
    ]),
  };

  const pull: GeneratedTrainingDay = {
    name: "Pull",
    exercises: uniqueExercises([
      ex(verticalPull, "6–10"),
      ex(row, "8–12"),
      ex(gym ? "Chest Supported Row" : row, "8–12"),
      ex(gym ? "Face Pull" : lateralRaise, "10–15"),
      ex(biceps, "8–15"),
    ]),
  };

  const legs: GeneratedTrainingDay = {
    name: "Legs",
    exercises: uniqueExercises([
      ex(squat, "6–10"),
      ex(hinge, "6–10"),
      ex(quad, "8–12"),
      ex(hamstring, "8–12"),
      ex(calves, "10–15"),
    ]),
  };

  const upper: GeneratedTrainingDay = {
    name: "Upper",
    exercises: uniqueExercises([
      ex(chestPress, "6–10"),
      ex(verticalPull, "6–10"),
      ex(inclinePress, "8–12"),
      ex(row, "8–12"),
      ex(lateralRaise, "10–15"),
      ex(biceps, "8–15"),
      ex(triceps, "8–15"),
    ]),
  };

  const lower: GeneratedTrainingDay = {
    name: "Lower",
    exercises: uniqueExercises([
      ex(squat, "6–10"),
      ex(hinge, "6–10"),
      ex(quad, "8–12"),
      ex(hamstring, "8–12"),
      ex(calves, "10–15"),
    ]),
  };

  const fullA: GeneratedTrainingDay = {
    name: "Full Body A",
    exercises: uniqueExercises([
      ex(squat, "6–10"),
      ex(chestPress, "6–10"),
      ex(verticalPull, "6–10"),
      ex(hinge, "8–12"),
      ex(lateralRaise, "10–15"),
    ]),
  };

  const fullB: GeneratedTrainingDay = {
    name: "Full Body B",
    exercises: uniqueExercises([
      ex(quad, "8–12"),
      ex(inclinePress, "8–12"),
      ex(row, "8–12"),
      ex(hamstring, "8–12"),
      ex(biceps, "8–15"),
      ex(triceps, "8–15"),
    ]),
  };

  if (days === 2) {
    return [fullA, fullB];
  }

  if (days === 3) {
    return [
      fullA,
      {
        ...fullB,
        name: "Full Body B",
      },
      {
        ...fullA,
        name: "Full Body C",
        exercises: [
          ex(hinge, "6–10"),
          ex(inclinePress, "8–12"),
          ex(row, "8–12"),
          ex(quad, "8–12"),
          ex(lateralRaise, "10–15"),
        ],
      },
    ];
  }

  if (days === 4) {
    return [upper, lower, { ...upper, name: "Upper 2" }, { ...lower, name: "Lower 2" }];
  }

  if (days === 5) {
    return [push, pull, legs, upper, lower];
  }

  return [
    push,
    pull,
    legs,
    { ...push, name: "Push 2" },
    { ...pull, name: "Pull 2" },
    { ...legs, name: "Legs 2" },
  ];
}

type AdaptiveResult = {
  ready: boolean;
  message: string;
  observedRate: number | null;
  targetRate: number | null;
  suggestedCalories: number | null;
  recommendation: string;
  explanation: string;
};

function calculateAdaptiveAdjustment(
  entries: WeightEntry[],
  profile: BodyProfile,
  goals: Goals
): AdaptiveResult {
  const sorted = [...entries]
    .filter(
      (entry) =>
        Number.isFinite(entry.weight) &&
        entry.weight > 0 &&
        !Number.isNaN(getWeightEntryTime(entry))
    )
    .sort(
      (a, b) =>
        getWeightEntryTime(a) -
        getWeightEntryTime(b)
    );

  if (profile.goal === "maintain") {
    if (sorted.length < 4) {
      return {
        ready: false,
        message: "Not enough weight data yet.",
        observedRate: null,
        targetRate: 0,
        suggestedCalories: null,
        recommendation: "",
        explanation: "",
      };
    }
  } else if (sorted.length < 4) {
    return {
      ready: false,
      message: "Not enough weight data yet.",
      observedRate: null,
      targetRate:
        profile.goal === "lose"
          ? -profile.weeklyRate
          : profile.weeklyRate,
      suggestedCalories: null,
      recommendation: "",
      explanation: "",
    };
  }

  const latestTime =
    getWeightEntryTime(sorted[sorted.length - 1]);

  const recent = sorted.filter(
    (entry) =>
      latestTime - getWeightEntryTime(entry) <=
      21 * 24 * 60 * 60 * 1000
  );

  const usable =
    recent.length >= 4 ? recent : sorted.slice(-8);

  const firstTime = getWeightEntryTime(usable[0]);
  const lastTime =
    getWeightEntryTime(usable[usable.length - 1]);

  const spanDays =
    (lastTime - firstTime) /
    (24 * 60 * 60 * 1000);

  if (spanDays < 7) {
    return {
      ready: false,
      message: "Your weigh-ins do not span 7 days yet.",
      observedRate: null,
      targetRate:
        profile.goal === "lose"
          ? -profile.weeklyRate
          : profile.goal === "gain"
            ? profile.weeklyRate
            : 0,
      suggestedCalories: null,
      recommendation: "",
      explanation: "",
    };
  }

  // Linear regression makes the estimate less sensitive to one noisy weigh-in.
  const points = usable.map((entry) => ({
    x:
      (getWeightEntryTime(entry) - firstTime) /
      (24 * 60 * 60 * 1000),
    y: entry.weight,
  }));

  const meanX =
    points.reduce((sum, point) => sum + point.x, 0) /
    points.length;
  const meanY =
    points.reduce((sum, point) => sum + point.y, 0) /
    points.length;

  const numerator = points.reduce(
    (sum, point) =>
      sum +
      (point.x - meanX) *
        (point.y - meanY),
    0
  );

  const denominator = points.reduce(
    (sum, point) =>
      sum + Math.pow(point.x - meanX, 2),
    0
  );

  const dailySlope =
    denominator > 0 ? numerator / denominator : 0;

  const observedRateRaw = dailySlope * 7;
  const observedRate =
    Math.round(observedRateRaw * 100) / 100;

  const targetRate =
    profile.goal === "lose"
      ? -profile.weeklyRate
      : profile.goal === "gain"
        ? profile.weeklyRate
        : 0;

  const difference = observedRateRaw - targetRate;
  const tolerance =
    profile.goal === "maintain"
      ? 0.15
      : Math.max(0.12, Math.abs(targetRate) * 0.3);

  let calorieAdjustment = 0;

  if (difference > tolerance) {
    calorieAdjustment = -100;
  } else if (difference < -tolerance) {
    calorieAdjustment = 100;
  }

  const suggestedCalories = Math.max(
    profile.sex === "male" ? 1500 : 1200,
    Math.round(
      (goals.calories + calorieAdjustment) / 10
    ) * 10
  );

  if (calorieAdjustment === 0) {
    return {
      ready: true,
      message: "",
      observedRate,
      targetRate,
      suggestedCalories: goals.calories,
      recommendation: "Keep your current calorie target.",
      explanation:
        "Your recent weight trend is close enough to the rate in your Get Fit Plan. No calorie adjustment is suggested right now.",
    };
  }

  const direction =
    calorieAdjustment > 0 ? "increase" : "decrease";

  return {
    ready: true,
    message: "",
    observedRate,
    targetRate,
    suggestedCalories,
    recommendation: `${direction === "increase" ? "Increase" : "Decrease"} calories by ${Math.abs(calorieAdjustment)} kcal/day.`,
    explanation:
      profile.goal === "lose"
        ? calorieAdjustment < 0
          ? "Your recent weight loss is slower than the selected target, so CYG suggests a small reduction rather than a large jump."
          : "Your recent weight loss is faster than the selected target, so CYG suggests adding a small amount of food."
        : profile.goal === "gain"
          ? calorieAdjustment > 0
            ? "Your recent weight gain is slower than the selected target, so CYG suggests a small calorie increase."
            : "Your recent weight gain is faster than the selected target, so CYG suggests a small calorie reduction."
          : calorieAdjustment > 0
            ? "Your weight is trending down while your goal is maintenance, so CYG suggests a small calorie increase."
            : "Your weight is trending up while your goal is maintenance, so CYG suggests a small calorie reduction.",
  };
}

function calculateNutritionTargets(profile: BodyProfile) {
  const weight = Math.max(35, profile.weight || 0);
  const height = Math.max(120, profile.height || 0);
  const age = Math.max(16, profile.age || 0);

  const sexOffset = profile.sex === "male" ? 5 : -161;

  const bmrRaw =
    10 * weight +
    6.25 * height -
    5 * age +
    sexOffset;

  const activityFactors: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    athlete: 1.9,
  };

  const maintenanceRaw =
    bmrRaw * activityFactors[profile.activity];

  const weeklyRate =
    profile.goal === "maintain"
      ? 0
      : Math.max(0, profile.weeklyRate || 0);

  const dailyEnergyAdjustment =
    (weeklyRate * 7700) / 7;

  let targetCaloriesRaw = maintenanceRaw;

  if (profile.goal === "lose") {
    targetCaloriesRaw -= dailyEnergyAdjustment;
  }

  if (profile.goal === "gain") {
    targetCaloriesRaw += dailyEnergyAdjustment;
  }

  const calorieFloor =
    profile.sex === "male" ? 1500 : 1200;

  const targetCalories = Math.max(
    calorieFloor,
    targetCaloriesRaw
  );

  const proteinPerKg =
    profile.goal === "lose"
      ? 2.0
      : profile.goal === "gain"
        ? 1.8
        : 1.6;

  const protein = Math.round(weight * proteinPerKg);

  const fatPerKg =
    profile.goal === "lose" ? 0.8 : 0.9;

  const fat = Math.round(weight * fatPerKg);

  const caloriesAfterProteinAndFat =
    targetCalories -
    protein * 4 -
    fat * 9;

  const carbs = Math.max(
    50,
    Math.round(caloriesAfterProteinAndFat / 4)
  );

  return {
    bmr: Math.round(bmrRaw / 10) * 10,
    maintenance: Math.round(maintenanceRaw / 10) * 10,
    calories: Math.round(targetCalories / 10) * 10,
    protein,
    carbs,
    fat,
  };
}

function PlanNumber({
  label,
  value,
  unit,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(() => String(value));
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!editing) setDraft(String(value));
  }, [value, editing]);
  return (
    <label>
      <span className="mb-2 block text-sm text-slate-600">
        {label}
      </span>
      <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 focus-within:border-blue-500">
        <input
          type="number"
          value={editing ? draft : String(value)}
          min={min}
          max={max}
          step={step}
          onFocus={() => setEditing(true)}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            if (next !== "" && Number.isFinite(Number(next))) onChange(Number(next));
          }}
          onBlur={() => {
            setEditing(false);
            const parsed = Number(draft);
            if (draft !== "" && Number.isFinite(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
          }}
          className="w-full bg-transparent p-4 outline-none"
        />
        <span className="pr-4 text-sm text-slate-500">
          {unit}
        </span>
      </div>
    </label>
  );
}

function PlanSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm text-slate-600">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-blue-500"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function PlanResult({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-600">
        {label}
      </p>
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-600">{detail}</p>
    </div>
  );
}

function PlanMacro({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold">{value} g</p>
    </div>
  );
}

function Nutrition({
  foods,
  meals,
  goals,
  setGoals,
  addFood,
  addFoods,
  deleteFood,
  moveFood,
  addMeal,
  deleteMeal,
  caloriesEaten,
  proteinEaten,
  carbsEaten,
  fatEaten,
  caloriesRemaining,
  proteinRemaining,
  carbsRemaining,
  fatRemaining,
  nutritionHistory,
  foodDiaryHistory,
  updateFood,
  duplicateFood,
  duplicateMeal,
  copyYesterdayFoods,
}: {
  foods: Food[];
  meals: Meal[];
  goals: Goals;
  setGoals: React.Dispatch<
    React.SetStateAction<Goals>
  >;
  addFood: (
    food: Food
  ) => void;
  addFoods: (
    foods: Food[]
  ) => void;
  deleteFood: (
    id: number
  ) => void;
  moveFood: (
    foodId: number,
    mealId: string
  ) => void;
  addMeal: (
    name: string
  ) => void;
  deleteMeal: (
    mealId: string
  ) => void;
  caloriesEaten: number;
  proteinEaten: number;
  carbsEaten: number;
  fatEaten: number;
  caloriesRemaining: number;
  proteinRemaining: number;
  carbsRemaining: number;
  fatRemaining: number;
  nutritionHistory: NutritionDay[];
  foodDiaryHistory: FoodDiaryDay[];
  updateFood: (food: Food) => void;
  duplicateFood: (id: number) => void;
  duplicateMeal: (mealId: string) => void;
  copyYesterdayFoods: () => boolean;
}) {
  const [
    showGoals,
    setShowGoals,
  ] = useState(false);

  const [
    showOptimizer,
    setShowOptimizer,
  ] = useState(false);

  const [
    showNewMeal,
    setShowNewMeal,
  ] = useState(false);

  const [
    newMealName,
    setNewMealName,
  ] = useState("");

  const [foodSearchMealId, setFoodSearchMealId] =
    useState<string | undefined>(undefined);

  const [diaryMessage, setDiaryMessage] =
    useState("");

  const [waterMl, setWaterMl] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const raw = localStorage.getItem(`bodypilot-water-${getTodayDateInput()}`);
      return raw ? Number(raw) : 0;
    } catch { return 0; }
  });
  const [savedMeals, setSavedMeals] = useState<{id:string; name:string; foods:Food[]}[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("bodypilot-saved-meals");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [recipes, setRecipes] = useState<{id:string; name:string; servings:number; foods:Food[]}[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("bodypilot-recipes");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    let cancelled = false;
    async function hydrateNutritionExtras() {
      const [cloudWater, cloudSavedMeals, cloudRecipes] = await Promise.all([
        loadCloudData<number>(`water_${getTodayDateInput()}`),
        loadCloudData<{id:string; name:string; foods:Food[]}[]>("saved_meals"),
        loadCloudData<{id:string; name:string; servings:number; foods:Food[]}[]>("recipes"),
      ]);
      if (cancelled) return;
      if (typeof cloudWater === "number") setWaterMl(cloudWater);
      if (Array.isArray(cloudSavedMeals)) setSavedMeals(cloudSavedMeals);
      if (Array.isArray(cloudRecipes)) setRecipes(cloudRecipes);
    }
    void hydrateNutritionExtras();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    localStorage.setItem(`bodypilot-water-${getTodayDateInput()}`, String(waterMl));
    void saveCloudData(`water_${getTodayDateInput()}`, waterMl);
  }, [waterMl]);

  useEffect(() => {
    localStorage.setItem("bodypilot-saved-meals", JSON.stringify(savedMeals));
    void saveCloudData("saved_meals", savedMeals);
  }, [savedMeals]);

  useEffect(() => {
    localStorage.setItem("bodypilot-recipes", JSON.stringify(recipes));
    void saveCloudData("recipes", recipes);
  }, [recipes]);

  function saveMealFromDiary() {
    const name = window.prompt("Saved meal name:");
    if (!name?.trim() || foods.length === 0) return;
    setSavedMeals((current) => [
      ...current,
      { id: `${Date.now()}`, name: name.trim(), foods: foods.map((f) => ({...f, id: Date.now() + Math.random()})) },
    ]);
  }

  function addSavedMeal(item: {id:string; name:string; foods:Food[]}) {
    addFoods(item.foods.map((food) => ({...food, id: Date.now() + Math.random()})));
  }

  function createRecipeFromDiary() {
    const name = window.prompt("Recipe name:");
    if (!name?.trim() || foods.length === 0) return;
    const servings = Math.max(1, Number(window.prompt("Number of servings:", "1")) || 1);
    setRecipes((current) => [
      ...current,
      { id: `${Date.now()}`, name: name.trim(), servings, foods: foods.map((f) => ({...f})) },
    ]);
  }

  function addRecipe(recipe: {id:string; name:string; servings:number; foods:Food[]}) {
    const scale = 1 / Math.max(1, recipe.servings);
    addFoods(recipe.foods.map((food) => ({
      ...food,
      id: Date.now() + Math.random(),
      calories: round1(food.calories * scale),
      protein: round1(food.protein * scale),
      carbs: round1(food.carbs * scale),
      fat: round1(food.fat * scale),
    })));
  }

  const [
    calories,
    setCalories,
  ] = useState(
    String(goals.calories)
  );

  const [
    protein,
    setProtein,
  ] = useState(
    String(goals.protein)
  );

  const [
    carbs,
    setCarbs,
  ] = useState(
    String(goals.carbs)
  );

  const [
    fat,
    setFat,
  ] = useState(
    String(goals.fat)
  );

  const nutritionStats = useMemo(() => {
    const completed = nutritionHistory
      .filter((day) => day.date !== getTodayDateInput());

    function average(days: number) {
      const sample = completed.slice(-days);

      if (sample.length === 0) {
        return null;
      }

      return Math.round(
        sample.reduce(
          (sum, day) => sum + day.calories,
          0
        ) / sample.length
      );
    }

    const recent14 = completed.slice(-14);
    const adherent = recent14.filter(
      (day) =>
        goals.calories > 0 &&
        Math.abs(day.calories - goals.calories) <=
          goals.calories * 0.1
    ).length;

    return {
      avg7: average(7),
      avg14: average(14),
      adherence:
        recent14.length > 0
          ? Math.round(
              (adherent / recent14.length) * 100
            )
          : null,
    };
  }, [nutritionHistory, goals.calories]);

  function saveGoals() {
    const newGoals = {
      calories:
        Number(calories),
      protein:
        Number(protein),
      carbs:
        Number(carbs),
      fat:
        Number(fat),
    };

    if (
      newGoals.calories <=
        0 ||
      newGoals.protein <=
        0 ||
      newGoals.carbs <= 0 ||
      newGoals.fat <= 0
    ) {
      return;
    }

    setGoals(newGoals);
    setShowGoals(false);
  }

  function createMeal() {
    if (
      !newMealName.trim()
    ) {
      return;
    }

    addMeal(newMealName);

    setNewMealName("");
    setShowNewMeal(false);
  }
return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="text-sm font-semibold tracking-widest text-blue-600">
            NUTRITION
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Daily nutrition
          </h1>

          <p className="mt-2 text-slate-600">
            Track your meals
            and hit your
            targets.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              setShowNewMeal(
                !showNewMeal
              )
            }
            className="rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400"
          >
            + New meal
          </button>

          <button
            onClick={() =>
              setShowGoals(
                !showGoals
              )
            }
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-white"
          >
            Edit goals
          </button>
        </div>
      </div>

      <NutritionInsights
        foods={foods}
        caloriesEaten={caloriesEaten}
        proteinEaten={proteinEaten}
        carbsEaten={carbsEaten}
        fatEaten={fatEaten}
        goals={goals}
        nutritionHistory={nutritionHistory}
        waterMl={waterMl}
        setWaterMl={setWaterMl}
      />

      {showNewMeal && (
        <section className="mt-6 rounded-3xl border border-blue-500/30 bg-white p-6">
                  <h2 className="text-xl font-semibold">
            Create a meal
          </h2>

          <p className="mt-2 text-slate-600">
            Example:
            Pre-workout meal,
            Post-workout or
            Before bed.
          </p>

          <div className="mt-5 flex gap-3">
            <input
              value={
                newMealName
              }
              onChange={(
                event
              ) =>
                setNewMealName(
                  event.target
                    .value
                )
              }
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  createMeal();
                }
              }}
              placeholder="Meal name"
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-blue-500"
            />

            <button
              onClick={
                createMeal
              }
              className="rounded-xl bg-blue-500 px-6 font-semibold text-white"
            >
              Create
            </button>
          </div>
        </section>
      )}

      {showGoals && (
        <section className="mt-8 rounded-3xl border border-blue-500/30 bg-white p-7">
          <h2 className="text-2xl font-semibold">
            Daily goals
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <NumberInput
              label="Calories"
              value={calories}
              setValue={
                setCalories
              }
              unit="kcal"
            />

            <NumberInput
              label="Protein"
              value={protein}
              setValue={
                setProtein
              }
              unit="g"
            />

            <NumberInput
              label="Carbs"
              value={carbs}
              setValue={
                setCarbs
              }
              unit="g"
            />

            <NumberInput
              label="Fat"
              value={fat}
              setValue={
                setFat
              }
              unit="g"
            />
          </div>

          <button
            onClick={
              saveGoals
            }
            className="mt-6 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white"
          >
            Save goals
          </button>
        </section>
      )}

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7">
        <h2 className="text-xl font-semibold">
          Remaining today
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-4">
          <RemainingCard
            name="Calories"
            value={
              caloriesRemaining
            }
            unit="kcal"
          />

          <RemainingCard
            name="Protein"
            value={
              proteinRemaining
            }
            unit="g"
          />

          <RemainingCard
            name="Carbs"
            value={
              carbsRemaining
            }
            unit="g"
          />

          <RemainingCard
            name="Fat"
            value={
              fatRemaining
            }
            unit="g"
          />
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MacroCard
          name="Protein"
          eaten={
            proteinEaten
          }
          goal={
            goals.protein
          }
        />

        <MacroCard
          name="Carbs"
          eaten={
            carbsEaten
          }
          goal={
            goals.carbs
          }
        />

        <MacroCard
          name="Fat"
          eaten={fatEaten}
          goal={goals.fat}
        />
      </div>


      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600">Water</p>
              <p className="mt-1 text-2xl font-black">{(waterMl / 1000).toFixed(1)} L</p>
            </div>
            <span className="text-sm text-slate-600">Goal 3.0 L</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-sky-500" style={{width:`${Math.min(100,(waterMl/3000)*100)}%`}} />
          </div>
          <div className="mt-4 flex gap-2">
            {[250,500,750].map((ml) => (
              <button key={ml} onClick={() => setWaterMl((v) => v + ml)} className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold hover:bg-slate-50">
                +{ml} ml
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Saved meals</p>
          <div className="mt-3 space-y-2">
            {savedMeals.slice(-2).map((meal) => (
              <button key={meal.id} onClick={() => addSavedMeal(meal)} className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-left text-sm font-bold">
                <span>{meal.name}</span><span className="text-blue-600">+ Add</span>
              </button>
            ))}
            {savedMeals.length === 0 && <p className="text-sm text-slate-600">Save your current diary as a reusable meal.</p>}
          </div>
          <button onClick={saveMealFromDiary} className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-sm font-bold">Save current foods</button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Recipes</p>
          <div className="mt-3 space-y-2">
            {recipes.slice(-2).map((recipe) => (
              <button key={recipe.id} onClick={() => addRecipe(recipe)} className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-left text-sm font-bold">
                <span>{recipe.name} <span className="font-normal text-slate-600">/ serving</span></span>
                <span className="text-violet-600">+ Add</span>
              </button>
            ))}
            {recipes.length === 0 && <p className="text-sm text-slate-600">Create a reusable recipe from logged foods.</p>}
          </div>
          <button onClick={createRecipeFromDiary} className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-sm font-bold">Create recipe</button>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Micronutrients</p>
            <h3 className="mt-1 text-lg font-black">Nutrition quality</h3>
          </div>
          <span className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">V2 foundation</span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Fiber, sugar, sodium and vitamin/mineral totals will populate automatically as nutrient-rich food records are added. Existing macro-only foods remain fully compatible.
        </p>
      </section>

      <div id="food-search">
        <FoodSearch
          meals={meals}
          onAddFood={addFood}
          requestedMealId={foodSearchMealId}
        />
      </div>

      {diaryMessage && (
        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          {diaryMessage}
        </div>
      )}

      <FoodDiary
        foods={foods}
        meals={meals}
        goals={goals}
        onDelete={deleteFood}
        onMoveFood={moveFood}
        onDeleteMeal={deleteMeal}
        onUpdateFood={updateFood}
        onDuplicateFood={duplicateFood}
        onDuplicateMeal={duplicateMeal}
        hasYesterday={
          foodDiaryHistory.some((day) => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const key = [
              yesterday.getFullYear(),
              String(yesterday.getMonth() + 1).padStart(2, "0"),
              String(yesterday.getDate()).padStart(2, "0"),
            ].join("-");
            return day.date === key && day.foods.length > 0;
          })
        }
        onCopyYesterday={() => {
          const copied = copyYesterdayFoods();
          setDiaryMessage(
            copied
              ? "Yesterday's food was copied to today."
              : "No food log was found for yesterday."
          );
          window.setTimeout(() => setDiaryMessage(""), 3000);
        }}
        onAddFoodToMeal={(mealId) => {
          setFoodSearchMealId(mealId);
          document
            .getElementById("food-search")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      <button
        onClick={() =>
          setShowOptimizer(
            !showOptimizer
          )
        }
        className="mt-8 w-full rounded-2xl bg-blue-500 p-5 text-lg font-bold text-white transition hover:bg-blue-400"
      >
        {showOptimizer
          ? "Hide meal suggestion"
          : "What should I eat?"}
      </button>

      {showOptimizer && (
        <MealOptimizer
          caloriesRemaining={
            caloriesRemaining
          }
          proteinRemaining={
            proteinRemaining
          }
          carbsRemaining={
            carbsRemaining
          }
          fatRemaining={
            fatRemaining
          }
          meals={meals}
          displaySettings={readMucipesDisplaySettings()}
          onAddFoods={
            addFoods
          }
        />
      )}

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <PlanResult
          label="7-day average"
          value={
            nutritionStats.avg7 === null
              ? "—"
              : `${nutritionStats.avg7} kcal`
          }
          detail="Completed logged days"
        />
        <PlanResult
          label="14-day average"
          value={
            nutritionStats.avg14 === null
              ? "—"
              : `${nutritionStats.avg14} kcal`
          }
          detail="Completed logged days"
        />
        <PlanResult
          label="Adherence"
          value={
            nutritionStats.adherence === null
              ? "—"
              : `${nutritionStats.adherence}%`
          }
          detail="Within ±10% of calorie target"
        />
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              History
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Recent nutrition
            </h2>
          </div>
          <span className="text-sm text-slate-500">
            Daily totals are saved automatically
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-5 border-b border-slate-200 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <span>Date</span>
              <span>Calories</span>
              <span>Protein</span>
              <span>Carbs</span>
              <span>Fat</span>
            </div>

            {nutritionHistory.length > 0 ? (
              [...nutritionHistory]
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() -
                    new Date(a.date).getTime()
                )
                .slice(0, 14)
                .map((day) => (
                  <div
                    key={day.date}
                    className="grid grid-cols-5 border-b border-slate-200/60 py-4 text-sm"
                  >
                    <span className="font-semibold">
                      {day.date === getTodayDateInput() ? "Today" : day.date}
                    </span>
                    <span>{day.calories} kcal</span>
                    <span>{day.protein} g</span>
                    <span>{day.carbs} g</span>
                    <span>{day.fat} g</span>
                  </div>
                ))
            ) : (
              <p className="py-6 text-sm text-slate-500">
                Start logging food and your daily totals will appear here.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7">
        <p className="text-slate-600">
          Calories consumed
        </p>

        <p className="mt-2 text-3xl font-bold">
          {Math.round(
            caloriesEaten
          )}{" "}
          / {goals.calories}
        </p>

        <ProgressBar
          value={
            caloriesEaten
          }
          goal={
            goals.calories
          }
        />
      </section>
    </>
  );
}



function Progress({
  weightEntries,
  setWeightEntries,
  displaySettings,
}: {
  weightEntries: WeightEntry[];
  setWeightEntries: React.Dispatch<
    React.SetStateAction<WeightEntry[]>
  >;
  displaySettings: ReturnType<typeof readMucipesDisplaySettings>;
}) {
  const [activeProgressTab, setActiveProgressTab] =
    useState<"overview" | "weight" | "strength" | "records" | "body">(
      "overview"
    );

  const [weight, setWeight] = useState("");
  const [weightDate, setWeightDate] = useState(
    getTodayDateInput()
  );

  const [trainingHistory, setTrainingHistory] =
    useState<TrainingHistoryEntry[]>([]);

  const [selectedExerciseId, setSelectedExerciseId] =
    useState("");

  const [progressRange, setProgressRange] = useState<0 | 7 | 30 | 90 | 365>(30);
  const [measurements, setMeasurements] = useState<{date:string; waist?:number; chest?:number; arm?:number}[]>(() => {
    if (typeof window === "undefined") return [];
    try { const raw = localStorage.getItem("bodypilot-measurements"); return raw ? JSON.parse(raw) : []; }
    catch { return []; }
  });
  const [progressPhotos, setProgressPhotos] = useState<{id:string; date:string; dataUrl:string}[]>(() => {
    if (typeof window === "undefined") return [];
    try { const raw = localStorage.getItem("bodypilot-progress-photos"); return raw ? JSON.parse(raw) : []; }
    catch { return []; }
  });

  useEffect(() => {
    void loadCloudData<{date:string; waist?:number; chest?:number; arm?:number}[]>("measurements")
      .then((cloud) => { if (Array.isArray(cloud)) setMeasurements(cloud); });
  }, []);

  useEffect(() => {
    localStorage.setItem("bodypilot-measurements", JSON.stringify(measurements));
    void saveCloudData("measurements", measurements);
  }, [measurements]);
  useEffect(() => {
    void loadCloudData<{id:string; date:string; dataUrl:string}[]>("progress_photos")
      .then((cloud) => { if (Array.isArray(cloud) && cloud.length) setProgressPhotos(cloud.slice(-6)); })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const trimmed = progressPhotos.slice(-6);
    try { localStorage.setItem("bodypilot-progress-photos", JSON.stringify(trimmed)); }
    catch { /* compressed photos can still exceed a browser quota; cloud save remains best-effort */ }
    void saveCloudData("progress_photos", trimmed).catch(() => undefined);
  }, [progressPhotos]);

  async function addProgressPhoto(file?: File) {
    if (!file) return;
    try {
      const dataUrl = await compressProgressPhoto(file);
      setProgressPhotos(current => [...current, { id: `${Date.now()}`, date: getTodayDateInput(), dataUrl }].slice(-6));
    } catch (error) {
      console.error("Could not prepare progress photo:", error);
    }
  }

  useEffect(() => {
    let localLoaded = false;
    try {
      const savedHistory = localStorage.getItem("bodypilot-workout-history");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setTrainingHistory(parsed);
          localLoaded = parsed.length > 0;
        }
      }
    } catch (error) {
      console.error("Could not load workout history for progress:", error);
    }
    if (!localLoaded) {
      void loadCloudData<TrainingHistoryEntry[]>("workout_history")
        .then((cloud) => { if (Array.isArray(cloud)) setTrainingHistory(cloud); })
        .catch(() => undefined);
    }
  }, []);

  const sortedWeightEntries = useMemo(
    () =>
      [...weightEntries].sort(
        (a, b) =>
          getWeightEntryTime(a) -
          getWeightEntryTime(b)
      ),
    [weightEntries]
  );

  const exerciseOptions = useMemo(() => {
    const exerciseMap = new Map<
      string,
      string
    >();

    trainingHistory.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exerciseMap.set(
          exercise.exerciseId,
          exercise.exerciseName
        );
      });
    });

    return Array.from(exerciseMap.entries())
      .map(([id, name]) => ({
        id,
        name,
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  }, [trainingHistory]);

  useEffect(() => {
    if (
      exerciseOptions.length > 0 &&
      !exerciseOptions.some(
        (exercise) =>
          exercise.id === selectedExerciseId
      )
    ) {
      setSelectedExerciseId(
        exerciseOptions[0].id
      );
    }
  }, [exerciseOptions, selectedExerciseId]);

  const strengthData = useMemo(() => {
    if (!selectedExerciseId) {
      return [];
    }

    return [...trainingHistory]
      .sort(
        (a, b) =>
          new Date(a.finishedAt).getTime() -
          new Date(b.finishedAt).getTime()
      )
      .flatMap((workout) => {
        const exercise =
          workout.exercises.find(
            (item) =>
              item.exerciseId ===
              selectedExerciseId
          );

        if (!exercise) {
          return [];
        }

        const validSets = exercise.sets.filter(
          (set) =>
            Number.isFinite(set.weight) &&
            Number.isFinite(set.reps) &&
            set.weight > 0 &&
            set.reps > 0
        );

        if (validSets.length === 0) {
          return [];
        }

        const bestSet = validSets.reduce(
          (best, current) => {
            const bestScore =
              best.weight *
              (1 + best.reps / 30);

            const currentScore =
              current.weight *
              (1 + current.reps / 30);

            return currentScore > bestScore
              ? current
              : best;
          }
        );

        return [
          {
            id: workout.id,
            date: workout.finishedAt,
            weight: bestSet.weight,
            reps: bestSet.reps,
            estimated1RM:
              bestSet.weight *
              (1 + bestSet.reps / 30),
          },
        ];
      });
  }, [trainingHistory, selectedExerciseId]);

  const personalRecords = useMemo(() => {
    const recordMap = new Map<
      string,
      {
        exerciseId: string;
        exerciseName: string;
        weight: number;
        reps: number;
        estimated1RM: number;
        date: string;
      }
    >();

    trainingHistory.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (
            set.weight <= 0 ||
            set.reps <= 0
          ) {
            return;
          }

          const estimated1RM =
            set.weight *
            (1 + set.reps / 30);

          const current = recordMap.get(
            exercise.exerciseId
          );

          if (
            !current ||
            estimated1RM >
              current.estimated1RM
          ) {
            recordMap.set(
              exercise.exerciseId,
              {
                exerciseId:
                  exercise.exerciseId,
                exerciseName:
                  exercise.exerciseName,
                weight: set.weight,
                reps: set.reps,
                estimated1RM,
                date: workout.finishedAt,
              }
            );
          }
        });
      });
    });

    return Array.from(recordMap.values()).sort(
      (a, b) =>
        b.estimated1RM - a.estimated1RM
    );
  }, [trainingHistory]);

  const latest =
    sortedWeightEntries.length > 0
      ? sortedWeightEntries[
          sortedWeightEntries.length - 1
        ]
      : null;

  const first =
    sortedWeightEntries.length > 0
      ? sortedWeightEntries[0]
      : null;

  const change =
    latest && first
      ? round1(latest.weight - first.weight)
      : 0;

  const recentChange =
    sortedWeightEntries.length >= 2
      ? round1(
          sortedWeightEntries[
            sortedWeightEntries.length - 1
          ].weight -
            sortedWeightEntries[
              sortedWeightEntries.length - 2
            ].weight
        )
      : null;

  const inProgressRange = (date: string) =>
    progressRange === 0 || Date.now() - new Date(date).getTime() <= progressRange * 86400000;
  const displayWeightValue = (kg: number) => round1(kgToDisplay(kg, displaySettings.units));
  const signedWeight = (kg: number) => `${kg > 0 ? "+" : ""}${formatWeight(kg, displaySettings.units)}`;
  const measurementUnit = lengthUnitLabel(displaySettings.units);

  function addMeasurementQuick() {
    const waistDisplay = Number(window.prompt(`Waist (${measurementUnit}):`, ""));
    if (!Number.isFinite(waistDisplay) || waistDisplay <= 0) return;
    const chestDisplay = Number(window.prompt(`Chest (${measurementUnit}, optional):`, ""));
    const armDisplay = Number(window.prompt(`Arm (${measurementUnit}, optional):`, ""));
    setMeasurements((current) => [...current, {
      date: getTodayDateInput(),
      waist: displayToCm(waistDisplay, displaySettings.units),
      chest: Number.isFinite(chestDisplay) && chestDisplay > 0 ? displayToCm(chestDisplay, displaySettings.units) : undefined,
      arm: Number.isFinite(armDisplay) && armDisplay > 0 ? displayToCm(armDisplay, displaySettings.units) : undefined,
    }]);
  }

  function addWeight() {
    const numericWeight = Number(weight);

    if (
      !Number.isFinite(numericWeight) ||
      numericWeight <= 0 ||
      !weightDate
    ) {
      return;
    }

    const newEntry: WeightEntry = {
      id: Date.now(),
      date: weightDate,
      weight: round1(displayToKg(numericWeight, displaySettings.units)),
    };

    setWeightEntries((current) => [
      ...current,
      newEntry,
    ]);

    setWeight("");
  }

  function deleteWeight(id: number) {
    setWeightEntries((current) =>
      current.filter(
        (entry) => entry.id !== id
      )
    );
  }

  return (
    <>
      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Progress 2.0</p>
            <h2 className="mt-1 text-2xl font-black">Your performance</h2>
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1">
            {([7,30,90,365,0] as const).map((days) => (
              <button key={days} onClick={() => setProgressRange(days)} className={`rounded-lg px-3 py-2 text-xs font-bold ${progressRange===days ? "bg-white shadow-sm" : "text-slate-500"}`}>
                {days === 0 ? "All" : days === 365 ? "1Y" : `${days}D`}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <ProgressMini label="Weight entries" value={sortedWeightEntries.filter((e)=>progressRange===0 || Date.now()-getWeightEntryTime(e)<=progressRange*86400000).length} />
          <ProgressMini label="Workouts" value={trainingHistory.filter((w)=>inProgressRange(w.finishedAt)).length} />
          <ProgressMini label="Volume" value={formatWeight(trainingHistory.filter((w)=>inProgressRange(w.finishedAt)).reduce((sum,w)=>sum+w.exercises.reduce((es,e)=>es+e.sets.reduce((ss,set)=>ss+(set.weight||0)*(set.reps||0),0),0),0), displaySettings.units, 0)} />
          <ProgressMini label="Measurements" value={measurements.length} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={()=>setActiveProgressTab("weight")} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:border-blue-300 hover:bg-blue-50">+ Log weight</button>
          <button onClick={()=>setActiveProgressTab("body")} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:border-blue-300 hover:bg-blue-50">Body check-in</button>
        </div>
      </section>

      <p className="text-sm font-semibold tracking-widest text-blue-600">
        PROGRESS
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        Your progress
      </h1>

      <p className="mt-2 text-slate-600">
        Track body weight, strength progress and
        personal records.
      </p>

      <div className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2">
        <ProgressTabButton name="Overview" active={activeProgressTab === "overview"} onClick={() => setActiveProgressTab("overview")} />
        <ProgressTabButton name="Body" active={activeProgressTab === "body"} onClick={() => setActiveProgressTab("body")} />
        <ProgressTabButton name="Body Weight" active={activeProgressTab === "weight"} onClick={() => setActiveProgressTab("weight")} />
        <ProgressTabButton name="Strength" active={activeProgressTab === "strength"} onClick={() => setActiveProgressTab("strength")} />
        <ProgressTabButton name="Personal Records" active={activeProgressTab === "records"} onClick={() => setActiveProgressTab("records")} />
      </div>

      {activeProgressTab === "overview" && (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">Progress overview</p>
            <h2 className="mt-2 text-2xl font-black">Your trend, not one data point</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <ProgressMini label="Weight logs" value={sortedWeightEntries.length} />
              <ProgressMini label="Workouts" value={trainingHistory.length} />
              <ProgressMini label="Measurements" value={measurements.length} />
              <ProgressMini label="Photos" value={progressPhotos.length} />
            </div>
            <button onClick={()=>setActiveProgressTab("weight")} className="mt-5 rounded-xl bg-blue-500 px-5 py-3 text-sm font-black text-white">Open weight trend →</button>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-slate-600">Latest check-in</p>
            <p className="mt-3 text-3xl font-black">{sortedWeightEntries.at(-1) ? formatWeight(sortedWeightEntries.at(-1)!.weight, displaySettings.units) : "—"}</p>
            <p className="mt-2 text-sm text-slate-500">Use 7 / 30 / 90 day views to judge the direction instead of daily noise.</p>
          </section>
        </div>
      )}

      {activeProgressTab === "body" && (
        <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">Body measurements</p>
            <h2 className="mt-2 text-2xl font-black">Check-in</h2>
            <button onClick={addMeasurementQuick} className="mt-5 w-full rounded-xl bg-blue-500 py-3 text-sm font-black text-white">+ Add measurements</button>
            <div className="mt-5 space-y-2">{measurements.slice(-4).reverse().map((m,i)=><div key={`${m.date}-${i}`} className="rounded-2xl bg-slate-50 p-3 text-sm"><p className="font-black">{m.date}</p><p className="mt-1 text-slate-500">Waist {m.waist ? formatLength(m.waist, displaySettings.units) : "—"} · Chest {m.chest ? formatLength(m.chest, displaySettings.units) : "—"} · Arm {m.arm ? formatLength(m.arm, displaySettings.units) : "—"}</p></div>)}</div>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-slate-600">Progress photos</p><h2 className="mt-2 text-2xl font-black">Visual timeline</h2></div><label className="cursor-pointer rounded-xl bg-blue-500 px-4 py-3 text-sm font-black text-white">+ Photo<input type="file" accept="image/*" className="hidden" onChange={e=>{void addProgressPhoto(e.target.files?.[0]); e.currentTarget.value="";}}/></label></div>
            {progressPhotos.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{progressPhotos.slice().reverse().map(photo=><div key={photo.id} className="overflow-hidden rounded-2xl bg-slate-100"><img src={photo.dataUrl} alt="Progress" className="aspect-[3/4] w-full object-cover"/><div className="flex items-center justify-between gap-2 p-2"><p className="text-xs font-bold text-slate-500">{photo.date}</p><button type="button" onClick={()=>setProgressPhotos(current=>current.filter(item=>item.id!==photo.id))} className="text-xs font-bold text-red-500">Delete</button></div></div>)}</div> : <div className="mt-5 rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">No progress photos yet.</div>}
          </section>
        </div>
      )}

      {activeProgressTab === "weight" && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ProgressStatCard
              label="Current weight"
              value={
                latest
                  ? formatWeight(latest.weight, displaySettings.units)
                  : "—"
              }
              detail={
                latest
                  ? formatProgressDate(
                      latest.date
                    )
                  : "No measurements yet"
              }
            />

            <ProgressStatCard
              label="Total change"
              value={
                sortedWeightEntries.length >= 2
                  ? signedWeight(change)
                  : "—"
              }
              detail={
                first
                  ? `Since ${formatProgressDate(
                      first.date
                    )}`
                  : "Add at least 2 measurements"
              }
            />

            <ProgressStatCard
              label="Last change"
              value={
                recentChange !== null
                  ? signedWeight(recentChange)
                  : "—"
              }
              detail="Compared with previous entry"
            />
          </div>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  Weight trend
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your measurements over time.
                </p>
              </div>

              <p className="text-sm text-slate-500">
                {sortedWeightEntries.length}{" "}
                {sortedWeightEntries.length === 1
                  ? "measurement"
                  : "measurements"}
              </p>
            </div>

            <div className="mt-6">
              <LineChart
                points={sortedWeightEntries.map(
                  (entry) => ({
                    id: String(entry.id),
                    value: displayWeightValue(entry.weight),
                    label: formatShortDate(
                      entry.date
                    ),
                  })
                )}
                unit={weightUnitLabel(displaySettings.units)}
                emptyText="Add your first weight measurement to start the graph."
              />
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7">
            <h2 className="text-2xl font-semibold">
              Log weight
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add today&apos;s weight or enter a
              previous measurement.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_auto]">
              <div>
                <label className="mb-2 block text-sm text-slate-600">
                  Weight
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={weight}
                    onChange={(event) =>
                      setWeight(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter"
                      ) {
                        addWeight();
                      }
                    }}
                    placeholder={displaySettings.units === "imperial" ? "194.0" : "88.0"}
                    className="w-full bg-transparent p-4 outline-none"
                  />

                  <span className="pr-4 text-slate-500">
                    {weightUnitLabel(displaySettings.units)}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-600">
                  Date
                </label>

                <input
                  type="date"
                  value={weightDate}
                  onChange={(event) =>
                    setWeightDate(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={addWeight}
                className="self-end rounded-xl bg-blue-500 px-7 py-4 font-semibold text-white transition hover:bg-blue-400"
              >
                Add
              </button>
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7">
            <h2 className="text-2xl font-semibold">
              Weight history
            </h2>

            {sortedWeightEntries.length === 0 ? (
              <p className="mt-5 text-slate-500">
                No measurements yet.
              </p>
            ) : (
              <div className="mt-6 space-y-3">
                {[...sortedWeightEntries]
                  .reverse()
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div>
                        <p className="font-semibold">
                          {formatWeight(entry.weight, displaySettings.units)}
                        </p>

                        <p className="text-sm text-slate-500">
                          {formatProgressDate(
                            entry.date
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          deleteWeight(entry.id)
                        }
                        className="text-sm text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </>
      )}

      {activeProgressTab === "strength" && (
        <>
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <h2 className="text-2xl font-semibold">
                  Strength progress
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Built automatically from your
                  finished workouts.
                </p>
              </div>

              {exerciseOptions.length > 0 && (
                <select
                  value={selectedExerciseId}
                  onChange={(event) =>
                    setSelectedExerciseId(
                      event.target.value
                    )
                  }
                  className="min-w-64 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-blue-500"
                >
                  {exerciseOptions.map(
                    (exercise) => (
                      <option
                        key={exercise.id}
                        value={exercise.id}
                      >
                        {exercise.name}
                      </option>
                    )
                  )}
                </select>
              )}
            </div>

            {exerciseOptions.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
                Finish a workout with logged sets
                first. CYG will use your
                workout history automatically.
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <ProgressStatCard
                    label="Latest best set"
                    value={
                      strengthData.length > 0
                        ? `${formatWeight(
                            strengthData[strengthData.length - 1].weight,
                            displaySettings.units
                          )} × ${strengthData[strengthData.length - 1].reps}`
                        : "—"
                    }
                    detail="Best set from latest session"
                  />

                  <ProgressStatCard
                    label="Estimated 1RM"
                    value={
                      strengthData.length > 0
                        ? formatEstimated1RM(
                            strengthData[strengthData.length - 1].estimated1RM,
                            displaySettings.units
                          )
                        : "—"
                    }
                    detail="Estimate from weight and reps"
                  />

                  <ProgressStatCard
                    label="Sessions"
                    value={String(
                      strengthData.length
                    )}
                    detail="Sessions with valid sets"
                  />
                </div>

                <div className="mt-6">
                  <LineChart
                    points={strengthData.map(
                      (entry) => ({
                        id: entry.id,
                        value: roundEstimated1RM(entry.estimated1RM, displaySettings.units),
                        label: formatShortDate(
                          entry.date
                        ),
                      })
                    )}
                    unit={`${weightUnitLabel(displaySettings.units)} e1RM`}
                    emptyText="No valid sets for this exercise yet."
                  />
                </div>

                {strengthData.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {[...strengthData]
                      .reverse()
                      .map((entry) => (
                        <div
                          key={`${entry.id}-${entry.date}`}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                          <span className="text-sm text-slate-500">
                            {formatProgressDate(
                              entry.date
                            )}
                          </span>

                          <span className="font-semibold">
                            {formatWeight(entry.weight, displaySettings.units)} × {entry.reps}
                            <span className="ml-3 text-sm font-normal text-slate-500">
                              ~{formatEstimated1RM(entry.estimated1RM, displaySettings.units)} e1RM
                            </span>
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </section>
        </>
      )}

      {activeProgressTab === "records" && (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7">
          <div>
            <h2 className="text-2xl font-semibold">
              Personal Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Best performance CYG can find
              in your workout history.
            </p>
          </div>

          {personalRecords.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
              No PRs yet. Finish workouts with
              weight and reps to build your
              records.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {personalRecords.map((record) => (
                <div
                  key={record.exerciseId}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold tracking-wider text-blue-600">
                        PR
                      </p>

                      <h3 className="mt-1 text-lg font-semibold">
                        {record.exerciseName}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-500">
                      {formatProgressDate(
                        record.date
                      )}
                    </p>
                  </div>

                  <p className="mt-5 text-3xl font-bold">
                    {formatWeight(record.weight, displaySettings.units)} × {record.reps}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Estimated 1RM:{" "}
                    {formatEstimated1RM(record.estimated1RM, displaySettings.units)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}

function ProgressMini({label,value}:{label:string;value:string|number}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function ProgressTabButton({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-blue-500 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {name}
    </button>
  );
}

function ProgressStatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {detail}
      </p>
    </section>
  );
}

function LineChart({
  points,
  unit,
  emptyText,
}: {
  points: {
    id: string;
    value: number;
    label: string;
  }[];
  unit: string;
  emptyText: string;
}) {
  if (points.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
        {emptyText}
      </div>
    );
  }

  if (points.length === 1) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex min-h-52 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-4 w-4 rounded-full bg-blue-500" />

            <p className="mt-3 text-3xl font-bold">
              {round1(points[0].value)}{" "}
              {unit}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {points[0].label}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const width = 800;
  const height = 260;
  const paddingX = 44;
  const paddingY = 30;

  const values = points.map(
    (point) => point.value
  );

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const spread = Math.max(
    maxValue - minValue,
    1
  );

  const graphMin =
    minValue - spread * 0.15;

  const graphMax =
    maxValue + spread * 0.15;

  const xFor = (index: number) =>
    paddingX +
    (index /
      Math.max(points.length - 1, 1)) *
      (width - paddingX * 2);

  const yFor = (value: number) =>
    paddingY +
    ((graphMax - value) /
      (graphMax - graphMin)) *
      (height - paddingY * 2);

  const polyline = points
    .map(
      (point, index) =>
        `${xFor(index)},${yFor(
          point.value
        )}`
    )
    .join(" ");

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-72 min-w-[680px] w-full"
          role="img"
          aria-label="Progress chart"
        >
          {[0, 1, 2, 3, 4].map(
            (line) => {
              const y =
                paddingY +
                (line / 4) *
                  (height - paddingY * 2);

              return (
                <line
                  key={line}
                  x1={paddingX}
                  x2={width - paddingX}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  className="text-zinc-800"
                  strokeWidth="1"
                />
              );
            }
          )}

          <polyline
            points={polyline}
            fill="none"
            stroke="currentColor"
            className="text-blue-600"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <g key={point.id}>
              <circle
                cx={xFor(index)}
                cy={yFor(point.value)}
                r="6"
                fill="currentColor"
                className="text-blue-600"
              />

              <text
                x={xFor(index)}
                y={yFor(point.value) - 14}
                textAnchor="middle"
                fill="currentColor"
                className="text-xs text-slate-700"
              >
                {round1(point.value)}
              </text>

              {(points.length <= 8 ||
                index === 0 ||
                index ===
                  points.length - 1) && (
                <text
                  x={xFor(index)}
                  y={height - 7}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-xs text-slate-500"
                >
                  {point.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <p className="mt-1 text-right text-xs text-slate-600">
        {unit}
      </p>
    </div>
  );
}

function readMucipesDisplaySettings() {
  const defaults = {
    units: "metric" as const,
    weekStarts: "monday" as const,
    appearance: "light" as const,
    energyUnit: "kcal" as const,
    density: "comfortable" as const,
    showRir: true,
    restTimer: true,
    restSeconds: 120,
  };
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem("bodypilot-settings");
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      ...defaults,
      units: parsed.units === "imperial" ? "imperial" as const : "metric" as const,
      weekStarts: parsed.weekStarts === "sunday" ? "sunday" as const : "monday" as const,
      appearance: parsed.appearance === "dark" ? "dark" as const : parsed.appearance === "system" ? "system" as const : "light" as const,
      energyUnit: parsed.energyUnit === "kj" ? "kj" as const : "kcal" as const,
      density: parsed.density === "compact" ? "compact" as const : "comfortable" as const,
      showRir: parsed.showRir !== false,
      restTimer: parsed.restTimer !== false,
      restSeconds: typeof parsed.restSeconds === "number" && parsed.restSeconds >= 15 ? Math.round(parsed.restSeconds) : 120,
    };
  } catch {
    return defaults;
  }
}

function energyDisplay(kcal: number, unit: "kcal" | "kj") {
  return unit === "kj" ? Math.round(kcal * 4.184) : Math.round(kcal);
}

async function compressProgressPhoto(file: File) {
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read photo"));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read photo"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode photo"));
    img.src = raw;
  });

  const maxSide = 1000;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return raw;
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

function getTodayDateInput() {
  return formatLocalDateKey(new Date());
}

function formatLocalDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function normalizeDateKey(value: unknown) {
  if (typeof value !== "string") return null;
  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : null;
}

function parseFoodList(raw: string | null): Food[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isFood) : [];
  } catch {
    return [];
  }
}

function parseFoodDiaryHistory(raw: string | null): FoodDiaryDay[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((day) => ({
        date: normalizeDateKey(day?.date) || "",
        foods: Array.isArray(day?.foods) ? day.foods.filter(isFood) : [],
      }))
      .filter((day) => day.date)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

function migrateLegacyFoodsIntoDiary(
  history: FoodDiaryDay[],
  legacyFoods: Food[],
  legacyDate: string
) {
  if (legacyFoods.length === 0) return history;

  const existing = history.find((day) => day.date === legacyDate);
  if (existing && existing.foods.length > 0) return history;

  return [
    ...history.filter((day) => day.date !== legacyDate),
    { date: legacyDate, foods: legacyFoods },
  ].sort((a, b) => a.date.localeCompare(b.date));
}

function isFood(value: unknown): value is Food {
  if (!value || typeof value !== "object") return false;
  const food = value as Partial<Food>;
  return (
    typeof food.id === "number" &&
    typeof food.name === "string" &&
    typeof food.calories === "number" &&
    typeof food.protein === "number" &&
    typeof food.carbs === "number" &&
    typeof food.fat === "number"
  );
}

function getWeightEntryTime(
  entry: WeightEntry
) {
  const parsed = new Date(
    entry.date
  ).getTime();

  return Number.isNaN(parsed)
    ? entry.id
    : parsed;
}

function formatProgressDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatShortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
    }
  );
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}



function AppNavButton({
  label,
  page,
  activePage,
  setActivePage,
}: {
  label: string;
  page: Page;
  activePage: Page;
  setActivePage: React.Dispatch<React.SetStateAction<Page>>;
}) {
  const active =
    activePage === page ||
    (page === "profile" && activePage === "progress");

  return (
    <button
      onClick={() => setActivePage(page)}
      className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-500 hover:text-slate-950"
      }`}
    >
      {label}
    </button>
  );
}

function MobileNavButton({
  icon,
  label,
  page,
  activePage,
  setActivePage,
}: {
  icon: string;
  label: string;
  page: Page;
  activePage: Page;
  setActivePage: React.Dispatch<React.SetStateAction<Page>>;
}) {
  const active =
    activePage === page ||
    (page === "profile" && activePage === "progress");

  return (
    <button
      onClick={() => setActivePage(page)}
      className={`min-w-0 flex-1 rounded-xl px-1 py-2 text-center transition ${
        active ? "text-blue-600" : "text-slate-600"
      }`}
    >
      <span className="block text-lg font-black leading-5">{icon}</span>
      <span className="mt-1 block text-[10px] font-bold">{label}</span>
    </button>
  );
}

function NavButton({
  name,
  page,
  activePage,
  setActivePage,
}: {
  name: string;
  page: Page;
  activePage: Page;
  setActivePage: (
    page: Page
  ) => void;
}) {
  return (
    <button
      onClick={() =>
        setActivePage(page)
      }
      className={
        activePage === page
          ? "text-slate-950"
          : "text-slate-500 transition hover:text-slate-950"
      }
    >
      {name}
    </button>
  );
}

function MacroCard({
  name,
  eaten,
  goal,
}: {
  name: string;
  eaten: number;
  goal: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-slate-600">
        {name}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {Math.round(
          eaten * 10
        ) / 10}
        g

        <span className="text-base text-slate-500">
          {" "}
          / {goal}g
        </span>
      </p>

      <ProgressBar
        value={eaten}
        goal={goal}
      />
    </div>
  );
}

function ProgressBar({
  value,
  goal,
}: {
  value: number;
  goal: number;
}) {
  const percentage =
    goal > 0
      ? Math.min(
          (value / goal) *
            100,
          100
        )
      : 0;

  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-blue-500 transition-all"
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
}

function RemainingCard({
  name,
  value,
  unit,
}: {
  name: string;
  value: number;
  unit: string;
}) {
  const roundedValue =
    Math.round(
      value * 10
    ) / 10;

  return (
    <div>
      <p className="text-sm text-slate-500">
        {name}
      </p>

      <p
        className={`mt-1 text-2xl font-bold ${
          value < 0
            ? "text-red-400"
            : "text-slate-950"
        }`}
      >
        {roundedValue}{" "}
        {unit}
      </p>
    </div>
  );
}

function NumberInput({
  label,
  value,
  setValue,
  unit,
}: {
  label: string;
  value: string;
  setValue: (
    value: string
  ) => void;
  unit: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-600">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50">
        <input
          type="number"
          value={value}
          onChange={(
            event
          ) =>
            setValue(
              event.target
                .value
            )
          }
          className="w-full bg-transparent p-4 outline-none"
        />

        <span className="pr-4 text-slate-500">
          {unit}
        </span>
      </div>
    </div>
  );
}
