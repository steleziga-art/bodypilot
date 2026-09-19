"use client";

import { useEffect, useMemo, useState } from "react";
import FoodDiary from "@/components/FoodDiary";
import FoodSearch from "@/components/FoodSearch";
import MealOptimizer from "@/components/MealOptimizer";
import Training from "@/components/training/Training";

type Page =
  | "dashboard"
  | "nutrition"
  | "training"
  | "progress"
  | "plan"
  | "profile";

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

type Goals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type AppMode = "guided" | "self-managed";

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
  const [activePage, setActivePage] =
    useState<Page>("dashboard");

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

  const [dashboardTrainingHistory, setDashboardTrainingHistory] =
    useState<TrainingHistoryEntry[]>([]);

  const [loaded, setLoaded] =
    useState(false);

  const [showOnboarding, setShowOnboarding] =
    useState(false);

  const [appMode, setAppMode] =
    useState<AppMode>("guided");

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

      const savedAppMode =
        localStorage.getItem("bodypilot-app-mode");

      if (savedAppMode === "guided" || savedAppMode === "self-managed") {
        setAppMode(savedAppMode);
      }

      if (savedFoods) {
        const parsedFoods =
          JSON.parse(savedFoods);

        if (Array.isArray(parsedFoods)) {
          setFoods(parsedFoods);
        }
      }

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
        "Could not load BodyPilot data:",
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

  }, [
    foods,
    meals,
    goals,
    weightEntries,
    loaded,
  ]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      "bodypilot-profile",
      JSON.stringify(bodyProfile)
    );
  }, [bodyProfile, loaded]);

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

    const today = getTodayDateInput();

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
        .slice(-120);

      localStorage.setItem(
        "bodypilot-nutrition-history",
        JSON.stringify(next)
      );

      return next;
    });
  }, [
    loaded,
    caloriesEaten,
    proteinEaten,
    carbsEaten,
    fatEaten,
  ]);

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
    <main className="min-h-screen bg-[#f7f9f8] text-slate-950">
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
            setShowOnboarding(false);
            setActivePage(mode === "guided" ? "plan" : "dashboard");
          }}
        />
      )}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
          <button
            onClick={() =>
              setActivePage(
                "dashboard"
              )
            }
            className="text-2xl font-bold tracking-tight"
          >
            BodyPilot
          </button>

          <div className="flex max-w-[70vw] gap-2 overflow-x-auto text-sm sm:max-w-none sm:gap-6">
            <NavButton
              name="Dashboard"
              page="dashboard"
              activePage={
                activePage
              }
              setActivePage={
                setActivePage
              }
            />

            <NavButton
              name="Nutrition"
              page="nutrition"
              activePage={
                activePage
              }
              setActivePage={
                setActivePage
              }
            />

            <NavButton
              name="Training"
              page="training"
              activePage={
                activePage
              }
              setActivePage={
                setActivePage
              }
            />

            {appMode === "guided" && (
              <NavButton
                name="Get Fit Plan"
                page="plan"
                activePage={activePage}
                setActivePage={setActivePage}
              />
            )}

            <NavButton
              name="Progress"
              page="progress"
              activePage={
                activePage
              }
              setActivePage={
                setActivePage
              }
            />

            <NavButton
              name="Profile"
              page="profile"
              activePage={activePage}
              setActivePage={setActivePage}
            />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
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
            setActivePage={
              setActivePage
            }
          />
        )}

        {activePage ===
          "nutrition" && (
          <Nutrition
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
          />
        )}

        {activePage === "profile" && (
          <ProfilePage
            profile={bodyProfile}
            setProfile={setBodyProfile}
            appMode={appMode}
            setAppMode={setAppMode}
          />
        )}
      </div>
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
              Welcome to BodyPilot
            </p>
            <h1 className="mt-2 text-3xl font-black">
              {step === -1 ? "How do you want to use BodyPilot?" : "Build your starting plan"}
            </h1>
          </div>
          <span className="text-sm text-slate-500">
            {step === -1 ? "Start" : `${step + 1}/${steps.length}`}
          </span>
        </div>

        {step >= 0 && (
        <div className="mt-6 flex gap-2">
          {steps.map((name, index) => (
            <div key={name} className="flex-1">
              <div
                className={`h-1.5 rounded-full ${
                  index <= step
                    ? "bg-emerald-500"
                    : "bg-slate-100"
                }`}
              />
              <p className="mt-2 hidden text-xs text-slate-400 sm:block">
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
              className="rounded-3xl border border-emerald-500 bg-emerald-500/10 p-6 text-left transition hover:bg-emerald-500/15"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Guided</p>
              <h2 className="mt-3 text-2xl font-black">BodyPilot guides me</h2>
              <p className="mt-3 leading-6 text-slate-600">BodyPilot builds your nutrition, training and cardio plan from your goals and progress, then helps you adjust it over time.</p>
              <p className="mt-5 font-semibold text-emerald-600">Create my plan →</p>
            </button>

            <button
              onClick={() => onComplete("self-managed")}
              className="rounded-3xl border border-slate-200 bg-white p-6 text-left transition hover:border-slate-400"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Experienced</p>
              <h2 className="mt-3 text-2xl font-black">I’ll manage it myself</h2>
              <p className="mt-3 leading-6 text-slate-600">Use BodyPilot as your tracker. Set your own targets, build your own workouts and log nutrition, weight and progress yourself.</p>
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
                      ? "border-emerald-500 bg-emerald-500/10"
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
              className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-black hover:bg-emerald-400"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={finish}
              className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-black hover:bg-emerald-400"
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


function ProfilePage({
  profile,
  setProfile,
  appMode,
  setAppMode,
}: {
  profile: BodyProfile;
  setProfile: React.Dispatch<React.SetStateAction<BodyProfile>>;
  appMode: AppMode;
  setAppMode: React.Dispatch<React.SetStateAction<AppMode>>;
}) {
  type ProfileTab = "profile" | "preferences" | "settings";
  type Settings = {
    units: "metric" | "imperial";
    weekStarts: "monday" | "sunday";
    showRir: boolean;
    restTimer: boolean;
    restSeconds: number;
    workoutReminder: boolean;
    weighInReminder: boolean;
    mealReminder: boolean;
  };

  const defaultSettings: Settings = {
    units: "metric",
    weekStarts: "monday",
    showRir: true,
    restTimer: true,
    restSeconds: 120,
    workoutReminder: false,
    weighInReminder: false,
    mealReminder: false,
  };

  const [tab, setTab] = useState<ProfileTab>("profile");
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
    localStorage.setItem("bodypilot-settings", JSON.stringify(settings));
  }, [settings]);

  function update<K extends keyof BodyProfile>(key: K, value: BodyProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function changeMode(mode: AppMode) {
    setAppMode(mode);
    localStorage.setItem("bodypilot-app-mode", mode);
  }

  function toggle(key: keyof Settings) {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  }

  const goalLabel = profile.goal === "lose" ? "Lose fat" : profile.goal === "gain" ? "Build muscle" : "Maintain";

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold tracking-widest text-emerald-600">PROFILE</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Your BodyPilot</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Manage your profile, preferences and app settings in one place.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-700">BP</div>
          <div><p className="font-bold">BodyPilot profile</p><p className="text-xs text-slate-500">{goalLabel} · {profile.trainingDays} days/week</p></div>
        </div>
      </div>

      <div className="mt-8 inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
        {([['profile','Profile'],['preferences','Preferences'],['settings','Settings']] as const).map(([value,label]) => (
          <button key={value} onClick={() => setTab(value)} className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${tab === value ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>{label}</button>
        ))}
      </div>

      {tab === "profile" && (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Personal details</p>
          <h2 className="mt-2 text-2xl font-bold">Body & goal</h2>
          <p className="mt-2 text-sm text-slate-500">Saved automatically and used by your BodyPilot plan.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PlanSelect label="Sex" value={profile.sex} onChange={(v) => update("sex", v as Sex)} options={[["male","Male"],["female","Female"]]} />
            <PlanNumber label="Age" value={profile.age} unit="years" min={18} max={100} step={1} onChange={(v) => update("age",v)} />
            <PlanNumber label="Height" value={profile.height} unit="cm" min={120} max={230} step={1} onChange={(v) => update("height",v)} />
            <PlanNumber label="Current weight" value={profile.weight} unit="kg" min={35} max={300} step={0.1} onChange={(v) => update("weight",v)} />
            <PlanNumber label="Target weight" value={profile.targetWeight} unit="kg" min={35} max={300} step={0.1} onChange={(v) => update("targetWeight",v)} />
            <PlanSelect label="Goal" value={profile.goal} onChange={(v) => update("goal",v as FitnessGoal)} options={[["lose","Lose fat"],["maintain","Maintain"],["gain","Build muscle"]]} />
            <PlanSelect label="Activity" value={profile.activity} onChange={(v) => update("activity",v as ActivityLevel)} options={[["sedentary","Sedentary"],["light","Lightly active"],["moderate","Moderately active"],["very","Very active"],["athlete","Athlete / highly active"]]} />
          </div>
        </section>
      )}

      {tab === "preferences" && (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Preferences</p>
          <h2 className="mt-2 text-2xl font-bold">Training & cardio</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PlanSelect label="Training days" value={String(profile.trainingDays)} onChange={(v) => update("trainingDays",Number(v))} options={[["2","2 days / week"],["3","3 days / week"],["4","4 days / week"],["5","5 days / week"],["6","6 days / week"]]} />
            <PlanSelect label="Experience" value={profile.experience} onChange={(v) => update("experience",v as BodyProfile["experience"])} options={[["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]]} />
            <PlanSelect label="Equipment" value={profile.equipment} onChange={(v) => update("equipment",v as BodyProfile["equipment"])} options={[["full-gym","Full gym"],["home","Home gym / dumbbells"],["bodyweight","Bodyweight only"]]} />
            <PlanSelect label="Cardio goal" value={profile.cardioGoal} onChange={(v) => update("cardioGoal",v as BodyProfile["cardioGoal"])} options={[["none","No planned cardio"],["health","General health"],["fat-loss","Fat loss support"],["endurance","Improve endurance"],["performance","Sport performance"]]} />
            {profile.cardioGoal !== "none" && <>
              <PlanSelect label="Cardio days" value={String(profile.cardioDays)} onChange={(v) => update("cardioDays",Number(v))} options={[["1","1 day / week"],["2","2 days / week"],["3","3 days / week"],["4","4 days / week"],["5","5 days / week"]]} />
              <PlanSelect label="Preferred cardio" value={profile.cardioType} onChange={(v) => update("cardioType",v as BodyProfile["cardioType"])} options={[["walking","Walking"],["running","Running"],["cycling","Cycling"],["incline-walk","Incline treadmill"],["stairmaster","Stairmaster"],["rowing","Rowing"]]} />
            </>}
          </div>
        </section>
      )}

      {tab === "settings" && <div className="mt-6 space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">General</p>
          <h2 className="mt-2 text-2xl font-bold">App settings</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PlanSelect label="Units" value={settings.units} onChange={(v) => setSettings(c => ({...c, units:v as Settings['units']}))} options={[["metric","Metric (kg, cm)"],["imperial","Imperial (lb, ft/in)"]]} />
            <PlanSelect label="Week starts on" value={settings.weekStarts} onChange={(v) => setSettings(c => ({...c, weekStarts:v as Settings['weekStarts']}))} options={[["monday","Monday"],["sunday","Sunday"]]} />
          </div>
          <p className="mt-4 text-xs text-slate-400">Your preferences are saved automatically on this device.</p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Mode</p>
          <h2 className="mt-2 text-2xl font-bold">How BodyPilot works for you</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[['guided','BodyPilot guides me','Personalized plan and guidance.'],['self-managed','I’ll manage it myself','Use BodyPilot mainly as a powerful tracker.']].map(([mode,title,detail]) => <button key={mode} onClick={() => changeMode(mode as AppMode)} className={`rounded-2xl border p-5 text-left transition ${appMode === mode ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}><p className="font-bold">{title}</p><p className="mt-2 text-sm text-slate-500">{detail}</p></button>)}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Training</p>
          <h2 className="mt-2 text-2xl font-bold">Workout settings</h2>
          <div className="mt-5 divide-y divide-slate-100">
            <SettingToggle title="Show RIR" detail="Show reps in reserve when logging sets." enabled={settings.showRir} onClick={() => toggle('showRir')} />
            <SettingToggle title="Rest timer" detail="Use a rest timer between working sets." enabled={settings.restTimer} onClick={() => toggle('restTimer')} />
            {settings.restTimer && <div className="flex items-center justify-between gap-4 py-4"><div><p className="font-semibold">Default rest time</p><p className="text-sm text-slate-500">Default timer after a completed set.</p></div><select value={settings.restSeconds} onChange={(e) => setSettings(c => ({...c,restSeconds:Number(e.target.value)}))} className="rounded-xl border border-slate-300 bg-white px-4 py-3"><option value={60}>1:00</option><option value={90}>1:30</option><option value={120}>2:00</option><option value={180}>3:00</option><option value={240}>4:00</option></select></div>}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Reminders</p>
          <h2 className="mt-2 text-2xl font-bold">Notifications</h2>
          <p className="mt-2 text-sm text-slate-500">Choose which reminders you want. Browser push delivery will be connected later.</p>
          <div className="mt-5 divide-y divide-slate-100">
            <SettingToggle title="Workout reminders" detail="Remind me about planned workouts." enabled={settings.workoutReminder} onClick={() => toggle('workoutReminder')} />
            <SettingToggle title="Weigh-in reminder" detail="Remind me to log body weight." enabled={settings.weighInReminder} onClick={() => toggle('weighInReminder')} />
            <SettingToggle title="Meal logging reminder" detail="Remind me when nutrition has not been logged." enabled={settings.mealReminder} onClick={() => toggle('mealReminder')} />
          </div>
        </section>

      </div>}
    </>
  );
}

function SettingToggle({ title, detail, enabled, onClick }: { title: string; detail: string; enabled: boolean; onClick: () => void }) {
  return <div className="flex items-center justify-between gap-5 py-4"><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-slate-500">{detail}</p></div><button type="button" onClick={onClick} aria-pressed={enabled} className={`relative h-7 w-12 shrink-0 rounded-full transition ${enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${enabled ? 'left-6' : 'left-1'}`} /></button></div>;
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
  setActivePage: (page: Page) => void;
}) {
  const sortedWeights = [...weightEntries].sort(
    (a, b) => getWeightEntryTime(a) - getWeightEntryTime(b)
  );

  const latestWeight =
    sortedWeights.length > 0
      ? sortedWeights[sortedWeights.length - 1]
      : null;

  const previousWeight =
    sortedWeights.length > 1
      ? sortedWeights[sortedWeights.length - 2]
      : null;

  const weightChange =
    latestWeight && previousWeight
      ? round1(latestWeight.weight - previousWeight.weight)
      : null;

  const safeTrainingHistory = Array.isArray(trainingHistory)
    ? trainingHistory
    : [];

  const latestWorkout = [...safeTrainingHistory].sort(
    (a, b) =>
      new Date(b.finishedAt).getTime() -
      new Date(a.finishedAt).getTime()
  )[0];

  const totalCompletedSets = safeTrainingHistory.reduce(
    (total, workout) =>
      total +
      workout.exercises.reduce(
        (exerciseTotal, exercise) =>
          exerciseTotal +
          exercise.sets.filter(
            (set) =>
              set.completed ||
              set.weight > 0 ||
              set.reps > 0
          ).length,
        0
      ),
    0
  );

  const progressionSuggestion = useMemo(() => {
    const sessions = [...safeTrainingHistory]
      .sort(
        (a, b) =>
          new Date(b.finishedAt).getTime() -
          new Date(a.finishedAt).getTime()
      );

    for (const workout of sessions) {
      for (const exercise of workout.exercises) {
        const bestSet = exercise.sets
          .filter(
            (set) =>
              (set.completed || set.reps > 0) &&
              set.weight > 0 &&
              set.reps > 0
          )
          .sort(
            (a, b) =>
              b.weight * b.reps - a.weight * a.reps
          )[0];

        if (bestSet) {
          const nextReps =
            bestSet.reps >= 12
              ? bestSet.reps
              : bestSet.reps + 1;

          const nextWeight =
            bestSet.reps >= 12
              ? round1(bestSet.weight + 2.5)
              : bestSet.weight;

          return {
            exercise: exercise.exerciseName,
            previous: `${bestSet.weight} kg × ${bestSet.reps}`,
            next: `${nextWeight} kg × ${nextReps}`,
          };
        }
      }
    }

    return null;
  }, [safeTrainingHistory]);

  const caloriePercent =
    goals.calories > 0
      ? Math.round((caloriesEaten / goals.calories) * 100)
      : 0;

  const proteinRemaining = Math.max(
    0,
    goals.protein - proteinEaten
  );

  const nutritionStatus =
    caloriesRemaining > 500
      ? "You still have room to build the rest of your day."
      : caloriesRemaining >= 0
        ? "You are close to today's calorie target."
        : "You are currently above today's calorie target.";

  const nextAction =
    caloriesRemaining > 0 && proteinRemaining > 0
      ? `Aim for roughly ${Math.round(
          caloriesRemaining
        )} kcal and ${Math.round(
          proteinRemaining
        )} g protein across your remaining meals.`
      : caloriesRemaining > 0
        ? `You have about ${Math.round(
            caloriesRemaining
          )} kcal remaining today.`
        : "Nutrition is logged for today. Focus on completing your training and recovery plan.";

  const dashboardTrainingPlan = useMemo(
    () => buildTrainingPlan(bodyProfile),
    [bodyProfile]
  );

  const dashboardWeeklySchedule = useMemo(
    () =>
      buildWeeklySchedule(
        bodyProfile,
        dashboardTrainingPlan
      ),
    [bodyProfile, dashboardTrainingPlan]
  );

  const todayIndex = (new Date().getDay() + 6) % 7;
  const todayPlan =
    dashboardWeeklySchedule[todayIndex];

  const completedNutritionDays = nutritionHistory
    .filter((day) => day.date !== getTodayDateInput())
    .slice(-14);

  const adherenceDays = completedNutritionDays.filter(
    (day) =>
      goals.calories > 0 &&
      Math.abs(day.calories - goals.calories) <=
        goals.calories * 0.1
  ).length;

  const adherencePercent =
    completedNutritionDays.length > 0
      ? Math.round(
          (adherenceDays / completedNutritionDays.length) *
            100
        )
      : null;

  const dashboardAdaptive =
    calculateAdaptiveAdjustment(
      weightEntries,
      bodyProfile,
      goals
    );

  const planStatus = dashboardAdaptive.ready
    ? dashboardAdaptive.suggestedCalories !== null &&
      dashboardAdaptive.suggestedCalories !== goals.calories
      ? "Adjustment available"
      : "On track"
    : "Collecting data";

  return (
    <>
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Plan status
          </p>
          <p className="mt-2 text-xl font-bold">{planStatus}</p>
          <button
            onClick={() => setActivePage("plan")}
            className="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-500"
          >
            Open Get Fit Plan
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Nutrition adherence
          </p>
          <p className="mt-2 text-xl font-bold">
            {adherencePercent === null
              ? "Collecting data"
              : `${adherencePercent}%`}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Days within ±10% of calorie target
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Goal
          </p>
          <p className="mt-2 text-xl font-bold">
            {bodyProfile.goal === "lose"
              ? "Lose fat"
              : bodyProfile.goal === "gain"
                ? "Build muscle"
                : "Maintain"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Target weight: {bodyProfile.targetWeight} kg
          </p>
        </div>
      </section>

      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold tracking-widest text-emerald-600">
            BODYpilot TODAY
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Your plan for today
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            One view of what you have eaten, how training is going
            and what to focus on next.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            Daily completion
          </p>
          <p className="mt-1 text-2xl font-black">
            {Math.max(0, Math.min(caloriePercent, 100))}%
          </p>
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-white via-white to-emerald-50 p-7 sm:p-8">
        <div className="grid gap-7 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
              BodyPilot recommendation
            </p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {nutritionStatus}
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              {nextAction}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setActivePage("nutrition")}
                className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black transition hover:bg-emerald-400"
              >
                Open nutrition
              </button>

              <button
                onClick={() => setActivePage("training")}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold transition hover:border-slate-400 hover:bg-white"
              >
                Open training
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Calories remaining</p>
            <p
              className={`mt-2 text-5xl font-black ${
                caloriesRemaining >= 0
                  ? "text-slate-950"
                  : "text-red-400"
              }`}
            >
              {Math.abs(Math.round(caloriesRemaining))}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {caloriesRemaining >= 0
                ? "kcal left today"
                : "kcal over target"}
            </p>

            <ProgressBar
              value={caloriesEaten}
              goal={goals.calories}
            />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetric
          label="Calories"
          value={`${Math.round(caloriesEaten)}`}
          detail={`/ ${goals.calories} kcal`}
          progress={caloriesEaten}
          goal={goals.calories}
        />

        <DashboardMetric
          label="Protein"
          value={`${round1(proteinEaten)} g`}
          detail={`/ ${goals.protein} g`}
          progress={proteinEaten}
          goal={goals.protein}
        />

        <DashboardMetric
          label="Carbs"
          value={`${round1(carbsEaten)} g`}
          detail={`/ ${goals.carbs} g`}
          progress={carbsEaten}
          goal={goals.carbs}
        />

        <DashboardMetric
          label="Fat"
          value={`${round1(fatEaten)} g`}
          detail={`/ ${goals.fat} g`}
          progress={fatEaten}
          goal={goals.fat}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Training
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {latestWorkout
                  ? "Keep the momentum"
                  : "Ready for your first session"}
              </h2>
            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-2 text-right">
              <p className="text-lg font-bold">
                {safeTrainingHistory.length}
              </p>
              <p className="text-[11px] text-slate-500">
                workouts
              </p>
            </div>
          </div>

          {latestWorkout ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {latestWorkout.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Last workout ·{" "}
                    {formatProgressDate(latestWorkout.finishedAt)}
                  </p>
                </div>

                <p className="text-sm text-slate-600">
                  {latestWorkout.exercises.length} exercises
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-slate-600">
              Finished workouts will automatically appear here.
            </p>
          )}

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Logged sets
            </span>
            <span className="font-semibold">
              {totalCompletedSets}
            </span>
          </div>

          <button
            onClick={() => setActivePage("training")}
            className="mt-6 w-full rounded-xl bg-emerald-500 py-3 font-semibold text-black transition hover:bg-emerald-400"
          >
            Go to training
          </button>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Progress
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Body weight
              </h2>
            </div>

            <button
              onClick={() => setActivePage("progress")}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-500"
            >
              View progress
            </button>
          </div>

          {latestWeight ? (
            <>
              <p className="mt-7 text-5xl font-black">
                {latestWeight.weight}
                <span className="ml-2 text-xl font-semibold text-slate-500">
                  kg
                </span>
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <span className="rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
                  {formatProgressDate(latestWeight.date)}
                </span>

                {weightChange !== null && (
                  <span
                    className={`rounded-lg px-3 py-2 ${
                      weightChange === 0
                        ? "bg-slate-50 text-slate-600"
                        : "bg-slate-50 text-slate-950"
                    }`}
                  >
                    {weightChange > 0 ? "+" : ""}
                    {weightChange} kg since last entry
                  </span>
                )}
              </div>

              {sortedWeights.length >= 2 && (
                <div className="mt-6">
                  <MiniWeightTrend entries={sortedWeights.slice(-8)} />
                </div>
              )}
            </>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
              <p className="font-semibold">
                No weight logged yet
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Add your first measurement in Progress.
              </p>
            </div>
          )}

          <button
            onClick={() => setActivePage("progress")}
            className="mt-6 w-full rounded-xl border border-slate-300 py-3 font-semibold transition hover:bg-slate-100"
          >
            Open progress
          </button>
        </section>
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Today's schedule
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              {todayPlan?.items.length
                ? todayPlan.items
                    .map((item) => item.label)
                    .join(" + ")
                : "Recovery day"}
            </h2>
          </div>
          <button
            onClick={() =>
              setActivePage(
                todayPlan?.items.some(
                  (item) => item.detail === "Strength training"
                )
                  ? "training"
                  : "plan"
              )
            }
            className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-black hover:bg-emerald-400"
          >
            {todayPlan?.items.some(
              (item) => item.detail === "Strength training"
            )
              ? "Open today's workout"
              : "View weekly plan"}
          </button>
        </div>

        {todayPlan?.items.length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {todayPlan.items.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="font-bold">{item.label}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No planned training today. Prioritize sleep, food and recovery.
          </p>
        )}
      </section>

      {progressionSuggestion && (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            Progressive overload
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="text-2xl font-bold">
                {progressionSuggestion.exercise}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Last strong set: {progressionSuggestion.previous}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-emerald-600">
                Try next
              </p>
              <p className="mt-1 text-xl font-black">
                {progressionSuggestion.next}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
          Today's actions
        </p>
        <h2 className="mt-2 text-2xl font-bold">
          Focus on the next useful step
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <button
            onClick={() => setActivePage("nutrition")}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-emerald-500/40"
          >
            <p className="font-bold">Finish nutrition</p>
            <p className="mt-2 text-sm text-slate-500">
              {caloriesRemaining > 0
                ? `${Math.round(caloriesRemaining)} kcal remaining`
                : "Review today's intake"}
            </p>
          </button>

          <button
            onClick={() => setActivePage("training")}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-emerald-500/40"
          >
            <p className="font-bold">Training</p>
            <p className="mt-2 text-sm text-slate-500">
              Open your workouts and continue your plan.
            </p>
          </button>

          <button
            onClick={() => setActivePage("progress")}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-emerald-500/40"
          >
            <p className="font-bold">Log progress</p>
            <p className="mt-2 text-sm text-slate-500">
              Keep weight data consistent for better adjustments.
            </p>
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Get Fit Plan
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Your plan will adapt as BodyPilot learns from you
            </h2>
            <p className="mt-2 max-w-3xl text-slate-600">
              Nutrition, workouts and progress are now connected on
              the dashboard. The next version can use these signals
              to adjust targets and training recommendations over time.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
              Nutrition ✓
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
              Training ✓
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
              Progress ✓
            </span>
          </div>
        </div>
      </section>
    </>
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
        <span className="ml-2 text-sm font-normal text-slate-400">
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
          className="text-emerald-600"
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
}: {
  profile: BodyProfile;
  setProfile: React.Dispatch<React.SetStateAction<BodyProfile>>;
  goals: Goals;
  setGoals: React.Dispatch<React.SetStateAction<Goals>>;
  weightEntries: WeightEntry[];
  nutritionHistory: NutritionDay[];
  setActivePage: (page: Page) => void;
}) {
  const [draft, setDraft] = useState<BodyProfile>(profile);
  const [calculated, setCalculated] = useState(false);
  const [planSavedToTraining, setPlanSavedToTraining] = useState(false);

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
        "Could not save BodyPilot training plan:",
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

  return (
    <>
      <p className="text-sm font-semibold tracking-widest text-emerald-600">
        GET FIT PLAN
      </p>

      <h1 className="mt-2 text-4xl font-black tracking-tight">
        Build your starting plan
      </h1>

      <p className="mt-3 max-w-3xl text-slate-600">
        BodyPilot estimates your maintenance calories from your body
        data and activity, then adjusts calories and macros for your
        selected goal. You can still edit the targets later.
      </p>

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
              value={draft.height}
              unit="cm"
              min={120}
              max={230}
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
              onChange={(value) => update("targetWeight", value)}
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
                            ? "border-emerald-500 bg-emerald-500 text-black"
                            : "border-slate-300 bg-slate-50 text-slate-600 hover:border-slate-400"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  }
                )}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Pick up to {draft.trainingDays} days. BodyPilot uses these first
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
                        ["0.25", "0.25 kg / week"],
                        ["0.5", "0.50 kg / week"],
                        ["0.75", "0.75 kg / week"],
                      ]
                    : [
                        ["0.1", "0.10 kg / week"],
                        ["0.25", "0.25 kg / week"],
                        ["0.5", "0.50 kg / week"],
                      ]
                }
              />
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            Activity level matters a lot for the calorie estimate.
            BodyPilot uses this as a starting estimate; later we can
            make it adaptive from your real weight trend and intake.
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-zinc-900 to-emerald-950/20 p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
            Estimated targets
          </p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Body-weight goal
            </p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <p className="text-2xl font-bold">
                {draft.weight} kg → {draft.targetWeight} kg
              </p>
              <p className="text-sm text-slate-500">
                {Math.abs(round1(draft.targetWeight - draft.weight))} kg difference
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <PlanResult
              label="BMR"
              value={`${result.bmr} kcal`}
              detail="Estimated resting needs"
            />
            <PlanResult
              label="Maintenance"
              value={`${result.maintenance} kcal`}
              detail="Estimated daily expenditure"
            />
          </div>

          <div className="mt-5 rounded-3xl border border-emerald-500/20 bg-white p-6">
            <p className="text-sm text-slate-500">
              Daily calorie target
            </p>
            <p className="mt-2 text-5xl font-black text-emerald-600">
              {result.calories}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              kcal / day
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
            className="mt-6 w-full rounded-xl bg-emerald-500 py-4 text-lg font-bold text-black transition hover:bg-emerald-400"
          >
            Apply these targets
          </button>

          {calculated && (
            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-500">
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

          <p className="mt-4 text-xs leading-5 text-slate-400">
            These are estimates, not medical or dietetic advice.
            Real maintenance can differ, so future BodyPilot versions
            should adjust the plan from actual weight trends.
          </p>
        </section>
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
              Weekly Schedule
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Strength + cardio together
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              BodyPilot spreads strength and cardio across the week and tries
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
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
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

          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-500">
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
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
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
          add a small amount of weight next time. The next BodyPilot version can
          save this generated program directly into Saved Workouts.
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={saveTrainingPlanToTraining}
            className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-black transition hover:bg-emerald-400"
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
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-500">
            Training plan saved. Open Training → Saved Workouts to use it.
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
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
                value={`${recentNutrition.calories} kcal`}
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
                {recentNutrition.calories - goals.calories} kcal/day
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Difference between your logged average and current target.
              </p>
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <p className="font-semibold">No completed nutrition days yet.</p>
            <p className="mt-2 text-sm text-slate-500">
              BodyPilot now saves a daily nutrition snapshot automatically.
              Tomorrow, today's totals will become your first completed day.
            </p>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
              Adaptive BodyPilot
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Weight-trend check-in
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              BodyPilot compares your recent weight trend with the weekly
              rate selected in your Get Fit Plan. It only suggests a small
              calorie change; you decide whether to apply it.
            </p>
          </div>

          <span className={`rounded-full border px-4 py-2 text-xs font-semibold ${
            adaptive.ready
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
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
              BodyPilot needs at least 4 measurements spanning at least 7 days.
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
                value={`${adaptive.observedRate! > 0 ? "+" : ""}${adaptive.observedRate} kg/week`}
                detail="Based on recent weigh-ins"
              />
              <PlanResult
                label="Planned trend"
                value={`${adaptive.targetRate! > 0 ? "+" : ""}${adaptive.targetRate} kg/week`}
                detail="From your Get Fit Plan"
              />
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <p className="text-sm font-semibold text-emerald-500">
                BodyPilot recommendation
              </p>
              <p className="mt-3 text-xl font-bold">
                {adaptive.recommendation}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {adaptive.explanation}
              </p>

              {recentNutrition &&
                adaptive.ready &&
                adaptive.observedRate !== null && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Estimated real maintenance
                    </p>
                    <p className="mt-2 text-xl font-bold">
                      {Math.round(
                        recentNutrition.calories -
                          (adaptive.observedRate * 7700) / 7
                      )} kcal/day
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
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
                        {adaptive.suggestedCalories} kcal
                      </p>
                    </div>

                    <button
                      onClick={applyAdaptiveAdjustment}
                      className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-black transition hover:bg-emerald-400"
                    >
                      Apply adjustment
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}

        <p className="mt-5 text-xs leading-5 text-slate-400">
          V1 uses your weight trend. A later version can become more accurate
          by storing daily calorie-intake history and comparing intake,
          adherence and weight trend together.
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
        <h2 className="text-xl font-bold">Current saved targets</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <PlanResult
            label="Calories"
            value={`${goals.calories} kcal`}
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
    return "Combine easy aerobic work with one quality session. BodyPilot keeps harder cardio away from lower-body sessions where possible to reduce interference.";
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
          ? "Your recent weight loss is slower than the selected target, so BodyPilot suggests a small reduction rather than a large jump."
          : "Your recent weight loss is faster than the selected target, so BodyPilot suggests adding a small amount of food."
        : profile.goal === "gain"
          ? calorieAdjustment > 0
            ? "Your recent weight gain is slower than the selected target, so BodyPilot suggests a small calorie increase."
            : "Your recent weight gain is faster than the selected target, so BodyPilot suggests a small calorie reduction."
          : calorieAdjustment > 0
            ? "Your weight is trending down while your goal is maintenance, so BodyPilot suggests a small calorie increase."
            : "Your weight is trending up while your goal is maintenance, so BodyPilot suggests a small calorie reduction.",
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
  return (
    <label>
      <span className="mb-2 block text-sm text-slate-600">
        {label}
      </span>
      <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 focus-within:border-emerald-500">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) =>
            onChange(Number(event.target.value))
          }
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
        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-emerald-500"
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
      <p className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
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
          <p className="text-sm font-semibold tracking-widest text-emerald-600">
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
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black transition hover:bg-emerald-400"
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

      {showNewMeal && (
        <section className="mt-6 rounded-3xl border border-emerald-500/30 bg-white p-6">
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
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-emerald-500"
            />

            <button
              onClick={
                createMeal
              }
              className="rounded-xl bg-emerald-500 px-6 font-semibold text-black"
            >
              Create
            </button>
          </div>
        </section>
      )}

      {showGoals && (
        <section className="mt-8 rounded-3xl border border-emerald-500/30 bg-white p-7">
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
            className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black"
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

      <FoodSearch
        meals={meals}
        onAddFood={
          addFood
        }
      />

      <FoodDiary
        foods={foods}
        meals={meals}
        onDelete={
          deleteFood
        }
        onMoveFood={
          moveFood
        }
        onDeleteMeal={
          deleteMeal
        }
      />

      <button
        onClick={() =>
          setShowOptimizer(
            !showOptimizer
          )
        }
        className="mt-8 w-full rounded-2xl bg-emerald-500 p-5 text-lg font-bold text-black transition hover:bg-emerald-400"
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
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
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
            <div className="grid grid-cols-5 border-b border-slate-200 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
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
}: {
  weightEntries: WeightEntry[];
  setWeightEntries: React.Dispatch<
    React.SetStateAction<WeightEntry[]>
  >;
}) {
  const [activeProgressTab, setActiveProgressTab] =
    useState<"weight" | "strength" | "records">(
      "weight"
    );

  const [weight, setWeight] = useState("");
  const [weightDate, setWeightDate] = useState(
    getTodayDateInput()
  );

  const [trainingHistory, setTrainingHistory] =
    useState<TrainingHistoryEntry[]>([]);

  const [selectedExerciseId, setSelectedExerciseId] =
    useState("");

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(
        "bodypilot-workout-history"
      );

      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);

        if (Array.isArray(parsed)) {
          setTrainingHistory(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Could not load workout history for progress:",
        error
      );
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
      weight: round1(numericWeight),
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
      <p className="text-sm font-semibold tracking-widest text-emerald-600">
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
        <ProgressTabButton
          name="Body Weight"
          active={
            activeProgressTab === "weight"
          }
          onClick={() =>
            setActiveProgressTab("weight")
          }
        />

        <ProgressTabButton
          name="Strength"
          active={
            activeProgressTab === "strength"
          }
          onClick={() =>
            setActiveProgressTab("strength")
          }
        />

        <ProgressTabButton
          name="Personal Records"
          active={
            activeProgressTab === "records"
          }
          onClick={() =>
            setActiveProgressTab("records")
          }
        />
      </div>

      {activeProgressTab === "weight" && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ProgressStatCard
              label="Current weight"
              value={
                latest
                  ? `${latest.weight} kg`
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
                  ? `${change > 0 ? "+" : ""}${change} kg`
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
                  ? `${
                      recentChange > 0 ? "+" : ""
                    }${recentChange} kg`
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
                    value: entry.weight,
                    label: formatShortDate(
                      entry.date
                    ),
                  })
                )}
                unit="kg"
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
                    placeholder="88.0"
                    className="w-full bg-transparent p-4 outline-none"
                  />

                  <span className="pr-4 text-slate-500">
                    kg
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
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={addWeight}
                className="self-end rounded-xl bg-emerald-500 px-7 py-4 font-semibold text-black transition hover:bg-emerald-400"
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
                          {entry.weight} kg
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
                  className="min-w-64 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none focus:border-emerald-500"
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
                first. BodyPilot will use your
                workout history automatically.
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <ProgressStatCard
                    label="Latest best set"
                    value={
                      strengthData.length > 0
                        ? `${
                            strengthData[
                              strengthData.length -
                                1
                            ].weight
                          } kg × ${
                            strengthData[
                              strengthData.length -
                                1
                            ].reps
                          }`
                        : "—"
                    }
                    detail="Best set from latest session"
                  />

                  <ProgressStatCard
                    label="Estimated 1RM"
                    value={
                      strengthData.length > 0
                        ? `${Math.round(
                            strengthData[
                              strengthData.length -
                                1
                            ].estimated1RM
                          )} kg`
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
                        value:
                          entry.estimated1RM,
                        label: formatShortDate(
                          entry.date
                        ),
                      })
                    )}
                    unit="kg e1RM"
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
                            {entry.weight} kg ×{" "}
                            {entry.reps}
                            <span className="ml-3 text-sm font-normal text-slate-500">
                              ~
                              {Math.round(
                                entry.estimated1RM
                              )}{" "}
                              kg e1RM
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
              Best performance BodyPilot can find
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
                      <p className="text-sm font-semibold tracking-wider text-emerald-600">
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
                    {record.weight} kg ×{" "}
                    {record.reps}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Estimated 1RM:{" "}
                    {Math.round(
                      record.estimated1RM
                    )}{" "}
                    kg
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
          ? "bg-emerald-500 text-black"
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
            <div className="mx-auto h-4 w-4 rounded-full bg-emerald-500" />

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
            className="text-emerald-600"
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
                className="text-emerald-600"
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

      <p className="mt-1 text-right text-xs text-slate-400">
        {unit}
      </p>
    </div>
  );
}

function getTodayDateInput() {
  const now = new Date();
  const local = new Date(
    now.getTime() -
      now.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 10);
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
        className="h-full rounded-full bg-emerald-500 transition-all"
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