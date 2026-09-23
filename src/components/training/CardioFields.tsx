"use client";
import type { WorkoutExercise } from "./types";
import { cardioCalories, getWorkoutWeight, exerciseEntryKind, hasDistance } from "./workoutCardio";

export default function CardioFields({ exercise, onChange, units }: { exercise: WorkoutExercise; onChange: (next: WorkoutExercise) => void; units: "metric" | "imperial" }) {
  const cardio: NonNullable<WorkoutExercise["cardio"]> = exercise.cardio || { durationMinutes: 0, distanceKm: 0, intensity: "moderate" };
  const kind = exerciseEntryKind(exercise.exerciseName);
  const set = (patch: Partial<NonNullable<WorkoutExercise["cardio"]>>) => onChange({ ...exercise, cardio: { ...cardio, ...patch }, sets: [] });
  return <div className="cyg-cardio-fields">
    <label>Time ({kind === "timed" ? "seconds" : "min"})<input aria-label={`${exercise.exerciseName} time`} type="number" min="0" max={kind === "timed" ? "21600" : "360"} step="1" value={cardio.durationMinutes ? Number((cardio.durationMinutes * (kind === "timed" ? 60 : 1)).toFixed(1)) : ""} onChange={e => set({ durationMinutes: Math.max(0, (Number(e.target.value) || 0) / (kind === "timed" ? 60 : 1)) })} /></label>
    {hasDistance(exercise.exerciseName) && <label>Distance ({units === "imperial" ? "mi" : "km"})<input aria-label={`${exercise.exerciseName} distance`} type="number" min="0" step="0.01" value={cardio.distanceKm ? Number((cardio.distanceKm * (units === "imperial" ? 0.621371 : 1)).toFixed(2)) : ""} onChange={e => set({ distanceKm: Math.max(0, (Number(e.target.value) || 0) / (units === "imperial" ? 0.621371 : 1)) })} /></label>}
    {kind === "carry" && <label>Load ({units === "imperial" ? "lb" : "kg"})<input type="number" min="0" step="0.5" value={cardio.loadKg ? Number((cardio.loadKg * (units === "imperial" ? 2.2046226218 : 1)).toFixed(1)) : ""} onChange={e => set({ loadKg: Math.max(0, (Number(e.target.value) || 0) / (units === "imperial" ? 2.2046226218 : 1)) })} /></label>}
    <label>Effort<select value={cardio.intensity || "moderate"} onChange={e => set({ intensity: e.target.value as "easy" | "moderate" | "hard" })}><option value="easy">Easy</option><option value="moderate">Moderate</option><option value="hard">Hard</option></select></label>
    <label>Tracker kcal (optional)<input type="number" min="0" step="1" value={cardio.calories ?? ""} onChange={e => set({ calories: e.target.value === "" ? undefined : Math.max(0, Number(e.target.value) || 0) })} /></label>
    <p className="cyg-cardio-estimate">≈ {cardioCalories({ ...exercise, cardio }, getWorkoutWeight())} kcal {cardio.calories === undefined ? "estimated" : "from tracker"}</p>
  </div>;
}
