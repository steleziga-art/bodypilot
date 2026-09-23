import type { WorkoutExercise } from "./types";

export const cardioNames = ["Treadmill Running", "Incline Treadmill Walk", "Outdoor Run", "Outdoor Walk", "Stationary Bike", "Outdoor Cycling", "Fan Bike", "Elliptical Trainer", "Rowing Machine"];

export function isCardioExercise(name: string) {
  return /treadmill|fan bike|assault bike|cycling|stationary bike|elliptical|rowing machine|outdoor run|outdoor walk|\bcardio\b/i.test(name);
}

export function cardioCalories(exercise: WorkoutExercise, bodyWeight: number) {
  const activity = exercise.cardio;
  if (!activity || activity.durationMinutes <= 0) return 0;
  if (Number.isFinite(activity.calories) && activity.calories !== undefined) return Math.max(0, Math.round(activity.calories));
  const name = exercise.exerciseName.toLowerCase();
  const baseMet = /walk/.test(name) ? 3.5 : /fan bike|rowing/.test(name) ? 7 : /run|treadmill/.test(name) ? 8 : /cycl|bike/.test(name) ? 6 : 5;
  const multiplier = activity.intensity === "easy" ? 0.8 : activity.intensity === "hard" ? 1.25 : 1;
  return Math.round(baseMet * multiplier * 3.5 * bodyWeight / 200 * Math.min(360, activity.durationMinutes));
}

export function getWorkoutWeight() {
  try {
    const profile = JSON.parse(localStorage.getItem("bodypilot-profile") || "{}");
    if (Number.isFinite(profile.weight) && profile.weight > 0) return profile.weight as number;
  } catch {}
  return 80;
}
