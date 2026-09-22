"use client";

import { useMemo, useState } from "react";

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

type FoodDiaryProps = {
  foods: Food[];
  meals: Meal[];
  goals: Goals;
  onDelete: (id: number) => void;
  onMoveFood: (foodId: number, mealId: string) => void;
  onDeleteMeal: (mealId: string) => void;
  onUpdateFood: (food: Food) => void;
  onDuplicateFood: (id: number) => void;
  onDuplicateMeal: (mealId: string) => void;
  onCopyYesterday: () => void;
  hasYesterday: boolean;
  onAddFoodToMeal: (mealId: string) => void;
};

export default function FoodDiary({
  foods,
  meals,
  goals,
  onDelete,
  onMoveFood,
  onDeleteMeal,
  onUpdateFood,
  onDuplicateFood,
  onDuplicateMeal,
  onCopyYesterday,
  hasYesterday,
  onAddFoodToMeal,
}: FoodDiaryProps) {
  const [collapsedMeals, setCollapsedMeals] = useState<string[]>([]);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [editAmount, setEditAmount] = useState("100");
  const [menuFoodId, setMenuFoodId] = useState<number | null>(null);

  const totals = useMemo(
    () => ({
      calories: foods.reduce((sum, food) => sum + food.calories, 0),
      protein: foods.reduce((sum, food) => sum + food.protein, 0),
      carbs: foods.reduce((sum, food) => sum + food.carbs, 0),
      fat: foods.reduce((sum, food) => sum + food.fat, 0),
    }),
    [foods]
  );

  const remaining = {
    calories: goals.calories - totals.calories,
    protein: goals.protein - totals.protein,
    carbs: goals.carbs - totals.carbs,
    fat: goals.fat - totals.fat,
  };

  function toggleMeal(mealId: string) {
    setCollapsedMeals((current) =>
      current.includes(mealId)
        ? current.filter((id) => id !== mealId)
        : [...current, mealId]
    );
  }

  function startEditing(food: Food) {
    setEditingFood(food);
    setEditAmount(String(getAmountFromName(food.name)));
    setMenuFoodId(null);
  }

  function saveEdit() {
    if (!editingFood) return;

    const oldAmount = getAmountFromName(editingFood.name);
    const newAmount = Number(editAmount);

    if (!Number.isFinite(newAmount) || newAmount <= 0 || oldAmount <= 0) return;

    const multiplier = newAmount / oldAmount;
    const cleanName = stripAmount(editingFood.name);

    onUpdateFood({
      ...editingFood,
      name: `${cleanName} (${round1(newAmount)}g)`,
      calories: round1(editingFood.calories * multiplier),
      protein: round1(editingFood.protein * multiplier),
      carbs: round1(editingFood.carbs * multiplier),
      fat: round1(editingFood.fat * multiplier),
    });

    setEditingFood(null);
  }

  return (
    <section className="mt-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Daily diary
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Today&apos;s food
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Log, edit and organize everything you eat today.
          </p>
        </div>

        <button
          onClick={onCopyYesterday}
          disabled={!hasYesterday}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Copy yesterday
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Calories</p>
            <div className="mt-1 flex items-end gap-2">
              <p className="text-3xl font-black text-slate-900">
                {Math.round(totals.calories)}
              </p>
              <p className="pb-1 text-sm font-semibold text-slate-400">
                / {goals.calories} kcal
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {remaining.calories >= 0 ? "Remaining" : "Over target"}
            </p>
            <p
              className={`mt-1 text-xl font-black ${
                remaining.calories >= 0 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {Math.abs(Math.round(remaining.calories))} kcal
            </p>
          </div>
        </div>

        <Progress value={totals.calories} goal={goals.calories} />

        <div className="mt-5 grid grid-cols-3 gap-3">
          <MacroProgress
            label="Protein"
            eaten={totals.protein}
            goal={goals.protein}
          />
          <MacroProgress
            label="Carbs"
            eaten={totals.carbs}
            goal={goals.carbs}
          />
          <MacroProgress
            label="Fat"
            eaten={totals.fat}
            goal={goals.fat}
          />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {meals.map((meal) => {
          const mealFoods = foods.filter(
            (food) => (food.mealId || "breakfast") === meal.id
          );

          const mealTotals = {
            calories: mealFoods.reduce((sum, food) => sum + food.calories, 0),
            protein: mealFoods.reduce((sum, food) => sum + food.protein, 0),
            carbs: mealFoods.reduce((sum, food) => sum + food.carbs, 0),
            fat: mealFoods.reduce((sum, food) => sum + food.fat, 0),
          };

          const isDefaultMeal = [
            "breakfast",
            "lunch",
            "dinner",
            "snacks",
          ].includes(meal.id);

          const collapsed = collapsedMeals.includes(meal.id);

          return (
            <div
              key={meal.id}
              className="overflow-visible rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
                <button
                  onClick={() => toggleMeal(meal.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">
                      {collapsed ? "▶" : "▼"}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 sm:text-xl">
                      {meal.name}
                    </h3>
                  </div>
                  <p className="mt-1 pl-7 text-sm text-slate-400">
                    {mealFoods.length} {mealFoods.length === 1 ? "item" : "items"}
                  </p>
                </button>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-black text-slate-900">
                      {Math.round(mealTotals.calories)} kcal
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {round1(mealTotals.protein)}g P · {round1(mealTotals.carbs)}g C ·{" "}
                      {round1(mealTotals.fat)}g F
                    </p>
                  </div>

                  <button
                    onClick={() => onAddFoodToMeal(meal.id)}
                    className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-black text-black transition hover:bg-emerald-400"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {!collapsed && (
                <>
                  {mealFoods.length === 0 ? (
                    <button
                      onClick={() => onAddFoodToMeal(meal.id)}
                      className="block w-full border-t border-slate-100 p-6 text-left"
                    >
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center transition hover:border-emerald-300 hover:bg-emerald-50">
                        <p className="text-sm font-semibold text-slate-500">
                          No food added yet
                        </p>
                        <p className="mt-1 text-xs font-semibold text-emerald-600">
                          + Add food to {meal.name}
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="divide-y divide-slate-100 border-t border-slate-100">
                      {mealFoods.map((food) => (
                        <div
                          key={food.id}
                          className="relative flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <button
                            onClick={() => startEditing(food)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold text-slate-900">
                                {stripAmount(food.name)}
                              </p>
                              <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
                                {round1(getAmountFromName(food.name))} g
                              </span>
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                              {round1(food.protein)}g P · {round1(food.carbs)}g C ·{" "}
                              {round1(food.fat)}g F
                            </p>
                          </button>

                          <div className="flex items-center gap-3">
                            <p className="font-black text-slate-900">
                              {Math.round(food.calories)} kcal
                            </p>

                            <button
                              onClick={() =>
                                setMenuFoodId(
                                  menuFoodId === food.id ? null : food.id
                                )
                              }
                              className="h-10 w-10 rounded-xl border border-slate-200 bg-white font-black text-slate-500"
                            >
                              ···
                            </button>

                            {menuFoodId === food.id && (
                              <div className="absolute right-5 top-16 z-20 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:top-14">
                                <button
                                  onClick={() => startEditing(food)}
                                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50"
                                >
                                  Edit amount
                                </button>

                                <button
                                  onClick={() => {
                                    onDuplicateFood(food.id);
                                    setMenuFoodId(null);
                                  }}
                                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50"
                                >
                                  Duplicate
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Move to
                                </p>

                                {meals
                                  .filter((option) => option.id !== meal.id)
                                  .map((option) => (
                                    <button
                                      key={option.id}
                                      onClick={() => {
                                        onMoveFood(food.id, option.id);
                                        setMenuFoodId(null);
                                      }}
                                      className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-50"
                                    >
                                      {option.name}
                                    </button>
                                  ))}

                                <div className="my-1 border-t border-slate-100" />

                                <button
                                  onClick={() => {
                                    onDelete(food.id);
                                    setMenuFoodId(null);
                                  }}
                                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                    <button
                      onClick={() => onAddFoodToMeal(meal.id)}
                      className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      + Add food
                    </button>

                    <div className="flex gap-3">
                      {mealFoods.length > 0 && (
                        <button
                          onClick={() => onDuplicateMeal(meal.id)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                        >
                          Duplicate meal
                        </button>
                      )}

                      {!isDefaultMeal && (
                        <button
                          onClick={() => onDeleteMeal(meal.id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-600"
                        >
                          Delete meal
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {editingFood && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/25 p-4 backdrop-blur-sm sm:items-center"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setEditingFood(null);
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Edit food
                </p>
                <h3 className="mt-2 text-xl font-black text-slate-900">
                  {stripAmount(editingFood.name)}
                </h3>
              </div>
              <button
                onClick={() => setEditingFood(null)}
                className="h-10 w-10 rounded-xl bg-slate-100 font-bold text-slate-500"
              >
                ×
              </button>
            </div>

            <label className="mt-6 block text-sm font-bold text-slate-700">
              Amount
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="1"
                step="1"
                value={editAmount}
                onChange={(event) => setEditAmount(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveEdit();
                }}
                className="min-w-0 flex-1 rounded-xl border border-slate-300 p-4 text-lg font-bold outline-none focus:border-emerald-500"
                autoFocus
              />
              <span className="font-bold text-slate-500">g</span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {[50, 100, 150, 200].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setEditAmount(String(amount))}
                  className="rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-600 hover:border-emerald-300"
                >
                  {amount}g
                </button>
              ))}
            </div>

            <EditPreview food={editingFood} amount={Number(editAmount) || 0} />

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditingFood(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 rounded-xl bg-emerald-500 py-3 font-black text-black hover:bg-emerald-400"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function EditPreview({ food, amount }: { food: Food; amount: number }) {
  const originalAmount = getAmountFromName(food.name);
  const multiplier = originalAmount > 0 ? amount / originalAmount : 0;

  return (
    <div className="mt-5 grid grid-cols-4 gap-2">
      <SmallStat label="kcal" value={Math.round(food.calories * multiplier)} />
      <SmallStat label="P" value={`${round1(food.protein * multiplier)}g`} />
      <SmallStat label="C" value={`${round1(food.carbs * multiplier)}g`} />
      <SmallStat label="F" value={`${round1(food.fat * multiplier)}g`} />
    </div>
  );
}

function SmallStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function MacroProgress({
  label,
  eaten,
  goal,
}: {
  label: string;
  eaten: number;
  goal: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="text-xs font-black text-slate-900">
          {round1(eaten)}/{goal}g
        </p>
      </div>
      <Progress value={eaten} goal={goal} compact />
    </div>
  );
}

function Progress({
  value,
  goal,
  compact = false,
}: {
  value: number;
  goal: number;
  compact?: boolean;
}) {
  const percent = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;

  return (
    <div
      className={`overflow-hidden rounded-full bg-slate-100 ${
        compact ? "mt-2 h-1.5" : "mt-4 h-2.5"
      }`}
    >
      <div
        className="h-full rounded-full bg-emerald-500 transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function getAmountFromName(name: string) {
  const matches = [...name.matchAll(/\(([\d.]+)g\)/gi)];
  const last = matches[matches.length - 1];
  const amount = last ? Number(last[1]) : 100;
  return Number.isFinite(amount) && amount > 0 ? amount : 100;
}

function stripAmount(name: string) {
  return name.replace(/\s*\([\d.]+g\)\s*$/i, "").trim();
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}
