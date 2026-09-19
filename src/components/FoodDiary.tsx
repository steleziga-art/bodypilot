"use client";

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

type FoodDiaryProps = {
  foods: Food[];
  meals: Meal[];
  onDelete: (id: number) => void;
  onMoveFood: (foodId: number, mealId: string) => void;
  onDeleteMeal: (mealId: string) => void;
};

export default function FoodDiary({
  foods,
  meals,
  onDelete,
  onMoveFood,
  onDeleteMeal,
}: FoodDiaryProps) {
  return (
    <section className="mt-8">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">
          Today&apos;s food
        </h2>

        <p className="mt-1 text-zinc-500">
          Your meals and daily food log.
        </p>
      </div>

      <div className="space-y-5">
        {meals.map((meal) => {
          const mealFoods = foods.filter(
            (food) =>
              (food.mealId || "breakfast") === meal.id
          );

          const calories = mealFoods.reduce(
            (total, food) =>
              total + food.calories,
            0
          );

          const protein = mealFoods.reduce(
            (total, food) =>
              total + food.protein,
            0
          );

          const carbs = mealFoods.reduce(
            (total, food) =>
              total + food.carbs,
            0
          );

          const fat = mealFoods.reduce(
            (total, food) =>
              total + food.fat,
            0
          );

          const isDefaultMeal = [
            "breakfast",
            "lunch",
            "dinner",
            "snacks",
          ].includes(meal.id);

          return (
            <div
              key={meal.id}
              className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 p-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">
                      {meal.name}
                    </h3>

                    {!isDefaultMeal && (
                      <button
                        onClick={() =>
                          onDeleteMeal(meal.id)
                        }
                        className="text-xs text-red-400 transition hover:text-red-300"
                      >
                        Delete meal
                      </button>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-zinc-500">
                    {mealFoods.length}{" "}
                    {mealFoods.length === 1
                      ? "item"
                      : "items"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {Math.round(calories)} kcal
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    {round1(protein)}g P •{" "}
                    {round1(carbs)}g C •{" "}
                    {round1(fat)}g F
                  </p>
                </div>
              </div>

              {mealFoods.length === 0 ? (
                <div className="p-6 text-sm text-zinc-600">
                  No food added.
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {mealFoods.map((food) => (
                    <div
                      key={food.id}
                      className="flex flex-wrap items-center justify-between gap-5 p-5"
                    >
                      <div>
                        <p className="font-medium">
                          {food.name}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {round1(food.protein)}g P •{" "}
                          {round1(food.carbs)}g C •{" "}
                          {round1(food.fat)}g F
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <p className="font-semibold">
                          {Math.round(food.calories)} kcal
                        </p>

                        <select
                          value={
                            food.mealId ||
                            "breakfast"
                          }
                          onChange={(event) =>
                            onMoveFood(
                              food.id,
                              event.target.value
                            )
                          }
                          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-green-400"
                        >
                          {meals.map(
                            (mealOption) => (
                              <option
                                key={
                                  mealOption.id
                                }
                                value={
                                  mealOption.id
                                }
                              >
                                {
                                  mealOption.name
                                }
                              </option>
                            )
                          )}
                        </select>

                        <button
                          onClick={() =>
                            onDelete(food.id)
                          }
                          className="text-sm text-red-400 transition hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}