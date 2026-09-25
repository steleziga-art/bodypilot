import type { Exercise, MuscleGroup, WorkoutExercise, WorkoutHistoryEntry } from "./types";

function clean(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const aliases: Record<string, string> = {
  "t bar row": "t bar row",
  "tbar row": "t bar row",
  "t barbell row": "t bar row",
  "barbell bench press": "bench press barbell",
  "bench press barbell": "bench press barbell",
  "flat barbell bench press": "bench press barbell",
  "flat bench press": "bench press barbell",
  "lat pull down": "lat pulldown",
  "cable lat pulldown": "lat pulldown",
  "pec deck": "chest fly machine",
  "machine chest fly": "chest fly machine",
  "smith incline bench press": "smith machine incline bench press",
  "lever incline chest press": "incline chest press machine",
  "lever chest press": "chest press machine",
  "lever decline chest press": "decline chest press machine",
  "lever seated fly": "chest fly machine",
  "lever seated reverse fly": "rear delt fly machine",
  "cable seated chest fly": "cable crossover",
  "bar lateral pulldown": "lat pulldown",
  "lever lateral pulldown": "lat pulldown",
  "cable lateral pulldown with v bar": "lat pulldown",
  "cable wide neutral grip pulldown": "lat pulldown",
  "band kneeling one arm pulldown": "lat pulldown",
  "lever low row": "seated cable row",
  "straight back seated row": "seated cable row",
  "cable single arm high row with chest support": "single arm cable row",
  "cable seated one arm alternate row": "single arm cable row",
  "cable one arm tricep pushdown": "triceps pushdown",
  "triceps pushdown": "triceps pushdown",
  "triceps dip": "triceps dips",
  "lever triceps dip": "triceps dips",
  "lever seated dip": "triceps dips",
  "overhead triceps extension": "overhead tricep extension",
  "cable one arm biceps curl": "cable curl",
  "cable standing reverse grip curl": "reverse curl",
  "dumbbell incline biceps curl": "incline dumbbell curl",
  "dumbbell seated alternate biceps curl": "dumbbell curl",
  "dumbbell alternate seated hammer curl": "hammer curl",
  "dumbbell incline alternate hammer curl": "hammer curl",
  "dumbbell standing alternate hammer curl and press": "arnold press",
  "seated shoulder press": "shoulder press dumbbell",
  "lever military press": "shoulder press machine",
  "dumbbell seated lateral raise": "lateral raise",
  "seated lateral raise": "lateral raise",
  "cable one arm lateral raise": "lateral raise",
  "lever lateral raise": "lateral raise",
  "standing cross over high reverse fly": "rear delt fly",
  "cable standing cross over high reverse fly": "rear delt fly",
  "cable rear drive": "rear delt fly",
  "lever total abdominal crunch": "ab crunch machine",
  "captains chair straight leg raise": "captains chair leg raise",
  "hanging leg hip raise": "hanging leg raise",
  "45 degree hyperextension": "back extension",
  "barbell straight leg deadlift": "stiff leg deadlift",
  "full squat": "squat",
  "lever seated hip abduction": "hip abduction machine",
  "one leg floor calf raise": "single leg calf raise",
  "tibialis anterior": "tibialis raise",
};

const muscleRules: Array<[RegExp, MuscleGroup]> = [
  [/(lateral raise|rear delt|front raise|shoulder press|military press|arnold press|upright row)/, "Shoulders"],
  [/(triceps|pushdown|skullcrusher|jm bench|overhead tricep|tricep extension|triceps dip)/, "Triceps"],
  [/(curl|preacher|hammer curl|reverse curl)/, "Biceps"],
  [/((bench)|(chest press)|(chest fly)|(pec deck)|(crossover)|(push up))/ , "Chest"],
  [/(pulldown|pull up|row|hyperextension|back extension)/, "Back"],
  [/(squat|leg press|leg extension|lunge|step up|hack squat)/, "Quads"],
  [/(leg curl|stiff leg|romanian deadlift|good morning|glute ham)/, "Hamstrings"],
  [/(hip thrust|glute bridge|abduction|kickback)/, "Glutes"],
  [/(calf|tibialis)/, "Calves"],
  [/(crunch|leg raise|v up|plank|ab wheel|russian twist|dead bug|captains chair)/, "Abs"],
];

export function exerciseKey(name: string) {
  const normalized = clean(name);
  return aliases[normalized] || normalized;
}

export function inferMuscleGroup(name: string): MuscleGroup {
  const key = exerciseKey(name);
  for (const [pattern, muscle] of muscleRules) {
    if (pattern.test(key)) return muscle;
  }
  return "Other";
}

export function resolveExercise(name: string, exercises: Exercise[]) {
  const key = exerciseKey(name);
  const exact = exercises.filter((exercise) => exerciseKey(exercise.name) === key);
  if (exact.length === 1) return exact[0];

  const words = key.split(" ").sort().join(" ");
  const reordered = exercises.filter(
    (exercise) => exerciseKey(exercise.name).split(" ").sort().join(" ") === words
  );
  if (reordered.length === 1) return reordered[0];
  return undefined;
}

export function matchesLoggedExercise(logged: Pick<WorkoutExercise, "exerciseId" | "exerciseName">, id: string, name: string) {
  if (!logged.exerciseName?.trim() || !name.trim()) return logged.exerciseId === id;
  const canonical = (value: string) => exerciseKey(value).split(" ").sort().join(" ");
  return canonical(logged.exerciseName) === canonical(name);
}

export function historyDurationSeconds(workout: WorkoutHistoryEntry) {
  if (!workout.id.startsWith("lyfta-")) return workout.durationSeconds;
  const totalSets = workout.exercises.reduce(
    (sum, exercise) => sum + (exercise.cardio ? 0 : exercise.sets.filter((set) => set.reps > 0).length),
    0
  );
  const cardioSeconds = workout.exercises.reduce(
    (sum, exercise) => sum + (exercise.cardio?.durationMinutes || 0) * 60,
    0
  );
  return Math.max(8 * 60, cardioSeconds + 3 * 60 + totalSets * 150 + workout.exercises.length * 90);
}
