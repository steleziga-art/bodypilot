import type { Exercise, WorkoutExercise, WorkoutHistoryEntry } from "./types";

function clean(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

const aliases: Record<string, string> = {
  "t bar row": "t bar row", "tbar row": "t bar row", "t barbell row": "t bar row",
  "barbell bench press": "bench press barbell", "bench press barbell": "bench press barbell",
  "flat barbell bench press": "bench press barbell", "flat bench press": "bench press barbell",
  "lat pull down": "lat pulldown", "cable lat pulldown": "lat pulldown",
  "pec deck": "chest fly machine", "machine chest fly": "chest fly machine",
};

export function exerciseKey(name: string) {
  const normalized = clean(name);
  return aliases[normalized] || normalized;
}

export function resolveExercise(name: string, exercises: Exercise[]) {
  const key = exerciseKey(name);
  const exact = exercises.filter((exercise) => exerciseKey(exercise.name) === key);
  if (exact.length === 1) return exact[0];

  // Only accept a partial match when it is long and unambiguous; avoid merging
  // distinct movements such as flat/incline press or cable/machine fly.
  if (key.length >= 12) {
    const partial = exercises.filter((exercise) => {
      const candidate = exerciseKey(exercise.name);
      return candidate.startsWith(key) || key.startsWith(candidate);
    });
    if (partial.length === 1) return partial[0];
  }
  return undefined;
}

export function matchesLoggedExercise(logged: Pick<WorkoutExercise, "exerciseId" | "exerciseName">, id: string, name: string) {
  return logged.exerciseId === id || exerciseKey(logged.exerciseName) === exerciseKey(name);
}

export function historyDurationSeconds(workout: WorkoutHistoryEntry) {
  if (!workout.id.startsWith("lyfta-")) return workout.durationSeconds;
  const totalSets = workout.exercises.reduce((sum, exercise) => sum + (exercise.cardio ? 0 : exercise.sets.filter((set) => set.reps > 0).length), 0);
  const cardioSeconds = workout.exercises.reduce((sum, exercise) => sum + (exercise.cardio?.durationMinutes || 0) * 60, 0);
  return Math.max(8 * 60, cardioSeconds + 3 * 60 + totalSets * 150 + workout.exercises.length * 90);
}
