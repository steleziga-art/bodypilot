"use client";

import { useMemo, useState } from "react";

type Goals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type NutritionDay = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

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

const micronutrientTargets: Array<{ key: string; label: string; goal: number; unit: string; upper?: boolean }> = [
  { key: "vitaminA", label: "Vitamin A", goal: 900, unit: "µg" },
  { key: "vitaminC", label: "Vitamin C", goal: 90, unit: "mg" },
  { key: "vitaminD", label: "Vitamin D", goal: 20, unit: "µg" },
  { key: "vitaminE", label: "Vitamin E", goal: 15, unit: "mg" },
  { key: "vitaminK", label: "Vitamin K", goal: 120, unit: "µg" },
  { key: "thiamin", label: "Vitamin B1", goal: 1.2, unit: "mg" },
  { key: "riboflavin", label: "Vitamin B2", goal: 1.3, unit: "mg" },
  { key: "niacin", label: "Vitamin B3", goal: 16, unit: "mg" },
  { key: "vitaminB6", label: "Vitamin B6", goal: 1.7, unit: "mg" },
  { key: "folate", label: "Folate", goal: 400, unit: "µg" },
  { key: "vitaminB12", label: "Vitamin B12", goal: 2.4, unit: "µg" },
  { key: "calcium", label: "Calcium", goal: 1300, unit: "mg" },
  { key: "iron", label: "Iron", goal: 18, unit: "mg" },
  { key: "magnesium", label: "Magnesium", goal: 420, unit: "mg" },
  { key: "potassium", label: "Potassium", goal: 4700, unit: "mg" },
  { key: "zinc", label: "Zinc", goal: 11, unit: "mg" },
  { key: "selenium", label: "Selenium", goal: 55, unit: "µg" },
  { key: "sodium", label: "Sodium", goal: 2300, unit: "mg", upper: true },
  { key: "fiber", label: "Fiber", goal: 28, unit: "g" },
];

function convertMicro(value: number, fromUnit: string, toUnit: string) {
  const from = fromUnit.toLowerCase().replace("ug", "µg");
  const to = toUnit.toLowerCase().replace("ug", "µg");
  if (from === to) return value;
  if (from === "mg" && to === "µg") return value * 1000;
  if (from === "µg" && to === "mg") return value / 1000;
  if (from === "g" && to === "mg") return value * 1000;
  if (from === "mg" && to === "g") return value / 1000;
  return value;
}

export default function NutritionInsights({
  foods,
  caloriesEaten,
  proteinEaten,
  carbsEaten,
  fatEaten,
  goals,
  nutritionHistory,
  waterMl,
  setWaterMl,
}: {
  foods: Food[];
  caloriesEaten: number;
  proteinEaten: number;
  carbsEaten: number;
  fatEaten: number;
  goals: Goals;
  nutritionHistory: NutritionDay[];
  waterMl: number;
  setWaterMl: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [view, setView] = useState<"today" | "analytics">("today");
  const [range, setRange] = useState<7 | 30 | 90>(7);
  const waterGoal = 3000;

  const stats = useMemo(() => {
    const days = [...nutritionHistory]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-range);

    const average = (key: "calories" | "protein" | "carbs" | "fat") =>
      days.length
        ? Math.round(days.reduce((sum, day) => sum + day[key], 0) / days.length)
        : 0;

    const adherent = days.filter(
      (day) =>
        goals.calories > 0 &&
        Math.abs(day.calories - goals.calories) <= goals.calories * 0.1
    ).length;

    return {
      days,
      avgCalories: average("calories"),
      avgProtein: average("protein"),
      avgCarbs: average("carbs"),
      avgFat: average("fat"),
      adherence: days.length ? Math.round((adherent / days.length) * 100) : 0,
    };
  }, [nutritionHistory, range, goals.calories]);

  const calorieScore = Math.max(
    0,
    Math.min(100, Math.round(100 - (Math.abs(caloriesEaten - goals.calories) / Math.max(1, goals.calories)) * 100))
  );
  const proteinScore = Math.max(0, Math.min(100, Math.round((proteinEaten / Math.max(1, goals.protein)) * 100)));
  const hydrationScore = Math.max(0, Math.min(100, Math.round((waterMl / waterGoal) * 100)));
  const score = Math.round((calorieScore + proteinScore + hydrationScore) / 3);

  const macros = [
    { label: "Protein", value: proteinEaten, goal: goals.protein, unit: "g" },
    { label: "Carbs", value: carbsEaten, goal: goals.carbs, unit: "g" },
    { label: "Fat", value: fatEaten, goal: goals.fat, unit: "g" },
  ];

  const micronutrients = useMemo(() => micronutrientTargets.map((target) => {
    let value = 0;
    let hasData = false;
    for (const food of foods) {
      const nutrient = food.micronutrients?.[target.key];
      if (!nutrient || !Number.isFinite(nutrient.value)) continue;
      hasData = true;
      value += convertMicro(nutrient.value, nutrient.unit, target.unit);
    }
    return { ...target, value, hasData, pct: hasData ? Math.min(140, Math.round((value / target.goal) * 100)) : 0 };
  }), [foods]);

  const lowMicros = micronutrients.filter((item) => item.hasData && !item.upper && item.pct < 70).slice(0, 3);
  const microCoverage = micronutrients.filter((item) => item.hasData).length;

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-blue-100 bg-blue-50 p-6 text-slate-950">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-400">Nutrition 3.0</p>
            <h2 className="mt-2 text-3xl font-black">Fuel the plan.</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              One place for today&apos;s targets, hydration and your longer-term nutrition consistency.
            </p>
          </div>
          <div className="flex rounded-2xl bg-white/10 p-1">
            <button onClick={() => setView("today")} className={`rounded-xl px-4 py-2 text-sm font-black ${view === "today" ? "bg-white text-slate-950" : "text-slate-500"}`}>Today</button>
            <button onClick={() => setView("analytics")} className={`rounded-xl px-4 py-2 text-sm font-black ${view === "analytics" ? "bg-white text-slate-950" : "text-slate-500"}`}>Analytics</button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Metric label="Nutrition score" value={`${score}/100`} />
          <Metric label="Calories" value={`${Math.round(caloriesEaten)} / ${goals.calories}`} />
          <Metric label="Protein" value={`${Math.round(proteinEaten)} / ${goals.protein} g`} />
          <Metric label="Water" value={`${(waterMl / 1000).toFixed(1)} / 3.0 L`} />
        </div>
      </div>

      {view === "today" ? (
        <div className="grid gap-5 p-6 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-600">Macro progress</p>
            <div className="mt-4 space-y-4">
              {macros.map((macro) => {
                const pct = Math.min(100, Math.round((macro.value / Math.max(1, macro.goal)) * 100));
                return (
                  <div key={macro.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-black">{macro.label}</span>
                      <span className="text-slate-500">{Math.round(macro.value)} / {macro.goal} {macro.unit}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div><p className="text-xs font-black uppercase tracking-widest text-slate-600">Micronutrients</p><h3 className="mt-1 text-xl font-black text-slate-950">Vitamins, minerals & fiber</h3></div>
                <span className="text-xs font-bold text-slate-600">{microCoverage}/{micronutrients.length} with data</span>
              </div>
              {microCoverage ? (
                <>
                  {lowMicros.length > 0 && <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-xs font-semibold text-amber-800">Lower today: {lowMicros.map((item) => item.label).join(", ")}. Food database coverage can be incomplete.</div>}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {micronutrients.map((item) => (
                      <div key={item.key} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-3 text-xs"><span className="font-black text-slate-800">{item.label}</span><span className="text-slate-500">{item.hasData ? `${item.value < 10 ? item.value.toFixed(1) : Math.round(item.value)} / ${item.goal} ${item.unit}` : "No data"}</span></div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${item.upper && item.pct > 100 ? "bg-amber-500" : "bg-blue-500"}`} style={{ width: `${Math.min(100, item.pct)}%` }} /></div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-slate-600">Reference targets are general daily values, not personalized medical targets. Missing food data is shown as “No data”, not zero.</p>
                </>
              ) : <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">No micronutrient data is available for today&apos;s logged foods yet. USDA foods added from search will include available micronutrients; custom and many barcode foods may not.</div>}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-xs font-black uppercase tracking-widest text-sky-600">Hydration</p><p className="mt-1 text-2xl font-black">{waterMl} ml</p></div>
              <button onClick={() => setWaterMl(0)} className="text-xs font-black text-slate-600 hover:text-slate-700">Reset</button>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-sky-500" style={{ width: `${hydrationScore}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[250, 500, 750].map((ml) => (
                <button key={ml} onClick={() => setWaterMl((value) => value + ml)} className="rounded-xl bg-white px-2 py-3 text-xs font-black shadow-sm hover:bg-slate-100">+{ml} ml</button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-widest text-blue-600">Analytics</p><h3 className="mt-1 text-2xl font-black">Consistency over time</h3></div>
            <div className="flex rounded-xl bg-slate-100 p-1">
              {([7, 30, 90] as const).map((days) => (
                <button key={days} onClick={() => setRange(days)} className={`rounded-lg px-3 py-2 text-xs font-black ${range === days ? "bg-white shadow-sm" : "text-slate-500"}`}>{days}D</button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <AnalyticsMetric label="Avg calories" value={stats.days.length ? `${stats.avgCalories}` : "—"} detail={`Target ${goals.calories}`} />
            <AnalyticsMetric label="Avg protein" value={stats.days.length ? `${stats.avgProtein}g` : "—"} detail={`Target ${goals.protein}g`} />
            <AnalyticsMetric label="Avg carbs" value={stats.days.length ? `${stats.avgCarbs}g` : "—"} detail={`Target ${goals.carbs}g`} />
            <AnalyticsMetric label="Avg fat" value={stats.days.length ? `${stats.avgFat}g` : "—"} detail={`Target ${goals.fat}g`} />
            <AnalyticsMetric label="Adherence" value={stats.days.length ? `${stats.adherence}%` : "—"} detail="Within ±10% calories" />
          </div>

          <div className="mt-5 rounded-3xl bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-xs font-black uppercase tracking-widest text-slate-600">Logged days</p><p className="mt-1 text-xl font-black">{stats.days.length} of last {range} days</p></div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">Local history</span>
            </div>
            <div className="mt-5 flex h-28 items-end gap-1">
              {stats.days.length ? stats.days.map((day) => {
                const pct = Math.max(8, Math.min(100, (day.calories / Math.max(1, goals.calories)) * 75));
                return <div key={day.date} title={`${day.date}: ${day.calories} kcal`} className="min-w-1 flex-1 rounded-t bg-blue-500/80" style={{ height: `${pct}%` }} />;
              }) : <div className="flex h-full w-full items-center justify-center text-sm text-slate-600">Log food for a few days to build your trend.</div>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-bold text-slate-600">{label}</p><p className="mt-1 text-xl font-black">{value}</p></div>;
}

function AnalyticsMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-600">{label}</p><p className="mt-2 text-2xl font-black">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}
