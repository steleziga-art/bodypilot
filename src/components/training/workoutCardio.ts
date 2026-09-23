import type { WorkoutExercise } from "./types";

// Exercise names in the built-in catalog are classified explicitly. Generic
// "walk", "row" or "bike" matching would misclassify loaded carries and rows.
const endurance = new Set([
  "Air Bike", "Elliptical Trainer", "Incline Treadmill Walk", "Rowing Machine",
  "Running", "Stair Climber", "Stationary Bike", "Treadmill Running", "Walking",
  "Outdoor Run", "Outdoor Walk", "Outdoor Cycling", "Fan Bike", "Assault Bike",
  "Cycling", "Swimming", "Ski Erg", "Step Machine", "Exercise Bike",
]);
const timed = new Set([
  "Bird Dog Hold", "Chin Tuck Hold", "Clamshell Hold", "Dead Bug Hold",
  "Glute Bridge Hold", "Glute Kickback Hold", "High Plank", "Hollow Body Hold",
  "Plank", "Reverse Plank", "Reverse Tabletop Hold", "Side-Lying Hip Abduction Hold",
  "Side-Lying Hip Adduction Hold", "Side Plank", "Side Plank Leg Lift Hold",
  "Single-Leg Glute Bridge Hold", "TRX Plank", "TRX Side Plank",
  "Bear Crawl", "Battle Ropes", "High Knees", "Jump Rope", "Jumping Jacks", "Mountain Climbers",
]);
const loadedCarry = new Set([
  "Dumbbell Overhead Carry", "Double Dumbbell Overhead Carry", "Double Kettlebell Overhead Carry",
  "Dumbbell Farmer's Walk", "Kettlebell Farmer's Walk", "Kettlebell Overhead Carry", "Suitcase Carry",
]);

export type ExerciseEntryKind = "strength" | "endurance" | "timed" | "carry";
export function exerciseEntryKind(name: string): ExerciseEntryKind {
  if (endurance.has(name) || /^(?:indoor|outdoor) (?:run|walk|cycling|bike)$/i.test(name)) return "endurance";
  if (timed.has(name)) return "timed";
  if (loadedCarry.has(name)) return "carry";
  return "strength";
}
export const cardioNames = ["Treadmill Running", "Incline Treadmill Walk", "Running", "Walking", "Stationary Bike", "Outdoor Cycling", "Air Bike", "Elliptical Trainer", "Rowing Machine", "Stair Climber"];
export const isCardioExercise = (name: string) => exerciseEntryKind(name) !== "strength";
export const hasDistance = (name: string) => exerciseEntryKind(name) === "endurance" || exerciseEntryKind(name) === "carry";

export function cardioCalories(exercise: WorkoutExercise, bodyWeight: number) {
  const activity = exercise.cardio;
  if (!activity || activity.durationMinutes <= 0) return 0;
  if (Number.isFinite(activity.calories) && activity.calories !== undefined) return Math.max(0, Math.round(activity.calories));
  const name = exercise.exerciseName.toLowerCase();
  const kind = exerciseEntryKind(exercise.exerciseName);
  const baseMet = kind === "timed" ? 3 : kind === "carry" ? 4.5 : /walk/.test(name) ? 3.5 : /fan bike|air bike|rowing/.test(name) ? 7 : /run|treadmill/.test(name) ? 8 : /cycl|bike/.test(name) ? 6 : 5;
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
