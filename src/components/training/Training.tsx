"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultExercises } from "./exercises";
import { getExerciseVisual } from "./exerciseVisuals";
import type {
  ActiveWorkout,
  Exercise,
  MuscleGroup,
  SavedWorkout,
  WorkoutExercise,
  WorkoutHistoryEntry,
  WorkoutSet,
} from "./types";

type TrainingTab =
  | "workout"
  | "saved"
  | "history"
  | "exercises";

const muscleGroups: MuscleGroup[] = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Abs",
  "Other",
];

const ACTIVE_KEY = "bodypilot-active-workout";
const SAVED_KEY = "bodypilot-saved-workouts";
const HISTORY_KEY = "bodypilot-workout-history";
const CUSTOM_EXERCISES_KEY = "bodypilot-custom-exercises";
const WORKOUT_NOTES_KEY = "bodypilot-workout-notes";
const EXERCISE_NOTES_KEY = "bodypilot-exercise-notes";

function exerciseBadge(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}


function ExerciseMedia({
  name,
  compact = false,
}: {
  name: string;
  compact?: boolean;
}) {
  const visual = getExerciseVisual(name);

  if (!visual) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 ${
          compact ? "h-14 w-14" : "min-h-[210px] w-full"
        }`}
      >
        <div className="text-center">
          <div
            className={`mx-auto flex items-center justify-center rounded-full border border-zinc-300 bg-white font-black tracking-wider text-emerald-600 ${
              compact ? "h-10 w-10 text-[10px]" : "h-20 w-20 text-xl"
            }`}
          >
            {exerciseBadge(name)}
          </div>

          {!compact && (
            <p className="mt-3 text-xs text-zinc-400">
              Exercise illustration coming soon
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white ${
        compact ? "h-14 w-14" : "w-full"
      }`}
    >
      <img
        src={visual.image}
        alt={visual.alt}
        loading="lazy"
        className={`h-full w-full bg-white ${
          compact
            ? "object-cover"
            : "min-h-[210px] max-h-[360px] object-contain"
        }`}
      />
    </div>
  );
}

function exerciseInstructions(name: string) {
  const n = name.toLowerCase();

  if (n.includes("press")) {
    return "Control the lowering phase, keep a stable position and press through a comfortable full range of motion.";
  }

  if (n.includes("row")) {
    return "Keep your torso stable, pull with the elbows and control the weight back to the start.";
  }

  if (n.includes("curl")) {
    return "Keep the upper arm controlled, curl without swinging and lower the weight slowly.";
  }

  if (n.includes("raise")) {
    return "Use controlled reps, avoid momentum and stop at a comfortable shoulder position.";
  }

  if (n.includes("squat")) {
    return "Brace before each rep, keep a stable foot position and use a controlled depth you can maintain.";
  }

  if (n.includes("deadlift") || n.includes("rdl")) {
    return "Brace the trunk, keep the load close and hinge through the hips while maintaining control.";
  }

  return "Use a stable setup, controlled tempo and a comfortable full range of motion.";
}

export default function Training() {
  const [activeTab, setActiveTab] =
    useState<TrainingTab>("workout");

  const [activeWorkout, setActiveWorkout] =
    useState<ActiveWorkout | null>(null);

  const [savedWorkouts, setSavedWorkouts] =
    useState<SavedWorkout[]>([]);

  const [history, setHistory] =
    useState<WorkoutHistoryEntry[]>([]);

  const [customExercises, setCustomExercises] =
    useState<Exercise[]>([]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const active = localStorage.getItem(ACTIVE_KEY);
      const saved = localStorage.getItem(SAVED_KEY);
      const workoutHistory =
        localStorage.getItem(HISTORY_KEY);
      const custom =
        localStorage.getItem(CUSTOM_EXERCISES_KEY);

      if (active) {
        setActiveWorkout(JSON.parse(active));
      }

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setSavedWorkouts(parsed);
        }
      }

      if (workoutHistory) {
        const parsed = JSON.parse(workoutHistory);

        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }

      if (custom) {
        const parsed = JSON.parse(custom);

        if (Array.isArray(parsed)) {
          setCustomExercises(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Could not load training data:",
        error
      );
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    if (activeWorkout) {
      localStorage.setItem(
        ACTIVE_KEY,
        JSON.stringify(activeWorkout)
      );
    } else {
      localStorage.removeItem(ACTIVE_KEY);
    }

    localStorage.setItem(
      SAVED_KEY,
      JSON.stringify(savedWorkouts)
    );

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );

    localStorage.setItem(
      CUSTOM_EXERCISES_KEY,
      JSON.stringify(customExercises)
    );
  }, [
    activeWorkout,
    savedWorkouts,
    history,
    customExercises,
    loaded,
  ]);

  const allExercises = useMemo(
    () => [...defaultExercises, ...customExercises],
    [customExercises]
  );

  function startEmptyWorkout() {
    if (activeWorkout) {
      return;
    }

    setActiveWorkout({
      id: makeId(),
      name: "Workout",
      startedAt: new Date().toISOString(),
      exercises: [],
    });
  }

  function startSavedWorkout(
    savedWorkout: SavedWorkout
  ) {
    if (activeWorkout) {
      return;
    }

    const exercises: WorkoutExercise[] =
      savedWorkout.exercises.map((exercise) => ({
        id: makeId(),
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        sets: Array.from(
          { length: exercise.defaultSets },
          () => createEmptySet()
        ),
      }));

    setActiveWorkout({
      id: makeId(),
      name: savedWorkout.name,
      startedAt: new Date().toISOString(),
      exercises,
    });

    setActiveTab("workout");
  }

  function finishWorkout() {
    if (!activeWorkout) {
      return;
    }

    if (activeWorkout.exercises.length === 0) {
      const confirmed = window.confirm(
        "This workout has no exercises. Discard it?"
      );

      if (confirmed) {
        setActiveWorkout(null);
      }

      return;
    }

    const finishedAt = new Date();

    const historyEntry: WorkoutHistoryEntry = {
      id: activeWorkout.id,
      name: activeWorkout.name.trim() || "Workout",
      startedAt: activeWorkout.startedAt,
      finishedAt: finishedAt.toISOString(),
      durationSeconds: Math.max(
        0,
        Math.round(
          (finishedAt.getTime() -
            new Date(
              activeWorkout.startedAt
            ).getTime()) /
            1000
        )
      ),
      exercises: activeWorkout.exercises.map(
        (exercise) => ({
          ...exercise,
          sets: exercise.sets.filter(
            (set) =>
              set.completed ||
              set.weight > 0 ||
              set.reps > 0
          ),
        })
      ),
    };

    setHistory((current) => [
      historyEntry,
      ...current,
    ]);

    setActiveWorkout(null);
    setActiveTab("history");
  }

  function discardWorkout() {
    if (!activeWorkout) {
      return;
    }

    const confirmed = window.confirm(
      "Discard the current workout?"
    );

    if (confirmed) {
      setActiveWorkout(null);
    }
  }

  function saveCurrentWorkout() {
    if (
      !activeWorkout ||
      activeWorkout.exercises.length === 0
    ) {
      return;
    }

    const name = window.prompt(
      "Saved workout name:",
      activeWorkout.name === "Workout"
        ? ""
        : activeWorkout.name
    );

    if (!name?.trim()) {
      return;
    }

    const newSavedWorkout: SavedWorkout = {
      id: makeId(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      exercises: activeWorkout.exercises.map(
        (exercise) => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          defaultSets: Math.max(
            exercise.sets.length,
            1
          ),
        })
      ),
    };

    setSavedWorkouts((current) => [
      ...current,
      newSavedWorkout,
    ]);
  }

  function deleteSavedWorkout(id: string) {
    setSavedWorkouts((current) =>
      current.filter(
        (workout) => workout.id !== id
      )
    );
  }

  function deleteHistoryEntry(id: string) {
    const confirmed = window.confirm(
      "Delete this workout from history?"
    );

    if (!confirmed) {
      return;
    }

    setHistory((current) =>
      current.filter(
        (workout) => workout.id !== id
      )
    );
  }

  function addCustomExercise(
    exercise: Exercise
  ) {
    setCustomExercises((current) => [
      ...current,
      exercise,
    ]);
  }

  function deleteCustomExercise(id: string) {
    setCustomExercises((current) =>
      current.filter(
        (exercise) => exercise.id !== id
      )
    );
  }

  return (
    <>
      <div>
        <p className="text-sm font-semibold tracking-widest text-emerald-600">
          TRAINING
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Training
        </h1>

        <p className="mt-2 text-zinc-400">
          Build workouts, track every set and
          see your training history.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-zinc-200 bg-white p-2">
        <TabButton
          name="Workout"
          tab="workout"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <TabButton
          name="Saved Workouts"
          tab="saved"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <TabButton
          name="History"
          tab="history"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <TabButton
          name="Exercises"
          tab="exercises"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {activeTab === "workout" && (
        <WorkoutTab
          activeWorkout={activeWorkout}
          setActiveWorkout={setActiveWorkout}
          exercises={allExercises}
          history={history}
          savedWorkouts={savedWorkouts}
          startEmptyWorkout={startEmptyWorkout}
          startSavedWorkout={startSavedWorkout}
          finishWorkout={finishWorkout}
          discardWorkout={discardWorkout}
          saveCurrentWorkout={saveCurrentWorkout}
        />
      )}

      {activeTab === "saved" && (
        <SavedWorkoutsTab
          savedWorkouts={savedWorkouts}
          activeWorkout={activeWorkout}
          startSavedWorkout={startSavedWorkout}
          deleteSavedWorkout={deleteSavedWorkout}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "history" && (
        <HistoryTab
          history={history}
          deleteHistoryEntry={deleteHistoryEntry}
        />
      )}

      {activeTab === "exercises" && (
        <ExercisesTab
          exercises={allExercises}
          customExercises={customExercises}
          addCustomExercise={addCustomExercise}
          deleteCustomExercise={
            deleteCustomExercise
          }
        />
      )}
    </>
  );
}

function WorkoutTab({
  activeWorkout,
  setActiveWorkout,
  exercises,
  history,
  savedWorkouts,
  startEmptyWorkout,
  startSavedWorkout,
  finishWorkout,
  discardWorkout,
  saveCurrentWorkout,
}: {
  activeWorkout: ActiveWorkout | null;
  setActiveWorkout: React.Dispatch<
    React.SetStateAction<ActiveWorkout | null>
  >;
  exercises: Exercise[];
  history: WorkoutHistoryEntry[];
  savedWorkouts: SavedWorkout[];
  startEmptyWorkout: () => void;
  startSavedWorkout: (
    workout: SavedWorkout
  ) => void;
  finishWorkout: () => void;
  discardWorkout: () => void;
  saveCurrentWorkout: () => void;
}) {
  const [showExercisePicker, setShowExercisePicker] =
    useState(false);

  const [search, setSearch] = useState("");

  const [muscleFilter, setMuscleFilter] =
    useState<MuscleGroup | "All">("All");

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [workoutNote, setWorkoutNote] =
    useState("");

  const [showRirByExercise, setShowRirByExercise] =
    useState<Record<string, boolean>>({});

  const [openDetailsByExercise, setOpenDetailsByExercise] =
    useState<Record<string, boolean>>({});

  const [exerciseNotes, setExerciseNotes] =
    useState<Record<string, string>>({});


  useEffect(() => {
    if (!activeWorkout) {
      setElapsedSeconds(0);
      return;
    }

    const updateTimer = () => {
      const startedAt = new Date(
        activeWorkout.startedAt
      ).getTime();

      setElapsedSeconds(
        Math.max(
          0,
          Math.floor(
            (Date.now() - startedAt) / 1000
          )
        )
      );
    };

    updateTimer();

    const interval = window.setInterval(
      updateTimer,
      1000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [activeWorkout]);

  useEffect(() => {
    try {
      const savedNotes =
        localStorage.getItem(EXERCISE_NOTES_KEY);

      if (savedNotes) {
        const parsed = JSON.parse(savedNotes);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          setExerciseNotes(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Could not load exercise notes:",
        error
      );
    }
  }, []);

  useEffect(() => {
    if (!activeWorkout) {
      setWorkoutNote("");
      return;
    }

    try {
      const savedWorkoutNotes =
        localStorage.getItem(WORKOUT_NOTES_KEY);

      if (!savedWorkoutNotes) {
        setWorkoutNote("");
        return;
      }

      const parsed = JSON.parse(
        savedWorkoutNotes
      ) as Record<string, string>;

      setWorkoutNote(
        parsed[activeWorkout.id] ?? ""
      );
    } catch (error) {
      console.error(
        "Could not load workout note:",
        error
      );
    }
  }, [activeWorkout?.id]);

  function saveWorkoutNote(value: string) {
    setWorkoutNote(value);

    if (!activeWorkout) {
      return;
    }

    try {
      const saved =
        localStorage.getItem(WORKOUT_NOTES_KEY);

      const parsed: Record<string, string> =
        saved ? JSON.parse(saved) : {};

      if (value.trim()) {
        parsed[activeWorkout.id] = value;
      } else {
        delete parsed[activeWorkout.id];
      }

      localStorage.setItem(
        WORKOUT_NOTES_KEY,
        JSON.stringify(parsed)
      );
    } catch (error) {
      console.error(
        "Could not save workout note:",
        error
      );
    }
  }

  function saveExerciseNote(
    exerciseId: string,
    value: string
  ) {
    const next = {
      ...exerciseNotes,
      [exerciseId]: value,
    };

    if (!value.trim()) {
      delete next[exerciseId];
    }

    setExerciseNotes(next);

    localStorage.setItem(
      EXERCISE_NOTES_KEY,
      JSON.stringify(next)
    );
  }

  if (!activeWorkout) {
    return (
      <div className="mt-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-8">
          <p className="text-sm font-semibold tracking-widest text-emerald-600">
            READY TO TRAIN
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Start a workout
          </h2>

          <p className="mt-2 max-w-2xl text-zinc-400">
            Start from scratch or use one of
            your saved workout templates.
          </p>

          <button
            onClick={startEmptyWorkout}
            className="mt-7 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400"
          >
            + Start empty workout
          </button>
        </section>

        {savedWorkouts.length > 0 && (
          <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-7">
            <h2 className="text-2xl font-semibold">
              Saved workouts
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {savedWorkouts.map((workout) => (
                <button
                  key={workout.id}
                  onClick={() =>
                    startSavedWorkout(workout)
                  }
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-left transition hover:border-emerald-400"
                >
                  <p className="font-semibold">
                    {workout.name}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {workout.exercises.length}{" "}
                    exercises
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  const filteredExercises = exercises.filter(
    (exercise) => {
      const matchesSearch =
        exercise.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesMuscle =
        muscleFilter === "All" ||
        exercise.muscleGroup === muscleFilter;

      return matchesSearch && matchesMuscle;
    }
  );

  function changeWorkoutName(name: string) {
    setActiveWorkout((current) =>
      current
        ? {
            ...current,
            name,
          }
        : current
    );
  }

  function addExercise(exercise: Exercise) {
    const newExercise: WorkoutExercise = {
      id: makeId(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [createEmptySet()],
    };

    setActiveWorkout((current) =>
      current
        ? {
            ...current,
            exercises: [
              ...current.exercises,
              newExercise,
            ],
          }
        : current
    );

    setShowExercisePicker(false);
    setSearch("");
  }

  function removeExercise(
    workoutExerciseId: string
  ) {
    setActiveWorkout((current) =>
      current
        ? {
            ...current,
            exercises:
              current.exercises.filter(
                (exercise) =>
                  exercise.id !==
                  workoutExerciseId
              ),
          }
        : current
    );
  }

  function addSet(
    workoutExerciseId: string
  ) {
    setActiveWorkout((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        exercises: current.exercises.map(
          (exercise) => {
            if (
              exercise.id !== workoutExerciseId
            ) {
              return exercise;
            }

            const previous =
              exercise.sets[
                exercise.sets.length - 1
              ];

            const newSet: WorkoutSet = {
              id: makeId(),
              weight: previous?.weight ?? 0,
              reps: previous?.reps ?? 0,
              rir: previous?.rir ?? null,
              completed: false,
            };

            return {
              ...exercise,
              sets: [...exercise.sets, newSet],
            };
          }
        ),
      };
    });
  }

  function updateSet(
    workoutExerciseId: string,
    setId: string,
    field: "weight" | "reps" | "rir",
    value: string
  ) {
    setActiveWorkout((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        exercises: current.exercises.map(
          (exercise) =>
            exercise.id === workoutExerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map(
                    (set) =>
                      set.id === setId
                        ? {
                            ...set,
                            [field]:
                              field === "rir"
                                ? value === ""
                                  ? null
                                  : Number(value)
                                : value === ""
                                  ? 0
                                  : Number(value),
                          }
                        : set
                  ),
                }
              : exercise
        ),
      };
    });
  }

  function toggleSet(
    workoutExerciseId: string,
    setId: string
  ) {
    setActiveWorkout((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        exercises: current.exercises.map(
          (exercise) =>
            exercise.id === workoutExerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map(
                    (set) => {
                      if (set.id !== setId) {
                        return set;
                      }

                      return {
                        ...set,
                        completed:
                          !set.completed,
                      };
                    }
                  ),
                }
              : exercise
        ),
      };
    });

  }

  function deleteSet(
    workoutExerciseId: string,
    setId: string
  ) {
    setActiveWorkout((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        exercises: current.exercises.map(
          (exercise) =>
            exercise.id === workoutExerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.filter(
                    (set) => set.id !== setId
                  ),
                }
              : exercise
        ),
      };
    });
  }

  return (
    <div className="mt-8">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-200/70">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex-1">
            <p className="text-sm font-semibold tracking-widest text-emerald-600">
              ACTIVE WORKOUT
            </p>

            <input
              value={activeWorkout.name}
              onChange={(event) =>
                changeWorkoutName(
                  event.target.value
                )
              }
              className="mt-2 w-full max-w-xl bg-transparent text-4xl font-black tracking-tight outline-none"
              placeholder="Workout name"
            />

            <p className="mt-2 text-sm text-zinc-500">
              Started{" "}
              {formatTime(
                activeWorkout.startedAt
              )}
            </p>

            <div className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <span className="text-sm font-semibold text-emerald-600">
                WORKOUT TIME
              </span>

              <span className="font-mono text-xl font-bold text-zinc-950">
                {formatLiveDuration(
                  elapsedSeconds
                )}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
              <span className="rounded-lg bg-zinc-50 px-3 py-2">
                {activeWorkout.exercises.length} exercises
              </span>
              <span className="rounded-lg bg-zinc-50 px-3 py-2">
                {activeWorkout.exercises.reduce(
                  (total, item) =>
                    total + item.sets.length,
                  0
                )} sets
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={saveCurrentWorkout}
              className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-semibold transition hover:bg-zinc-100"
            >
              Save as template
            </button>

            <button
              onClick={discardWorkout}
              className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-50"
            >
              Discard
            </button>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
        {activeWorkout.exercises.map(
          (exercise) => {
            const previous = findPreviousExercise(
              history,
              exercise.exerciseId
            );

            return (
              <section
                key={exercise.id}
                className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/70"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 p-6">
                  <div className="flex min-w-0 gap-4">
                    <div className="shrink-0">
                      <ExerciseMedia
                        name={exercise.exerciseName}
                        compact
                      />
                    </div>

                    <div className="min-w-0">
                    <h3 className="text-xl font-semibold">
                      {exercise.exerciseName}
                    </h3>

                    <button
                      onClick={() =>
                        setOpenDetailsByExercise(
                          (current) => ({
                            ...current,
                            [exercise.id]:
                              !current[exercise.id],
                          })
                        )
                      }
                      className="mt-1 text-xs font-semibold text-emerald-600 hover:text-emerald-500"
                    >
                      {openDetailsByExercise[
                        exercise.id
                      ]
                        ? "Hide exercise guide"
                        : "Exercise guide"}
                    </button>

                    <p className="mt-2 text-sm text-zinc-500">
                      {previous
                        ? `Previous: ${previous}`
                        : "No previous performance"}
                    </p>

                    </div>
                  </div>

                  <button
                    onClick={() =>
                      removeExercise(exercise.id)
                    }
                    className="text-sm text-red-400"
                  >
                    Remove
                  </button>
                </div>

                {openDetailsByExercise[
                  exercise.id
                ] && (
                  <div className="border-b border-zinc-200 bg-zinc-50 p-5">
                    <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.9fr)_1.1fr]">
                      <ExerciseMedia
                        name={exercise.exerciseName}
                      />

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                          Instructions
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-700">
                          {exerciseInstructions(
                            exercise.exerciseName
                          )}
                        </p>

                        <p className="mt-4 text-xs text-zinc-500">
                          Visual animation slot ready — real exercise GIFs/images can be connected here without changing the workout logger.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-6">
                  <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(260px,0.85fr)_1.15fr]">
                    <div>
                      <ExerciseMedia
                        name={exercise.exerciseName}
                      />

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() =>
                            setOpenDetailsByExercise(
                              (current) => ({
                                ...current,
                                [exercise.id]: true,
                              })
                            )
                          }
                          className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-emerald-500"
                        >
                          Instructions
                        </button>

                        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
                          {exerciseBadge(
                            exercise.exerciseName
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                        Current exercise
                      </p>
                      <p className="mt-2 text-lg font-bold">
                        {exercise.exerciseName}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {exerciseInstructions(
                          exercise.exerciseName
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`grid gap-2 px-2 text-center text-xs font-semibold uppercase tracking-wide text-zinc-500 ${
                      showRirByExercise[exercise.id]
                        ? "grid-cols-[40px_1.2fr_1fr_1fr_1fr_52px_36px]"
                        : "grid-cols-[40px_1.2fr_1fr_1fr_52px_36px]"
                    }`}
                  >
                    <span>Set</span>
                    <span>Previous</span>
                    <span>kg</span>
                    <span>Reps</span>
                    {showRirByExercise[exercise.id] && (
                      <span>RIR</span>
                    )}
                    <span>Done</span>
                    <span />
                  </div>

                  <div className="mt-2 space-y-2">
                    {exercise.sets.map(
                      (set, index) => (
                        <div
                          key={set.id}
                          className={`grid items-center gap-2 rounded-xl p-2 ${
                            showRirByExercise[exercise.id]
                              ? "grid-cols-[40px_1.2fr_1fr_1fr_1fr_52px_36px]"
                              : "grid-cols-[40px_1.2fr_1fr_1fr_52px_36px]"
                          } ${
                            set.completed
                              ? "border border-emerald-200 bg-emerald-50"
                              : "border border-transparent bg-zinc-50"
                          }`}
                        >
                          <span className="text-center text-sm font-semibold text-zinc-400">
                            {index + 1}
                          </span>

                          <span className="text-center text-xs text-zinc-500">
                            {getPreviousSetText(
                              history,
                              exercise.exerciseId,
                              index
                            )}
                          </span>

                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={
                              set.weight === 0
                                ? ""
                                : set.weight
                            }
                            onChange={(event) =>
                              updateSet(
                                exercise.id,
                                set.id,
                                "weight",
                                event.target.value
                              )
                            }
                            placeholder="kg"
                            className="min-w-0 rounded-lg border border-zinc-200 bg-white p-3 text-center outline-none focus:border-emerald-500"
                          />

                          <input
                            type="number"
                            min="0"
                            value={
                              set.reps === 0
                                ? ""
                                : set.reps
                            }
                            onChange={(event) =>
                              updateSet(
                                exercise.id,
                                set.id,
                                "reps",
                                event.target.value
                              )
                            }
                            placeholder="reps"
                            className="min-w-0 rounded-lg border border-zinc-200 bg-white p-3 text-center outline-none focus:border-emerald-500"
                          />

                          {showRirByExercise[exercise.id] && (
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={
                                set.rir === null
                                  ? ""
                                  : set.rir
                              }
                              onChange={(event) =>
                                updateSet(
                                  exercise.id,
                                  set.id,
                                  "rir",
                                  event.target.value
                                )
                              }
                              placeholder="RIR"
                              className="min-w-0 rounded-lg border border-zinc-200 bg-white p-3 text-center outline-none focus:border-emerald-500"
                            />
                          )}

                          <button
                            onClick={() =>
                              toggleSet(
                                exercise.id,
                                set.id
                              )
                            }
                            title={
                              set.completed &&
                              isPersonalRecord(
                                history,
                                exercise.exerciseId,
                                set
                              )
                                ? "Personal Record"
                                : "Mark set done"
                            }
                            className={`mx-auto flex h-9 min-w-9 items-center justify-center rounded-lg border px-1 text-xs font-bold ${
                              set.completed
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-zinc-300 text-zinc-500"
                            }`}
                          >
                            {set.completed &&
                            isPersonalRecord(
                              history,
                              exercise.exerciseId,
                              set
                            )
                              ? "PR"
                              : "✓"}
                          </button>

                          <button
                            onClick={() =>
                              deleteSet(
                                exercise.id,
                                set.id
                              )
                            }
                            className="text-zinc-400 transition hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <details className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50">
                    <summary className="cursor-pointer px-4 py-3 text-sm text-zinc-500">
                      + Exercise note
                    </summary>

                    <div className="border-t border-zinc-200 p-3">
                      <input
                        value={
                          exerciseNotes[
                            exercise.exerciseId
                          ] ?? ""
                        }
                        onChange={(event) =>
                          saveExerciseNote(
                            exercise.exerciseId,
                            event.target.value
                          )
                        }
                        placeholder="e.g. seat 4, wider grip"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>
                  </details>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() =>
                        addSet(exercise.id)
                      }
                      className="flex-1 rounded-xl border border-zinc-300 py-3 text-sm font-semibold transition hover:bg-zinc-100"
                    >
                      + Add set
                    </button>

                    <button
                      onClick={() =>
                        setShowRirByExercise(
                          (current) => ({
                            ...current,
                            [exercise.id]:
                              !current[exercise.id],
                          })
                        )
                      }
                      className="rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-500 transition hover:text-zinc-950"
                    >
                      {showRirByExercise[exercise.id]
                        ? "Hide RIR"
                        : "+ RIR"}
                    </button>
                  </div>
                </div>
              </section>
            );
          }
        )}
        </div>

        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-5 xl:sticky xl:top-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Exercise Library
              </p>
              <h3 className="mt-1 text-xl font-bold">
                Add exercise
              </h3>
            </div>

            <span className="rounded-full bg-zinc-50 px-3 py-1 text-xs text-zinc-500">
              {filteredExercises.length}
            </span>
          </div>

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search exercises..."
            className="mt-4 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-3 text-sm outline-none focus:border-emerald-500"
          />

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <FilterButton
              name="All"
              active={muscleFilter === "All"}
              onClick={() =>
                setMuscleFilter("All")
              }
            />

            {muscleGroups.map((group) => (
              <FilterButton
                key={group}
                name={group}
                active={
                  muscleFilter === group
                }
                onClick={() =>
                  setMuscleFilter(group)
                }
              />
            ))}
          </div>

          <div className="mt-4 max-h-[560px] space-y-2 overflow-y-auto pr-1">
            {filteredExercises.map(
              (libraryExercise) => (
                <button
                  key={libraryExercise.id}
                  onClick={() =>
                    addExercise(
                      libraryExercise
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left transition hover:border-emerald-400"
                >
                  <div className="shrink-0">
                    <ExerciseMedia
                      name={libraryExercise.name}
                      compact
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {libraryExercise.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {
                        libraryExercise.muscleGroup
                      }
                    </p>
                  </div>

                  <span className="text-lg text-emerald-600">
                    +
                  </span>
                </button>
              )
            )}
          </div>
        </aside>
      </div>

      <button
        onClick={() =>
          setShowExercisePicker(true)
        }
        className="mt-6 w-full rounded-2xl border border-dashed border-zinc-300 p-4 font-semibold text-zinc-400 transition hover:border-emerald-500 hover:bg-white hover:text-zinc-950 xl:hidden"
      >
        + Add exercise
      </button>

      {showExercisePicker && (
        <section className="mt-5 rounded-3xl border border-emerald-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">
              Add exercise
            </h2>

            <button
              onClick={() =>
                setShowExercisePicker(false)
              }
              className="text-zinc-400"
            >
              Close
            </button>
          </div>

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search exercises..."
            className="mt-5 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-4 outline-none focus:border-emerald-500"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <FilterButton
              name="All"
              active={
                muscleFilter === "All"
              }
              onClick={() =>
                setMuscleFilter("All")
              }
            />

            {muscleGroups.map((group) => (
              <FilterButton
                key={group}
                name={group}
                active={
                  muscleFilter === group
                }
                onClick={() =>
                  setMuscleFilter(group)
                }
              />
            ))}
          </div>

          <div className="mt-5 max-h-96 space-y-2 overflow-y-auto">
            {filteredExercises.map(
              (exercise) => (
                <button
                  key={exercise.id}
                  onClick={() =>
                    addExercise(exercise)
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:border-emerald-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-[11px] font-black tracking-wider text-emerald-600">
                      {exerciseBadge(exercise.name)}
                    </div>
                    <div>
                    <p className="font-semibold">
                      {exercise.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {exercise.muscleGroup}
                    </p>
                    </div>
                  </div>

                  <span className="text-emerald-600">
                    Add
                  </span>
                </button>
              )
            )}
          </div>
        </section>
      )}

      <details className="mt-8 rounded-2xl border border-zinc-200 bg-white">
        <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-zinc-400">
          + Add workout note
        </summary>

        <div className="border-t border-zinc-200 p-5">
          <textarea
            value={workoutNote}
            onChange={(event) =>
              saveWorkoutNote(event.target.value)
            }
            placeholder="Optional note about this workout..."
            rows={3}
            className="w-full resize-none rounded-xl border border-zinc-300 bg-zinc-50 p-4 outline-none focus:border-emerald-500"
          />
        </div>
      </details>

      <button
        onClick={finishWorkout}
        className="mt-4 w-full rounded-2xl bg-emerald-500 p-5 text-lg font-bold text-white transition hover:bg-emerald-400"
      >
        Finish workout
      </button>
    </div>
  );
}

function SavedWorkoutsTab({
  savedWorkouts,
  activeWorkout,
  startSavedWorkout,
  deleteSavedWorkout,
  setActiveTab,
}: {
  savedWorkouts: SavedWorkout[];
  activeWorkout: ActiveWorkout | null;
  startSavedWorkout: (
    workout: SavedWorkout
  ) => void;
  deleteSavedWorkout: (id: string) => void;
  setActiveTab: (
    tab: TrainingTab
  ) => void;
}) {
  return (
    <section className="mt-8">
      <div>
        <h2 className="text-3xl font-bold">
          Saved Workouts
        </h2>

        <p className="mt-2 text-zinc-400">
          Reuse your training templates without
          rebuilding the workout every time.
        </p>
      </div>

      {savedWorkouts.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8">
          <p className="text-zinc-400">
            You don&apos;t have any saved
            workouts yet.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Start a workout, add your exercises
            and choose “Save as template”.
          </p>

          <button
            onClick={() =>
              setActiveTab("workout")
            }
            className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white"
          >
            Go to Workout
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {savedWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="rounded-3xl border border-zinc-200 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {workout.name}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    {workout.exercises.length}{" "}
                    exercises
                  </p>
                </div>

                <button
                  onClick={() =>
                    deleteSavedWorkout(
                      workout.id
                    )
                  }
                  className="text-sm text-red-400"
                >
                  Delete
                </button>
              </div>

              <div className="mt-5 space-y-2">
                {workout.exercises.map(
                  (exercise) => (
                    <div
                      key={
                        exercise.exerciseId
                      }
                      className="flex justify-between rounded-xl bg-zinc-50 px-4 py-3"
                    >
                      <span>
                        {exercise.exerciseName}
                      </span>

                      <span className="text-sm text-zinc-500">
                        {
                          exercise.defaultSets
                        }{" "}
                        sets
                      </span>
                    </div>
                  )
                )}
              </div>

              <button
                disabled={Boolean(activeWorkout)}
                onClick={() =>
                  startSavedWorkout(workout)
                }
                className="mt-5 w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                {activeWorkout
                  ? "Finish current workout first"
                  : "Start workout"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function HistoryTab({
  history,
  deleteHistoryEntry,
}: {
  history: WorkoutHistoryEntry[];
  deleteHistoryEntry: (
    id: string
  ) => void;
}) {
  const [openWorkoutId, setOpenWorkoutId] =
    useState<string | null>(null);

  return (
    <section className="mt-8">
      <h2 className="text-3xl font-bold">
        Workout History
      </h2>

      <p className="mt-2 text-zinc-400">
        Every finished workout and every set
        you logged.
      </p>

      {history.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 text-zinc-500">
          Finish your first workout and it will
          appear here.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {history.map((workout) => {
            const isOpen =
              openWorkoutId === workout.id;

            const totalSets =
              workout.exercises.reduce(
                (total, exercise) =>
                  total +
                  exercise.sets.length,
                0
              );

            return (
              <div
                key={workout.id}
                className="overflow-hidden rounded-3xl border border-zinc-200 bg-white"
              >
                <button
                  onClick={() =>
                    setOpenWorkoutId(
                      isOpen
                        ? null
                        : workout.id
                    )
                  }
                  className="flex w-full flex-wrap items-center justify-between gap-5 p-6 text-left"
                >
                  <div>
                    <h3 className="text-xl font-semibold">
                      {workout.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {formatDate(
                        workout.finishedAt
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {totalSets} sets
                    </p>

                    <p className="text-sm text-zinc-500">
                      {formatDuration(
                        workout.durationSeconds
                      )}
                    </p>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-zinc-200 p-6">
                    <div className="space-y-5">
                      {workout.exercises.map(
                        (exercise) => (
                          <div
                            key={exercise.id}
                          >
                            <p className="font-semibold">
                              {
                                exercise.exerciseName
                              }
                            </p>

                            <div className="mt-2 space-y-2">
                              {exercise.sets.map(
                                (
                                  set,
                                  index
                                ) => (
                                  <div
                                    key={
                                      set.id
                                    }
                                    className="flex justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm"
                                  >
                                    <span className="text-zinc-500">
                                      Set{" "}
                                      {index +
                                        1}
                                    </span>

                                    <span>
                                      {
                                        set.weight
                                      }{" "}
                                      kg ×{" "}
                                      {
                                        set.reps
                                      }
                                      {set.rir !==
                                      null
                                        ? ` • ${set.rir} RIR`
                                        : ""}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <button
                      onClick={() =>
                        deleteHistoryEntry(
                          workout.id
                        )
                      }
                      className="mt-6 text-sm text-red-400"
                    >
                      Delete workout
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ExercisesTab({
  exercises,
  customExercises,
  addCustomExercise,
  deleteCustomExercise,
}: {
  exercises: Exercise[];
  customExercises: Exercise[];
  addCustomExercise: (
    exercise: Exercise
  ) => void;
  deleteCustomExercise: (
    id: string
  ) => void;
}) {
  const [search, setSearch] = useState("");

  const [muscleFilter, setMuscleFilter] =
    useState<MuscleGroup | "All">("All");

  const [showCreate, setShowCreate] =
    useState(false);

  const [newName, setNewName] =
    useState("");

  const [newMuscle, setNewMuscle] =
    useState<MuscleGroup>("Chest");

  const filtered = exercises.filter(
    (exercise) => {
      const matchesSearch =
        exercise.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesMuscle =
        muscleFilter === "All" ||
        exercise.muscleGroup === muscleFilter;

      return matchesSearch && matchesMuscle;
    }
  );

  function createExercise() {
    const name = newName.trim();

    if (!name) {
      return;
    }

    const exists = exercises.some(
      (exercise) =>
        exercise.name.toLowerCase() ===
        name.toLowerCase()
    );

    if (exists) {
      window.alert(
        "An exercise with this name already exists."
      );
      return;
    }

    addCustomExercise({
      id: `custom-${makeId()}`,
      name,
      muscleGroup: newMuscle,
      custom: true,
    });

    setNewName("");
    setShowCreate(false);
  }

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="text-3xl font-bold">
            Exercise Library
          </h2>

          <p className="mt-2 text-zinc-400">
            Search BodyPilot exercises or
            create your own.
          </p>
        </div>

        <button
          onClick={() =>
            setShowCreate(!showCreate)
          }
          className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white"
        >
          + Create exercise
        </button>
      </div>

      {showCreate && (
        <div className="mt-6 rounded-3xl border border-emerald-200 bg-white p-6">
          <h3 className="text-xl font-semibold">
            New exercise
          </h3>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <input
              value={newName}
              onChange={(event) =>
                setNewName(
                  event.target.value
                )
              }
              placeholder="Exercise name"
              className="rounded-xl border border-zinc-300 bg-zinc-50 p-4 outline-none focus:border-emerald-500"
            />

            <select
              value={newMuscle}
              onChange={(event) =>
                setNewMuscle(
                  event.target
                    .value as MuscleGroup
                )
              }
              className="rounded-xl border border-zinc-300 bg-zinc-50 p-4 outline-none focus:border-emerald-500"
            >
              {muscleGroups.map(
                (group) => (
                  <option
                    key={group}
                    value={group}
                  >
                    {group}
                  </option>
                )
              )}
            </select>

            <button
              onClick={createExercise}
              className="rounded-xl bg-emerald-500 px-6 font-semibold text-black"
            >
              Create
            </button>
          </div>
        </div>
      )}

      <input
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        placeholder="Search exercises..."
        className="mt-6 w-full rounded-xl border border-zinc-300 bg-white p-4 outline-none focus:border-emerald-500"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterButton
          name="All"
          active={muscleFilter === "All"}
          onClick={() =>
            setMuscleFilter("All")
          }
        />

        {muscleGroups.map((group) => (
          <FilterButton
            key={group}
            name={group}
            active={
              muscleFilter === group
            }
            onClick={() =>
              setMuscleFilter(group)
            }
          />
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {filtered.map((exercise) => {
          const isCustom =
            customExercises.some(
              (custom) =>
                custom.id === exercise.id
            );

          return (
            <div
              key={exercise.id}
              className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5"
            >
              <div>
                <p className="font-semibold">
                  {exercise.name}
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  {exercise.muscleGroup}
                  {isCustom
                    ? " • Custom"
                    : ""}
                </p>
              </div>

              {isCustom && (
                <button
                  onClick={() =>
                    deleteCustomExercise(
                      exercise.id
                    )
                  }
                  className="text-sm text-red-400"
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TabButton({
  name,
  tab,
  activeTab,
  setActiveTab,
}: {
  name: string;
  tab: TrainingTab;
  activeTab: TrainingTab;
  setActiveTab: (
    tab: TrainingTab
  ) => void;
}) {
  const active = activeTab === tab;

  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-emerald-500 text-black"
          : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950"
      }`}
    >
      {name}
    </button>
  );
}

function FilterButton({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active
          ? "border-emerald-500 bg-emerald-500 text-white"
          : "border-zinc-300 text-zinc-400 hover:text-zinc-950"
      }`}
    >
      {name}
    </button>
  );
}

function createEmptySet(): WorkoutSet {
  return {
    id: makeId(),
    weight: 0,
    reps: 0,
    rir: null,
    completed: false,
  };
}

function findPreviousExercise(
  history: WorkoutHistoryEntry[],
  exerciseId: string
) {
  for (const workout of history) {
    const exercise =
      workout.exercises.find(
        (item) =>
          item.exerciseId === exerciseId
      );

    if (exercise) {
      const validSets =
        exercise.sets.filter(
          (set) =>
            set.weight > 0 ||
            set.reps > 0
        );

      if (validSets.length > 0) {
        return validSets
          .map(
            (set) =>
              `${set.weight} kg × ${set.reps}`
          )
          .join(" | ");
      }
    }
  }

  return null;
}

function getPreviousSetText(
  history: WorkoutHistoryEntry[],
  exerciseId: string,
  setIndex: number
) {
  for (const workout of history) {
    const exercise =
      workout.exercises.find(
        (item) =>
          item.exerciseId === exerciseId
      );

    const set = exercise?.sets[setIndex];

    if (
      set &&
      (set.weight > 0 || set.reps > 0)
    ) {
      return `${set.weight} × ${set.reps}`;
    }
  }

  return "—";
}

function estimatedOneRepMax(
  weight: number,
  reps: number
) {
  if (weight <= 0 || reps <= 0) {
    return 0;
  }

  return weight * (1 + reps / 30);
}

function isPersonalRecord(
  history: WorkoutHistoryEntry[],
  exerciseId: string,
  set: WorkoutSet
) {
  if (set.weight <= 0 || set.reps <= 0) {
    return false;
  }

  const currentScore =
    estimatedOneRepMax(
      set.weight,
      set.reps
    );

  let previousBest = 0;

  history.forEach((workout) => {
    workout.exercises.forEach(
      (exercise) => {
        if (
          exercise.exerciseId !== exerciseId
        ) {
          return;
        }

        exercise.sets.forEach(
          (previousSet) => {
            previousBest = Math.max(
              previousBest,
              estimatedOneRepMax(
                previousSet.weight,
                previousSet.reps
              )
            );
          }
        );
      }
    );
  });

  return currentScore > previousBest;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function formatLiveDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(
    (seconds % 3600) / 60
  );
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((value) =>
      String(value).padStart(2, "0")
    )
    .join(":");
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  return `${Math.max(minutes, 1)}min`;
}

function makeId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}