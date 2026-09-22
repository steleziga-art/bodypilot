"use client";

import { useMemo, useState } from "react";
import { formatEnergy, formatWeight, type MucipesDisplaySettings } from "@/lib/mucipes/display";

type Goals = { calories: number; protein: number; carbs: number; fat: number };
type BodyProfile = { goal: "lose" | "maintain" | "gain"; targetWeight: number; trainingDays: number; weeklyRate: number };
type NutritionDay = { date: string; calories: number; protein: number; carbs: number; fat: number };
type WeightEntry = { id: number; date: string; weight: number };
type Workout = { id: string; name: string; finishedAt: string; durationSeconds: number; exercises: Array<{ exerciseName: string; sets: Array<{ weight: number; reps: number; completed?: boolean }> }> };
type Insight = { title: string; detail: string; action: string; priority: number };

function round1(value: number) { return Math.round(value * 10) / 10; }
const timeOf = (value: string) => new Date(value).getTime();

function getWeeklyStats(goals: Goals, nutritionHistory: NutritionDay[], weightEntries: WeightEntry[], trainingHistory: Workout[]) {
  const now = Date.now();
  const weekAgo = now - 7 * 86400000;
  const weekNutrition = nutritionHistory.filter((day) => timeOf(day.date) >= weekAgo);
  const weeklyWorkouts = trainingHistory.filter((workout) => timeOf(workout.finishedAt) >= weekAgo).length;
  const avgCalories = weekNutrition.length ? Math.round(weekNutrition.reduce((sum, day) => sum + day.calories, 0) / weekNutrition.length) : null;
  const avgProtein = weekNutrition.length ? Math.round(weekNutrition.reduce((sum, day) => sum + day.protein, 0) / weekNutrition.length) : null;
  const calorieAdherence = weekNutrition.length
    ? Math.round((weekNutrition.filter((day) => Math.abs(day.calories - goals.calories) <= goals.calories * 0.1).length / weekNutrition.length) * 100)
    : null;
  const sortedWeights = [...weightEntries].filter((entry) => Number.isFinite(entry.weight)).sort((a, b) => timeOf(a.date) - timeOf(b.date));
  const recentWeights = sortedWeights.filter((entry) => timeOf(entry.date) >= weekAgo);
  const weightChange = recentWeights.length >= 2 ? round1(recentWeights.at(-1)!.weight - recentWeights[0].weight) : null;

  const bestByExercise = new Map<string, number>();
  let prs = 0;
  [...trainingHistory].sort((a, b) => timeOf(a.finishedAt) - timeOf(b.finishedAt)).forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const sessionBest = exercise.sets.reduce((best, set) => {
        if (!(set.weight > 0 && set.reps > 0)) return best;
        return Math.max(best, set.weight * (1 + set.reps / 30));
      }, 0);
      if (!sessionBest) return;
      const previous = bestByExercise.get(exercise.exerciseName) ?? 0;
      if (sessionBest > previous && previous > 0 && timeOf(workout.finishedAt) >= weekAgo) prs += 1;
      bestByExercise.set(exercise.exerciseName, Math.max(previous, sessionBest));
    });
  });

  return { weeklyWorkouts, weekNutritionDays: weekNutrition.length, avgCalories, avgProtein, calorieAdherence, weightChange, prs };
}

function buildInsights({ goals, profile, nutritionHistory, weightEntries, trainingHistory, display }: { goals: Goals; profile: BodyProfile; nutritionHistory: NutritionDay[]; weightEntries: WeightEntry[]; trainingHistory: Workout[]; display: MucipesDisplaySettings }) {
  const stats = getWeeklyStats(goals, nutritionHistory, weightEntries, trainingHistory);
  const monthAgo = Date.now() - 30 * 86400000;
  const sortedWeights = [...weightEntries].sort((a, b) => timeOf(a.date) - timeOf(b.date));
  const latest = sortedWeights.at(-1)?.weight ?? null;
  const monthWeights = sortedWeights.filter((entry) => timeOf(entry.date) >= monthAgo);
  const monthStart = monthWeights[0]?.weight ?? null;
  const monthChange = latest !== null && monthStart !== null ? round1(latest - monthStart) : null;

  const insights: Insight[] = [];
  if (stats.weeklyWorkouts < profile.trainingDays) {
    insights.push({ priority: 100, title: "Training frequency", detail: `${stats.weeklyWorkouts} of ${profile.trainingDays} planned sessions are logged in the last 7 days.`, action: "Complete the planned week before adding extra volume." });
  } else {
    insights.push({ priority: 25, title: "Training frequency", detail: `${stats.weeklyWorkouts} workouts are logged in the last 7 days.`, action: "Frequency is on target. Progress load or reps only where recovery and form are good." });
  }

  if (stats.avgProtein !== null && stats.avgProtein < goals.protein * 0.9) {
    insights.push({ priority: 90, title: "Protein consistency", detail: `Your 7-day logged average is ${stats.avgProtein} g versus a ${goals.protein} g target.`, action: `Aim for roughly ${Math.max(0, goals.protein - stats.avgProtein)} g more protein across the day.` });
  } else if (stats.avgProtein !== null) {
    insights.push({ priority: 20, title: "Protein consistency", detail: `Your recent average is ${stats.avgProtein} g and is close to your ${goals.protein} g target.`, action: "No major protein change is suggested from this signal." });
  }

  if (stats.avgCalories !== null) {
    const delta = stats.avgCalories - goals.calories;
    insights.push({ priority: Math.abs(delta) > goals.calories * 0.1 ? 80 : 15, title: "Energy intake", detail: `7-day logged average: ${formatEnergy(stats.avgCalories, display.energyUnit)} (${delta >= 0 ? "+" : ""}${formatEnergy(delta, display.energyUnit)} vs target).`, action: Math.abs(delta) <= goals.calories * 0.08 ? "Recent intake is close to target." : "Use the weight trend with this intake trend before changing your target." });
  }

  if (monthChange !== null) {
    const desiredDirection = profile.goal === "lose" ? -1 : profile.goal === "gain" ? 1 : 0;
    const wrongDirection = desiredDirection === 0 ? Math.abs(monthChange) > 1 : Math.sign(monthChange) !== desiredDirection && Math.abs(monthChange) > 0.2;
    insights.push({ priority: wrongDirection ? 85 : 30, title: "Weight trend", detail: `Recent recorded change: ${monthChange > 0 ? "+" : ""}${formatWeight(monthChange, display.units)}.`, action: profile.goal === "lose" ? "For fat loss, judge the direction over multiple weigh-ins rather than reacting to one measurement." : profile.goal === "gain" ? "For muscle gain, pair a slow weight trend with strength performance." : "For maintenance, small short-term fluctuations are expected." });
  }

  if (!insights.length) insights.push({ priority: 10, title: "Build your baseline", detail: "Log a few workouts, nutrition days and weigh-ins so CYG can compare trends.", action: "Consistent data matters more than adding more metrics." });
  return { insights: insights.sort((a, b) => b.priority - a.priority).slice(0, 4), stats };
}

export default function CoachPage({ goals, profile, nutritionHistory, weightEntries, trainingHistory, displaySettings, onOpenPlan }: { goals: Goals; profile: BodyProfile; nutritionHistory: NutritionDay[]; weightEntries: WeightEntry[]; trainingHistory: Workout[]; displaySettings: MucipesDisplaySettings; onOpenPlan: () => void }) {
  const analysis = useMemo(() => buildInsights({ goals, profile, nutritionHistory, weightEntries, trainingHistory, display: displaySettings }), [goals, profile, nutritionHistory, weightEntries, trainingHistory, displaySettings]);
  const insights = analysis.insights;
  const priority = insights[0];
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askCoach(customQuestion?: string) {
    const prompt = (customQuestion ?? question).trim();
    if (!prompt) return;
    setQuestion(prompt);
    setLoading(true);
    setAnswer("");
    const context = {
      goals,
      profile,
      weeklySummary: analysis.stats,
      nutrition: nutritionHistory.slice(-30),
      weights: weightEntries.slice(-30),
      training: trainingHistory.slice(0, 20).map((w) => ({ name: w.name, finishedAt: w.finishedAt, durationSeconds: w.durationSeconds, exercises: w.exercises.map((e) => ({ name: e.exerciseName, sets: e.sets.map((s) => ({ weight: s.weight, reps: s.reps })) })) })),
    };
    try {
      const response = await fetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: prompt, context }) });
      const data = await response.json();
      if (response.ok && typeof data.answer === "string") setAnswer(data.answer);
      else setAnswer(localFallback(prompt, insights));
    } catch {
      setAnswer(localFallback(prompt, insights));
    } finally {
      setLoading(false);
    }
  }

  const summary = analysis.stats;
  return <div className="space-y-5">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">CYG Coach</p><h1 className="mt-1 text-4xl font-black tracking-tight">Your data, interpreted.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Coach prioritizes the signal that matters most from your logged training, nutrition and progress. You decide whether to apply any change.</p></div><button onClick={onOpenPlan} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black">Open guided plan</button></header>

    <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 sm:p-6"><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Coach priority</p><h2 className="mt-2 text-2xl font-black text-slate-950">{priority.title}</h2><p className="mt-2 text-lg font-bold text-slate-800">{priority.detail}</p><p className="mt-2 text-sm leading-6 text-slate-600">{priority.action}</p></section>

    <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <SummaryStat label="Workouts" value={summary.weeklyWorkouts} />
      <SummaryStat label="New PRs" value={summary.prs} />
      <SummaryStat label="Protein avg" value={summary.avgProtein === null ? "—" : `${summary.avgProtein} g`} />
      <SummaryStat label="Calorie adherence" value={summary.calorieAdherence === null ? "—" : `${summary.calorieAdherence}%`} />
      <SummaryStat label="7d weight" value={summary.weightChange === null ? "—" : `${summary.weightChange > 0 ? "+" : ""}${formatWeight(summary.weightChange, displaySettings.units)}`} />
    </section>

    {insights.length > 1 && <section className="grid gap-3 md:grid-cols-3">{insights.slice(1).map((insight) => <article key={insight.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-emerald-600">{insight.title}</p><p className="mt-3 font-black text-slate-950">{insight.detail}</p><p className="mt-2 text-sm leading-6 text-slate-500">{insight.action}</p></article>)}</section>}

    <section className="rounded-[2rem] border border-emerald-200 bg-white p-5 text-slate-950 shadow-sm sm:p-6"><p className="text-xs font-black uppercase tracking-widest text-emerald-600">Ask about your data</p><h2 className="mt-2 text-2xl font-black">What do you want to understand?</h2><div className="mt-3 flex flex-wrap gap-2">{["How was my week?","Am I close to my calorie target?","Is my training frequency on track?"].map((prompt)=><button key={prompt} type="button" disabled={loading} onClick={()=>void askCoach(prompt)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 hover:border-emerald-300 hover:bg-emerald-50">{prompt}</button>)}</div><div className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void askCoach(); }} placeholder="Ask CYG Coach…" className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none focus:border-emerald-400"/><button onClick={() => void askCoach()} disabled={loading || !question.trim()} className="rounded-2xl bg-emerald-500 px-5 py-3 font-black text-white disabled:opacity-50">{loading ? "Thinking…" : "Ask"}</button></div>{answer && <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-slate-700">{answer}</div>}</section>
  </div>;
}

function SummaryStat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-xl font-black text-slate-900">{value}</p></div>;
}

function localFallback(question: string, insights: Insight[]) {
  const q = question.toLowerCase();
  const relevant = insights.find((item) => q.includes("protein") ? item.title.includes("Protein") : q.includes("calor") || q.includes("eat") ? item.title.includes("Energy") : q.includes("weight") || q.includes("tež") ? item.title.includes("Weight") : q.includes("workout") || q.includes("train") || q.includes("bench") || q.includes("press") || q.includes("week") ? item.title.includes("Training") : false) || insights[0];
  return `${relevant.detail}\n\n${relevant.action}\n\nThis is based on the data currently logged in CYG. More recent sessions, nutrition days and weigh-ins make the trend more representative.`;
}
