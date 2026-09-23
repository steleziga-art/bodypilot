export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Biceps"
  | "Triceps"
  | "Quads"
  | "Hamstrings"
  | "Glutes"
  | "Calves"
  | "Abs"
  | "Other";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  custom?: boolean;
};

export type WorkoutSet = {
  id: string;
  weight: number;
  reps: number;
  rir: number | null;
  completed: boolean;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
};

export type ActiveWorkout = {
  id: string;
  name: string;
  startedAt: string;
  exercises: WorkoutExercise[];
};

export type SavedWorkoutExercise = {
  exerciseId: string;
  exerciseName: string;
  defaultSets: number;
};

export type SavedWorkout = {
  id: string;
  name: string;
  exercises: SavedWorkoutExercise[];
  createdAt: string;
};

export type WorkoutHistoryEntry = {
  id: string;
  name: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  estimatedCalories?: number;
  exercises: WorkoutExercise[];
};
