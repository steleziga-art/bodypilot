"use client";
import WorkoutOverview from "./WorkoutOverview";
import {CygIcon,PageHeader} from "@/components/ui/CygUI";
import {TrainingNavIcon} from './TrainingVisuals';

import { useEffect, useMemo, useState, useRef } from "react";
import { defaultExercises } from "./exercises";
import { ExerciseArt, AnatomyMap } from "./TrainingVisuals";
import { HistoryView, ExerciseView, ProgressView } from "./TrainingViews";
import CardioFields from "./CardioFields";
import { historyDurationSeconds } from "./exerciseIdentity";
import { isCardioExercise, cardioCalories, getWorkoutWeight } from "./workoutCardio";
import "./training-visual.css";
import { loadCloudData, saveCloudData, deleteCloudData } from "@/lib/supabase/storage";
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
  | "exercises"
  | "analytics";

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
const SET_TYPES_KEY = "bodypilot-set-types";
const ROUTINE_TARGETS_KEY = "bodypilot-routine-targets";
const SUPERSETS_KEY = "bodypilot-supersets";
const REST_PREFS_KEY = "bodypilot-rest-prefs";
const EXERCISE_FAVORITES_KEY = "bodypilot-exercise-favorites";
const RECENT_EXERCISES_KEY = "bodypilot-recent-exercises";
const STARTER_ROUTINES_REMOVED_KEY = "bodypilot-starter-routines-removed";


function buildStarterRoutine(id: string, name: string, exerciseIds: string[]): SavedWorkout {
  const picked = exerciseIds.map((exerciseId) => defaultExercises.find((exercise) => exercise.id === exerciseId)).filter(Boolean) as Exercise[];
  return {
    id,
    name,
    createdAt: new Date(0).toISOString(),
    exercises: picked.map((exercise) => ({ exerciseId: exercise.id, exerciseName: exercise.name, defaultSets: 3 })),
  };
}

const STARTER_ROUTINES: SavedWorkout[] = [
  buildStarterRoutine("mucipes-starter-push", "Push", ["bench-press", "seated-db-press", "cable-fly", "lateral-raise", "tricep-pushdown", "seated-dumbbell-tricep-extension"]),
  buildStarterRoutine("mucipes-starter-pull", "Pull", ["lat-pulldown", "seated-cable-row", "chest-supported-db-row", "preacher-curl", "cable-hammer-curl"]),
  buildStarterRoutine("mucipes-starter-legs", "Legs", ["squat", "romanian-deadlift", "leg-extension", "leg-curl", "seated-calf-raise"]),
];

function formatStoredWeight(kg: number, units: "metric" | "imperial") {
  if (units === "imperial") {
    const lb = Math.round(kg * 2.2046226218 * 10) / 10;
    return `${lb} lb`;
  }
  return `${kg} kg`;
}

function formatStoredVolume(kg: number, units: "metric" | "imperial") {
  const value = units === "imperial" ? kg * 2.2046226218 : kg;
  return `${Math.round(value).toLocaleString()} ${units === "imperial" ? "lb" : "kg"}`;
}

function formatEstimatedWeight(kg: number, units: "metric" | "imperial") {
  const value = units === "imperial"
    ? Math.round(kg * 2.2046226218)
    : Math.round(kg * 2) / 2;
  return `${value.toLocaleString(undefined, { maximumFractionDigits: units === "metric" ? 1 : 0 })} ${units === "imperial" ? "lb" : "kg"}`;
}

function ExerciseMedia({
  name,
  compact = false,
}: {
  name: string;
  compact?: boolean;
}) {
  return <ExerciseArt name={name} compact={compact} />;
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
  const [displayUnits, setDisplayUnits] = useState<"metric" | "imperial">(() => {
    if (typeof window === "undefined") return "metric";
    try {
      const raw = localStorage.getItem("bodypilot-settings");
      return raw && JSON.parse(raw)?.units === "imperial" ? "imperial" : "metric";
    } catch {
      return "metric";
    }
  });

  useEffect(() => {
    const syncDisplaySettings = () => {
      try {
        const raw = localStorage.getItem("bodypilot-settings");
        setDisplayUnits(raw && JSON.parse(raw)?.units === "imperial" ? "imperial" : "metric");
      } catch {
        setDisplayUnits("metric");
      }
    };
    window.addEventListener("mucipes-settings-changed", syncDisplaySettings);
    window.addEventListener("storage", syncDisplaySettings);
    return () => {
      window.removeEventListener("mucipes-settings-changed", syncDisplaySettings);
      window.removeEventListener("storage", syncDisplaySettings);
    };
  }, []);

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
  const [cloudReady, setCloudReady] = useState(false);

  useEffect(() => {
    try {
      const active = localStorage.getItem(ACTIVE_KEY);
      const saved = localStorage.getItem(SAVED_KEY);
      const workoutHistory =
        localStorage.getItem(HISTORY_KEY);
      const custom =
        localStorage.getItem(CUSTOM_EXERCISES_KEY);

      if (active) {
        const parsedActive = JSON.parse(active) as ActiveWorkout;
        const finished = workoutHistory ? JSON.parse(workoutHistory) as WorkoutHistoryEntry[] : [];
        if (!Array.isArray(finished) || !finished.some(entry => entry.id === parsedActive.id)) {
          setActiveWorkout(parsedActive);
        }
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
    const syncExternalHistory = (event: Event) => {
      const detail = (event as CustomEvent<WorkoutHistoryEntry[]>).detail;
      if (Array.isArray(detail)) {
        setHistory(detail);
        return;
      }
      try {
        const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch {}
    };
    window.addEventListener("cyg-training-history-updated", syncExternalHistory);
    return () => window.removeEventListener("cyg-training-history-updated", syncExternalHistory);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    let cancelled = false;
    async function hydrateTrainingFromCloud() {
      const [cloudActive, cloudSaved, cloudHistory, cloudCustom] = await Promise.all([
        loadCloudData<ActiveWorkout>("active_workout"),
        loadCloudData<SavedWorkout[]>("saved_workouts"),
        loadCloudData<WorkoutHistoryEntry[]>("workout_history"),
        loadCloudData<Exercise[]>("custom_exercises"),
      ]);
      if (cancelled) return;
      let localHistory: WorkoutHistoryEntry[] = [];
      try {
        const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        if (Array.isArray(parsed)) localHistory = parsed;
      } catch {}
      if (cloudActive && !cloudHistory?.some((workout) => workout.id === cloudActive.id) && !localHistory.some((workout) => workout.id === cloudActive.id)) {
        setActiveWorkout(local => local || cloudActive);
      }
      if (Array.isArray(cloudSaved)) setSavedWorkouts(cloudSaved);
      if (Array.isArray(cloudHistory)) setHistory(local=>Array.from(new Map([...cloudHistory,...local].map(w=>[w.id,w])).values()).sort((a,b)=>Date.parse(b.finishedAt)-Date.parse(a.finishedAt)));
      if (Array.isArray(cloudCustom)) setCustomExercises(cloudCustom);
      setCloudReady(true);
    }
    void hydrateTrainingFromCloud();
    return () => { cancelled = true; };
  }, [loaded]);

  useEffect(() => {
    if (!loaded || !cloudReady) return;
    let removed: string[] = [];
    try { removed = JSON.parse(localStorage.getItem(STARTER_ROUTINES_REMOVED_KEY) || "[]"); } catch {}
    setSavedWorkouts((current) => {
      const ids = new Set(current.map((workout) => workout.id));
      const missing = STARTER_ROUTINES.filter((routine) => !ids.has(routine.id) && !removed.includes(routine.id));
      if (!missing.length) return current;
      try {
        const raw = localStorage.getItem(ROUTINE_TARGETS_KEY);
        const targets = raw ? JSON.parse(raw) : {};
        for (const routine of missing) {
          targets[routine.id] = routine.exercises.reduce((acc: Record<string, {min:number;max:number;rir:number;rest:number}>, exercise) => {
            acc[exercise.exerciseId] = { min: 8, max: 12, rir: 2, rest: exercise.exerciseName.includes("Bench") || exercise.exerciseName.includes("Squat") || exercise.exerciseName.includes("Romanian") ? 180 : 120 };
            return acc;
          }, {});
        }
        localStorage.setItem(ROUTINE_TARGETS_KEY, JSON.stringify(targets));
      } catch {}
      return [...missing, ...current];
    });
  }, [loaded, cloudReady]);

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
    window.dispatchEvent(new Event("mucipes-workout-changed"));

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

    if (cloudReady) {
      if (activeWorkout) void saveCloudData("active_workout", activeWorkout);
      else void deleteCloudData("active_workout");
      void Promise.all([
        saveCloudData("saved_workouts", savedWorkouts),
        saveCloudData("workout_history", history),
        saveCloudData("custom_exercises", customExercises),
      ]);
    }
  }, [
    activeWorkout,
    savedWorkouts,
    history,
    customExercises,
    loaded,
    cloudReady,
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
        sets: isCardioExercise(exercise.exerciseName) ? [] : Array.from(
          { length: exercise.defaultSets },
          () => createEmptySet()
        ),
        ...(isCardioExercise(exercise.exerciseName) ? { cardio: { durationMinutes: 0, distanceKm: 0, intensity: "moderate" as const } } : {}),
      }));

    setActiveWorkout({
      id: makeId(),
      name: savedWorkout.name,
      startedAt: new Date().toISOString(),
      exercises,
    });

    setActiveTab("workout");
  }

  useEffect(()=>{
    if(!loaded || !cloudReady || activeWorkout)return;
    const intent=sessionStorage.getItem("cyg-start-routine");
    if(!intent)return;
    sessionStorage.removeItem("cyg-start-routine");
    const routine=savedWorkouts.find(r=>r.name.toLowerCase()===intent.toLowerCase())||savedWorkouts.find(r=>r.name.toLowerCase()===intent.replace(/ B$/i,"").toLowerCase());
    if(routine)startSavedWorkout({...routine,name:intent==='empty'?routine.name:intent});else startEmptyWorkout();
  },[loaded,cloudReady,activeWorkout,savedWorkouts]);

  function finishWorkout() { commitWorkout(); }

  function commitWorkout() {
    if (!activeWorkout) {
      return;
    }
    if (Date.now() - Date.parse(activeWorkout.startedAt) > 12 * 3600000) {
      window.alert("This session has an old timer. Resume it with a new timer before saving your workout.");
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
      estimatedCalories: estimateWorkoutCalories(activeWorkout.startedAt, finishedAt, activeWorkout.exercises),
      exercises: activeWorkout.exercises.map(
        (exercise) => ({
          ...exercise,
          sets: exercise.cardio ? [] : exercise.sets.filter(
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
    if (id.startsWith("mucipes-starter-")) {
      try {
        const removed = JSON.parse(localStorage.getItem(STARTER_ROUTINES_REMOVED_KEY) || "[]") as string[];
        if (!removed.includes(id)) localStorage.setItem(STARTER_ROUTINES_REMOVED_KEY, JSON.stringify([...removed, id]));
      } catch {}
    }
    setSavedWorkouts((current) => current.filter((workout) => workout.id !== id));
  }

  function deleteHistoryEntry(id: string) {
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
    <div className="mv-training">
      <PageHeader title="Workouts" action={<button className="cyg-icon-button" aria-label="Start an empty workout" onClick={startEmptyWorkout}><CygIcon name="plus"/></button>}/>

      <div className="mv-nav" role="tablist" aria-label="Workout sections">
        <TabButton name="Overview" tab="workout" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name="Exercises" tab="exercises" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name="History" tab="history" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name="Progress" tab="analytics" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name="Program" tab="saved" activeTab={activeTab} setActiveTab={setActiveTab} />
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
          displayUnits={displayUnits}
          onNavigate={setActiveTab}
        />
      )}

      {activeTab === "saved" && (
        <SavedWorkoutsTab
          savedWorkouts={savedWorkouts}
          setSavedWorkouts={setSavedWorkouts}
          exercises={allExercises}
          activeWorkout={activeWorkout}
          startSavedWorkout={startSavedWorkout}
          deleteSavedWorkout={deleteSavedWorkout}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "history" && (
        <div className="mv-history-container">
          <HistoryView
            history={history}
            deleteHistoryEntry={deleteHistoryEntry}
            updateHistoryEntry={entry=>setHistory(current=>current.map(w=>w.id===entry.id?{...entry,estimatedCalories:estimateWorkoutCalories(entry.startedAt,new Date(entry.finishedAt),entry.exercises)}:w))}
            restoreHistoryEntry={entry=>setHistory(current=>[entry,...current.filter(w=>w.id!==entry.id)].sort((a,b)=>Date.parse(b.finishedAt)-Date.parse(a.finishedAt)))}
            displayUnits={displayUnits}
            onOpenExercise={(exerciseId, clickedName) => {
              sessionStorage.setItem("cyg-open-exercise", exerciseId);
              const historyName = clickedName || history.flatMap(workout => workout.exercises).find(exercise => exercise.exerciseId === exerciseId)?.exerciseName;
              if (historyName) sessionStorage.setItem("cyg-open-exercise-name", historyName);
              setActiveTab("exercises");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}

      {activeTab === "exercises" && (
        <ExerciseView
          exercises={allExercises}
          history={history}
          displayUnits={displayUnits}
          onAdd={(exercise) => { const cardio = isCardioExercise(exercise.name); setActiveWorkout(current => ({id:current?.id || makeId(), name:current?.name || "Workout", startedAt:current?.startedAt || new Date().toISOString(), exercises:[...(current?.exercises || []), {id:makeId(), exerciseId:exercise.id, exerciseName:exercise.name, sets:cardio?[]:[createEmptySet()],...(cardio?{cardio:{durationMinutes:0,distanceKm:0,intensity:"moderate" as const}}:{})}]})); setActiveTab("workout"); }}
          addCustomExercise={addCustomExercise}
          deleteCustomExercise={
            deleteCustomExercise
          }
        />
      )}

      {activeTab === "analytics" && (
        <ProgressView history={history} exercises={allExercises} displayUnits={displayUnits} />
      )}
    </div>
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
  displayUnits,
  onNavigate,
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
  displayUnits: "metric" | "imperial";
  onNavigate: (tab: "saved" | "history" | "exercises" | "analytics") => void;
}) {
  const readWorkoutDisplaySettings = () => {
    try {
      const raw = localStorage.getItem("bodypilot-settings");
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        restTimer: parsed.restTimer !== false,
        restSeconds: typeof parsed.restSeconds === "number" && parsed.restSeconds >= 15 ? Math.round(parsed.restSeconds) : 120,
        showRir: parsed.showRir !== false,
      };
    } catch {
      return { restTimer: true, restSeconds: 120, showRir: true };
    }
  };
  const initialWorkoutSettings = readWorkoutDisplaySettings();
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [restTimerEnabled, setRestTimerEnabled] = useState(initialWorkoutSettings.restTimer);
  const [restDuration, setRestDuration] = useState(initialWorkoutSettings.restSeconds);
  const [defaultShowRir, setDefaultShowRir] = useState(initialWorkoutSettings.showRir);

  useEffect(() => {
    if (restSecondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setRestSecondsLeft((current) => {
        if (current <= 1) {
          if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.([120, 80, 120]);
          setToast("Rest complete · ready for the next set");
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [restSecondsLeft]);

  useEffect(() => {
    const syncWorkoutSettings = () => {
      const next = readWorkoutDisplaySettings();
      setRestTimerEnabled(next.restTimer);
      setRestDuration(next.restSeconds);
      setDefaultShowRir(next.showRir);
    };
    window.addEventListener("mucipes-settings-changed", syncWorkoutSettings);
    window.addEventListener("storage", syncWorkoutSettings);
    return () => {
      window.removeEventListener("mucipes-settings-changed", syncWorkoutSettings);
      window.removeEventListener("storage", syncWorkoutSettings);
    };
  }, []);

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

  const [setTypes, setSetTypes] = useState<Record<string, "N" | "W" | "D" | "F">>(() => {
    if (typeof window === "undefined") return {};
    try { const raw = localStorage.getItem(SET_TYPES_KEY); return raw ? JSON.parse(raw) : {}; }
    catch { return {}; }
  });
  const [replaceExerciseId, setReplaceExerciseId] = useState<string | null>(null);
  const [replaceSearch, setReplaceSearch] = useState("");
  const [showFinishReview, setShowFinishReview] = useState(false);
  const [sessionFeeling, setSessionFeeling] = useState(4);
  const [collapsedExercises, setCollapsedExercises] = useState<Record<string, boolean>>({});
  const [supersetGroups, setSupersetGroups] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try { const raw = localStorage.getItem(SUPERSETS_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
  });
  const [paused, setPaused] = useState(false);
  const [pauseStartedAt, setPauseStartedAt] = useState<number | null>(null);
  const [pausedTotal, setPausedTotal] = useState(0);
  const [unit, setUnit] = useState<"kg" | "lb">(displayUnits === "imperial" ? "lb" : "kg");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setUnit(displayUnits === "imperial" ? "lb" : "kg");
  }, [displayUnits]);

  const kgToLb = (kg: number) => Math.round(kg * 2.2046226218 * 10) / 10;
  const lbToKg = (lb: number) => Math.round((lb / 2.2046226218) * 100) / 100;
  const displayWeight = (kg: number) => unit === "lb" ? kgToLb(kg) : kg;
  const weightLabel = unit;



  useEffect(() => {
    let cancelled = false;
    async function hydrateWorkoutPreferences() {
      const [cloudSetTypes, cloudSupersets, cloudExerciseNotes] = await Promise.all([
        loadCloudData<Record<string, "N" | "W" | "D" | "F">>("set_types"),
        loadCloudData<Record<string, string>>("supersets"),
        loadCloudData<Record<string, string>>("exercise_notes"),
      ]);
      if (cancelled) return;
      if (cloudSetTypes) setSetTypes(cloudSetTypes);
      if (cloudSupersets) setSupersetGroups(cloudSupersets);
      if (cloudExerciseNotes) setExerciseNotes(cloudExerciseNotes);
    }
    void hydrateWorkoutPreferences();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    localStorage.setItem(SET_TYPES_KEY, JSON.stringify(setTypes));
    void saveCloudData("set_types", setTypes);
  }, [setTypes]);

  useEffect(() => {
    localStorage.setItem(SUPERSETS_KEY, JSON.stringify(supersetGroups));
    void saveCloudData("supersets", supersetGroups);
  }, [supersetGroups]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);


  useEffect(() => {
    if (!activeWorkout) {
      setElapsedSeconds(0);
      return;
    }

    const updateTimer = () => {
      if (paused) return;
      const startedAt = new Date(activeWorkout.startedAt).getTime();
      if (!Number.isFinite(startedAt) || Date.now() - startedAt > 12 * 3600000) {
        setElapsedSeconds(0);
        return;
      }
      setElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - startedAt - pausedTotal) / 1000))
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
  }, [activeWorkout, paused, pausedTotal]);

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
      void saveCloudData("workout_notes", parsed);
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
    void saveCloudData("exercise_notes", next);
  }

  if (!activeWorkout) {
    return <WorkoutOverview routines={savedWorkouts} history={history} onStart={startSavedWorkout} onEmpty={startEmptyWorkout} onNavigate={onNavigate}/>;
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
    const cardio = isCardioExercise(exercise.name);
    const newExercise: WorkoutExercise = {
      id: makeId(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: cardio ? [] : [createEmptySet()],
      ...(cardio ? { cardio: { durationMinutes: 0, distanceKm: 0, intensity: "moderate" as const } } : {}),
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

  function replaceExercise(workoutExerciseId: string, replacement: Exercise) {
    setActiveWorkout((current) => {
      if (!current) return current;
      return {
        ...current,
        exercises: current.exercises.map((item) =>
          item.id === workoutExerciseId
            ? {
                ...item,
                exerciseId: replacement.id,
                exerciseName: replacement.name,
              }
            : item
        ),
      };
    });
    setReplaceExerciseId(null);
    setReplaceSearch("");
  }

  function cycleSetType(setId: string) {
    const order: Array<"N" | "W" | "D" | "F"> = ["N", "W", "D", "F"];
    setSetTypes((current) => {
      const now = current[setId] ?? "N";
      const next = order[(order.indexOf(now) + 1) % order.length];
      return { ...current, [setId]: next };
    });
  }

  function togglePause() {
    if (!activeWorkout) return;
    if (!paused) {
      setPaused(true);
      setPauseStartedAt(Date.now());
    } else {
      if (pauseStartedAt) setPausedTotal((v) => v + (Date.now() - pauseStartedAt));
      setPaused(false);
      setPauseStartedAt(null);
    }
  }

  function toggleCollapse(id: string) {
    setCollapsedExercises((current) => ({ ...current, [id]: !current[id] }));
  }

  function toggleSuperset(id: string) {
    setSupersetGroups((current) => {
      const currentGroup = current[id];
      if (currentGroup) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      const other = activeWorkout?.exercises.find((e) => e.id !== id && !current[e.id]);
      if (!other) return current;
      const group = `SS-${Date.now()}`;
      return { ...current, [id]: group, [other.id]: group };
    });
  }

  function quickWeight(workoutExerciseId: string, setId: string, deltaKg: number) {
    setActiveWorkout((current) => current ? {
      ...current,
      exercises: current.exercises.map((exercise) => exercise.id !== workoutExerciseId ? exercise : {
        ...exercise,
        sets: exercise.sets.map((set) => set.id !== setId ? set : {
          ...set,
          weight: Math.max(0, Math.round((set.weight + deltaKg) * 2) / 2)
        })
      })
    } : current);
  }

  function progressiveSuggestion(exerciseId: string, setIndex: number) {
    const previous = history
      .flatMap((workout) => workout.exercises)
      .find((exercise) => exercise.exerciseId === exerciseId);
    const set = previous?.sets[setIndex];
    if (!set || !set.weight || !set.reps) return null;
    const suggestedKg = set.reps >= 12 ? set.weight + 2.5 : set.weight;
    const suggested = unit === "lb" ? `${kgToLb(suggestedKg)} lb` : `${suggestedKg} kg`;
    const previousWeight = unit === "lb" ? `${kgToLb(set.weight)} lb` : `${set.weight} kg`;
    if (set.reps >= 12) return { text: `Try ${suggested}`, tone: "up" };
    if (set.reps <= 6) return { text: `Keep ${previousWeight}`, tone: "same" };
    return { text: `${previousWeight} · beat ${set.reps} reps`, tone: "same" };
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

  function moveExercise(workoutExerciseId: string, direction: -1 | 1) {
    setActiveWorkout((current) => {
      if (!current) return current;
      const exercises = [...current.exercises];
      const index = exercises.findIndex((item) => item.id === workoutExerciseId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= exercises.length) return current;
      [exercises[index], exercises[target]] = [exercises[target], exercises[index]];
      return { ...current, exercises };
    });
  }

  function focusSetInput(workoutExerciseId: string, setId: string, field: "weight" | "reps" | "rir") {
    window.requestAnimationFrame(() => {
      document.getElementById(`set-${workoutExerciseId}-${setId}-${field}`)?.focus();
    });
  }

  function copyPreviousSet(workoutExerciseId: string, exerciseId: string, setIndex: number) {
    const previous = getPreviousSet(history, exerciseId, setIndex);
    if (!previous) {
      setToast("No previous set to copy");
      return;
    }
    setActiveWorkout((current) => current ? {
      ...current,
      exercises: current.exercises.map((exercise) => exercise.id !== workoutExerciseId ? exercise : {
        ...exercise,
        sets: exercise.sets.map((set, index) => index === setIndex ? { ...set, weight: previous.weight, reps: previous.reps, rir: previous.rir ?? set.rir } : set),
      }),
    } : current);
    setToast("Previous set copied");
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
                                  : field === "weight" && unit === "lb"
                                    ? lbToKg(Number(value))
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
    const targetExercise = activeWorkout?.exercises.find((e) => e.id === workoutExerciseId);
    const targetSet = targetExercise?.sets.find((set) => set.id === setId);
    if (restTimerEnabled && targetSet && !targetSet.completed) {
      setRestSecondsLeft(restDuration);
      setToast(`Rest timer started · ${Math.floor(restDuration / 60)}:${String(restDuration % 60).padStart(2, "0")}`);
    }
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
    <div className="mv-workout">
      {Date.now() - Date.parse(activeWorkout.startedAt) > 12 * 3600000 && (
        <div role="status" className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          This workout was left open. Its timer is stopped; your logged sets are still here.
          <button type="button" className="ml-3 font-bold underline" onClick={() => {
            setPaused(false); setPausedTotal(0); setPauseStartedAt(null); setRestSecondsLeft(0);
            setActiveWorkout(current => current ? { ...current, startedAt: new Date().toISOString() } : current);
          }}>Resume with a new timer</button>
        </div>
      )}
      <section className="cyg-active-session">
        <div className="cyg-active-title"><input aria-label="Workout name" value={activeWorkout.name} onChange={event=>changeWorkoutName(event.target.value)} placeholder="Workout name"/><details className="cyg-workout-options"><summary aria-label="Active workout options"><CygIcon name="dots"/></summary><div><button onClick={togglePause}>{paused?'Resume timer':'Pause timer'}</button><button onClick={()=>setUnit(unit==='kg'?'lb':'kg')}>Use {unit==='kg'?'lb':'kg'}</button><button onClick={saveCurrentWorkout}>Save as routine</button><button onClick={discardWorkout}>Discard workout</button></div></details></div>
        <div className="cyg-elapsed-time"><strong>{formatLiveDuration(elapsedSeconds)}</strong><span>{paused?'Paused':'Elapsed'}</span></div>
        <div className="cyg-live-stats"><span><CygIcon name="workout" size={16}/>{activeWorkout.exercises.length} exercises</span><span>{activeWorkout.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.completed).length,0)} / {activeWorkout.exercises.reduce((n,e)=>n+e.sets.length,0)} sets</span><button onClick={togglePause}>{paused?'Resume':'Pause'}</button></div>
      </section>

      <section className="mv-rest-bar" aria-label="Rest timer"><span className="mv-timer-icon"><CygIcon name="clock" size={27}/></span><div><span>Rest timer</span><strong>{Math.floor(restSecondsLeft / 60)}:{String(restSecondsLeft % 60).padStart(2, "0")}</strong></div><progress max={Math.max(restDuration,restSecondsLeft,1)} value={restSecondsLeft}/><button onClick={() => setRestSecondsLeft(v=>v+30)}>+30s</button>{restSecondsLeft>0&&<button onClick={()=>setRestSecondsLeft(0)}>Skip</button>}</section>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
        {activeWorkout.exercises.map(
          (exercise) => {
            const previous = findPreviousExercise(
              history,
              exercise.exerciseId,
              displayUnits
            );

            return (
              <section
                key={exercise.id}
                className="mv-set-card overflow-hidden bg-white"
              >
                <div className="mv-set-heading flex flex-wrap items-start justify-between gap-4">
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
                    {supersetGroups[exercise.id] && (
                      <span className="mt-2 inline-flex rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-violet-700">
                        Superset
                      </span>
                    )}

                    <button
                      onClick={() =>
                        setOpenDetailsByExercise(
                          (current) => ({
                            ...current,
                            [exercise.id]:
                              !(current[exercise.id] ?? false),
                          })
                        )
                      }
                      className="mt-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                    >
                      {openDetailsByExercise[
                        exercise.id
                      ]
                        ? "Hide exercise guide"
                        : "Exercise guide"}
                    </button>

                    <p className="mt-2 text-sm text-slate-600">
                      {previous
                        ? `Previous: ${previous}`
                        : "No previous performance"}
                    </p>

                    </div>
                  </div>

                  <details className="mv-exercise-options"><summary aria-label="Exercise options">⋮</summary><div>
                    <button onClick={() => toggleCollapse(exercise.id)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500">{collapsedExercises[exercise.id] ? "Open" : "Collapse"}</button>
                    <button onClick={() => toggleSuperset(exercise.id)} className={`rounded-lg border px-2 py-1 text-xs font-bold ${supersetGroups[exercise.id] ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-500"}`}>Superset</button>
                    <button onClick={() => moveExercise(exercise.id, -1)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500">↑</button>
                    <button onClick={() => moveExercise(exercise.id, 1)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500">↓</button>
                    <button onClick={() => setReplaceExerciseId(exercise.id)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500">Replace</button>
                    <button
                      onClick={() => removeExercise(exercise.id)}
                      className="text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div></details>
                </div>

                {!collapsedExercises[exercise.id] && (exercise.cardio || isCardioExercise(exercise.exerciseName) ?
                  <CardioFields exercise={exercise} units={displayUnits} onChange={next => setActiveWorkout(current => current ? { ...current, exercises: current.exercises.map(item => item.id === next.id ? next : item) } : current)} /> : <>
                {openDetailsByExercise[
                  exercise.id
                ] && (
                  <div className="border-b border-slate-200 bg-white/50 p-5">
                    <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.9fr)_1.1fr]">
                      <ExerciseMedia
                        name={exercise.exerciseName}
                      />

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                          Instructions
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {exerciseInstructions(
                            exercise.exerciseName
                          )}
                        </p>

                        <p className="mt-4 text-xs text-slate-600">
                          Start/finish movement guide. Keep the setup stable and use a controlled range of motion.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mv-set-table">
                  
                  <div
                    className={`grid gap-2 px-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-600 ${
                      (showRirByExercise[exercise.id] ?? defaultShowRir)
                        ? "grid-cols-[24px_minmax(54px,1.3fr)_minmax(38px,1fr)_minmax(34px,.8fr)_minmax(30px,.7fr)_28px_16px]"
                        : "grid-cols-[24px_minmax(54px,1.3fr)_minmax(38px,1fr)_minmax(34px,.8fr)_28px_16px]"
                    }`}
                  >
                    <span>Set</span>
                    <span>Previous</span>
                    <span>{weightLabel}</span>
                    <span>Reps</span>
                    {(showRirByExercise[exercise.id] ?? defaultShowRir) && (
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
                          className={`mv-set-row grid items-start gap-2 rounded-xl p-2 ${
                            (showRirByExercise[exercise.id] ?? defaultShowRir)
                              ? "grid-cols-[24px_minmax(54px,1.3fr)_minmax(38px,1fr)_minmax(34px,.8fr)_minmax(30px,.7fr)_28px_16px]"
                              : "grid-cols-[24px_minmax(54px,1.3fr)_minmax(38px,1fr)_minmax(34px,.8fr)_28px_16px]"
                          } ${
                            set.completed
                              ? "border border-blue-400/30 bg-blue-400/10"
                              : "border border-transparent bg-white"
                          }`}
                        >
                          <button
                            onClick={() => cycleSetType(set.id)}
                            title="Set type: Normal → Warm-up → Drop → Failure"
                            className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${
                              (setTypes[set.id] ?? "N") === "W"
                                ? "bg-amber-100 text-amber-700"
                                : (setTypes[set.id] ?? "N") === "D"
                                  ? "bg-violet-100 text-violet-700"
                                  : (setTypes[set.id] ?? "N") === "F"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {(setTypes[set.id] ?? "N") === "N" ? index + 1 : setTypes[set.id]}
                          </button>

                          <button type="button" onClick={() => copyPreviousSet(exercise.id, exercise.exerciseId, index)} title="Copy previous set" className="hidden text-center sm:block">
                            <p className="text-xs text-slate-600 hover:text-blue-600">{getPreviousSetText(history, exercise.exerciseId, index, displayUnits)}</p>
                            {progressiveSuggestion(exercise.exerciseId, index) && (
                              <p className="mt-1 text-[10px] font-bold text-blue-600">{progressiveSuggestion(exercise.exerciseId, index)?.text}</p>
                            )}
                          </button>

                          <div className="min-w-0">
                            <input
                              id={`set-${exercise.id}-${set.id}-weight`}
                              type="number"
                              inputMode="decimal"
                              step={unit === "lb" ? "1" : "0.5"}
                              min="0"
                              value={
                                set.weight === 0
                                  ? ""
                                  : displayWeight(set.weight)
                              }
                              onChange={(event) =>
                                updateSet(
                                  exercise.id,
                                  set.id,
                                  "weight",
                                  event.target.value
                                )
                              }
                              onKeyDown={(event) => { if (event.key === "Enter") focusSetInput(exercise.id, set.id, "reps"); }}
                              placeholder={weightLabel}
                              className="h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-center text-sm outline-none focus:border-blue-400"
                            />
                            <div className="mv-weight-adjust mt-1 flex justify-center gap-1">
                              <button type="button" onClick={() => quickWeight(exercise.id, set.id, unit === "lb" ? lbToKg(-5) : -2.5)} className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{unit === "lb" ? "−5" : "−2.5"}</button>
                              <button type="button" onClick={() => quickWeight(exercise.id, set.id, unit === "lb" ? lbToKg(5) : 2.5)} className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{unit === "lb" ? "+5" : "+2.5"}</button>
                            </div>
                          </div>

                          <input
                            id={`set-${exercise.id}-${set.id}-reps`}
                            type="number"
                            inputMode="numeric"
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
                            onKeyDown={(event) => {
                              if (event.key !== "Enter") return;
                              if ((showRirByExercise[exercise.id] ?? defaultShowRir)) focusSetInput(exercise.id, set.id, "rir");
                              else {
                                const next = exercise.sets[index + 1];
                                if (next) focusSetInput(exercise.id, next.id, "weight");
                              }
                            }}
                            placeholder="reps"
                            className="h-11 min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-center text-sm outline-none focus:border-blue-400"
                          />

                          {(showRirByExercise[exercise.id] ?? defaultShowRir) && (
                            <input
                              id={`set-${exercise.id}-${set.id}-rir`}
                              type="number"
                              inputMode="numeric"
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
                              onKeyDown={(event) => {
                                if (event.key !== "Enter") return;
                                const next = exercise.sets[index + 1];
                                if (next) focusSetInput(exercise.id, next.id, "weight");
                              }}
                              placeholder="RIR"
                              className="h-11 min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-center text-sm outline-none focus:border-blue-400"
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
                                ? "border-blue-400 bg-blue-400 text-white"
                                : "border-slate-300 text-slate-600"
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
                            className="text-zinc-600 transition hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <details className="mt-4 rounded-xl border border-slate-200 bg-white">
                    <summary className="cursor-pointer px-4 py-3 text-sm text-slate-600">
                      + Exercise note
                    </summary>

                    <div className="border-t border-slate-200 p-3">
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
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                  </details>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() =>
                        addSet(exercise.id)
                      }
                      className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-semibold transition hover:bg-slate-50"
                    >
                      + Add set
                    </button>

                    <button
                      onClick={() =>
                        setShowRirByExercise(
                          (current) => ({
                            ...current,
                            [exercise.id]:
                              !(current[exercise.id] ?? defaultShowRir),
                          })
                        )
                      }
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition hover:text-white"
                    >
                      {(showRirByExercise[exercise.id] ?? defaultShowRir)
                        ? "Hide RIR"
                        : "+ RIR"}
                    </button>
                  </div>
                </div>
                </>)}
              </section>
            );
          }
        )}
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 xl:sticky xl:top-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                Exercise Library
              </p>
              <h3 className="mt-1 text-xl font-bold">
                Add exercise
              </h3>
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600">
              {filteredExercises.length}
            </span>
          </div>

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search exercises..."
            className="mt-4 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none focus:border-blue-400"
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
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-400/60"
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
                    <p className="mt-0.5 text-xs text-slate-600">
                      {
                        libraryExercise.muscleGroup
                      }
                    </p>
                  </div>

                  <span className="text-lg text-blue-400">
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
        className="mt-6 w-full rounded-2xl border border-dashed border-slate-300 p-4 font-semibold text-slate-500 transition hover:border-blue-400 hover:bg-white hover:text-white xl:hidden"
      >
        + Add exercise
      </button>

      {showExercisePicker && (
        <section className="cyg-exercise-picker mt-5 rounded-3xl border border-blue-400/30 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">
              Add exercise
            </h2>

            <button
              onClick={() =>
                setShowExercisePicker(false)
              }
              className="text-slate-500"
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
            className="mt-5 w-full rounded-xl border border-slate-300 bg-white p-4 outline-none focus:border-blue-400"
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
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-400/60"
                >
                  <div className="flex items-center gap-3">
                    <ExerciseMedia name={exercise.name} compact />
                    <div>
                    <p className="font-semibold">
                      {exercise.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {exercise.muscleGroup}
                    </p>
                    </div>
                  </div>

                  <span className="text-blue-400">
                    Add
                  </span>
                </button>
              )
            )}
          </div>
        </section>
      )}

      <details className="mt-8 rounded-2xl border border-slate-200 bg-white">
        <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-slate-500">
          + Add workout note
        </summary>

        <div className="border-t border-slate-200 p-5">
          <textarea
            value={workoutNote}
            onChange={(event) =>
              saveWorkoutNote(event.target.value)
            }
            placeholder="Optional note about this workout..."
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-300 bg-white p-4 outline-none focus:border-blue-400"
          />
        </div>
      </details>

      <button
        onClick={() => setShowFinishReview(true)}
        className="mt-4 w-full rounded-2xl bg-blue-500 p-5 text-lg font-black text-white transition hover:bg-blue-600"
      >
        Review & Finish
      </button>

      <div className="mv-workout-actions sticky bottom-3 z-40 mt-4 flex gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur xl:hidden">
        <button onClick={() => setShowExercisePicker(true)} className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-black">+ Exercise</button>
        <button onClick={() => setShowFinishReview(true)} className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-black text-white">Finish</button>
      </div>

      {toast && <div className="fixed right-4 top-4 z-[100] rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-xl">{toast}</div>}
      {replaceExerciseId && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/40 p-3 sm:items-center">
          <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Replace exercise</p><h3 className="mt-1 text-2xl font-black">Choose replacement</h3></div>
              <button onClick={() => setReplaceExerciseId(null)} className="h-10 w-10 rounded-xl bg-slate-100 font-black">×</button>
            </div>
            <input value={replaceSearch} onChange={e=>setReplaceSearch(e.target.value)} placeholder="Search exercises..." className="mt-5 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-400"/>
            <div className="mt-4 space-y-2">
              {exercises.filter(e=>e.name.toLowerCase().includes(replaceSearch.toLowerCase())).slice(0,30).map(e=>(
                <button key={e.id} onClick={()=>replaceExercise(replaceExerciseId,e)} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left hover:border-blue-400">
                  <ExerciseMedia name={e.name} compact />
                  <div><p className="font-bold">{e.name}</p><p className="text-xs text-slate-600">{e.muscleGroup}</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showFinishReview && <div className="cyg-finish-overlay" role="dialog" aria-modal="true" aria-labelledby="cyg-finish-title">
        <section className="cyg-finish-panel"><header><button aria-label="Return to workout" onClick={()=>setShowFinishReview(false)}><CygIcon name="close"/></button><span>Workout review</span></header><div className="cyg-success-ring"><CygIcon name="check" size={50}/></div><h2 id="cyg-finish-title">Great work!</h2><p>{activeWorkout.name}</p>
          <div className="cyg-finish-stats"><SummaryMetric label="Duration" value={formatLiveDuration(elapsedSeconds)}/><SummaryMetric label="Total Sets" value={activeWorkout.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.completed).length,0)}/><SummaryMetric label="Total Volume" value={formatStoredVolume(activeWorkout.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.completed).reduce((v,s)=>v+s.weight*s.reps,0),0),displayUnits)}/></div>
          <div className="cyg-calorie-summary"><CygIcon name="flame" size={27}/><div><span>Estimated Calories</span><strong>~{estimateWorkoutCalories(activeWorkout.startedAt,new Date(),activeWorkout.exercises)} kcal</strong></div><small>Estimate</small></div>
          <h3>Workout Breakdown</h3><div className="cyg-finish-breakdown">{activeWorkout.exercises.map(e=><div key={e.id}><strong>{e.exerciseName}</strong><span>{e.cardio?`${e.cardio.durationMinutes} min`: `${e.sets.filter(s=>s.completed).length} sets`}</span><small>{e.cardio?`${e.cardio.distanceKm.toFixed(1)} km`:formatStoredVolume(e.sets.filter(s=>s.completed).reduce((v,s)=>v+s.weight*s.reps,0),displayUnits)}</small></div>)}</div>
          <button className="cyg-finish-option" onClick={()=>setShowFinishReview(false)}><CygIcon name="edit" size={18}/>Edit Workout<CygIcon name="chevron" size={16}/></button>
          <button className="cyg-finish-option" onClick={()=>{setShowFinishReview(false);setShowExercisePicker(true)}}><CygIcon name="plus" size={18}/>Add Exercise or Set<CygIcon name="chevron" size={16}/></button>
          <details className="cyg-finish-feeling"><summary>How did it feel?</summary><div>{[1,2,3,4,5].map(n=><button key={n} className={sessionFeeling===n?'is-active':''} onClick={()=>setSessionFeeling(n)}>{n}</button>)}</div></details>
          <button className="cyg-discard-finish" onClick={()=>{setShowFinishReview(false);discardWorkout()}}><CygIcon name="delete" size={18}/>Discard Workout</button>
          <button className="cyg-primary" onClick={()=>{localStorage.setItem(`bodypilot-workout-feeling-${activeWorkout.id}`,String(sessionFeeling));setShowFinishReview(false);finishWorkout()}}><CygIcon name="check" size={18}/>Save Workout</button>
        </section>
      </div>}

    </div>
  );
}

function SavedWorkoutsTab({
  savedWorkouts, setSavedWorkouts, exercises, activeWorkout, startSavedWorkout, deleteSavedWorkout, setActiveTab,
}: {
  savedWorkouts: SavedWorkout[];
  setSavedWorkouts: React.Dispatch<React.SetStateAction<SavedWorkout[]>>;
  exercises: Exercise[];
  activeWorkout: ActiveWorkout | null;
  startSavedWorkout: (workout: SavedWorkout) => void;
  deleteSavedWorkout: (id: string) => void;
  setActiveTab: (tab: TrainingTab) => void;
}) {
  const [builderOpen,setBuilderOpen]=useState(false);
  const [routineName,setRoutineName]=useState("");
  const [routineSearch,setRoutineSearch]=useState("");
  const [editingRoutineId,setEditingRoutineId]=useState<string|null>(null);
  const [builderExercises,setBuilderExercises]=useState<Array<{exercise:Exercise;sets:number;minReps:number;maxReps:number;rir:number;rest:number}>>([]);

  function addBuilderExercise(exercise:Exercise){if(builderExercises.some(x=>x.exercise.id===exercise.id))return;setBuilderExercises(c=>[...c,{exercise,sets:3,minReps:8,maxReps:12,rir:2,rest:120}]);}
  function saveRoutine(){
    if(!routineName.trim()||!builderExercises.length)return;
    const id=editingRoutineId || makeId();
    const routine:SavedWorkout={id,name:routineName.trim(),createdAt:editingRoutineId?(savedWorkouts.find(w=>w.id===editingRoutineId)?.createdAt||new Date().toISOString()):new Date().toISOString(),exercises:builderExercises.map(x=>({exerciseId:x.exercise.id,exerciseName:x.exercise.name,defaultSets:x.sets}))};
    try{const raw=localStorage.getItem(ROUTINE_TARGETS_KEY);const all=raw?JSON.parse(raw):{};all[id]=builderExercises.reduce((acc,x)=>({...acc,[x.exercise.id]:{min:x.minReps,max:x.maxReps,rir:x.rir,rest:x.rest}}),{});localStorage.setItem(ROUTINE_TARGETS_KEY,JSON.stringify(all));}catch{}
    setSavedWorkouts(c=>editingRoutineId?c.map(w=>w.id===editingRoutineId?routine:w):[...c,routine]);setRoutineName("");setBuilderExercises([]);setEditingRoutineId(null);setBuilderOpen(false);
  }
  function starter(name:string,names:string[]){const picked=names.map(n=>exercises.find(e=>e.name.toLowerCase().includes(n))).filter(Boolean) as Exercise[];setRoutineName(name);setBuilderExercises(picked.map(exercise=>({exercise,sets:3,minReps:8,maxReps:12,rir:2,rest:120})));setBuilderOpen(true);}
  function moveExercise(index:number,direction:-1|1){const next=index+direction;if(next<0||next>=builderExercises.length)return;setBuilderExercises(current=>{const copy=[...current];[copy[index],copy[next]]=[copy[next],copy[index]];return copy;});}
  function duplicateRoutine(workout:SavedWorkout){setSavedWorkouts(c=>[...c,{...workout,id:makeId(),name:`${workout.name} Copy`,createdAt:new Date().toISOString()}]);}
  function editRoutine(workout:SavedWorkout){let targets:Record<string,{min?:number;max?:number;rir?:number;rest?:number}>={};try{targets=JSON.parse(localStorage.getItem(ROUTINE_TARGETS_KEY)||"{}")[workout.id]||{};}catch{}setEditingRoutineId(workout.id);setRoutineName(workout.name);setBuilderExercises(workout.exercises.map(item=>{const exercise=exercises.find(e=>e.id===item.exerciseId) || {id:item.exerciseId,name:item.exerciseName,muscleGroup:"Other" as MuscleGroup};const target=targets[item.exerciseId]||{};return {exercise,sets:item.defaultSets,minReps:target.min??8,maxReps:target.max??12,rir:target.rir??2,rest:target.rest??120};}));setBuilderOpen(true);}

  const templates=[
    {name:"Push", subtitle:"Chest · Shoulders · Triceps", names:["bench press","shoulder press","lateral raise","triceps"]},
    {name:"Pull", subtitle:"Back · Rear delts · Biceps", names:["lat pulldown","row","curl"]},
    {name:"Legs", subtitle:"Quads · Hamstrings · Glutes · Calves", names:["squat","rdl","leg extension","leg curl","calf"]},
  ];

  return <section className="mt-8">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">Training library</p><h2 className="mt-1 text-3xl font-black tracking-tight">Routines</h2><p className="mt-2 max-w-2xl text-slate-500">Build reusable sessions with sets, rep ranges, RIR and rest targets. Everything stays editable.</p></div><button onClick={()=>{setEditingRoutineId(null);setRoutineName("");setBuilderExercises([]);setBuilderOpen(true)}} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm">+ New routine</button></div>

    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-900"><span className="font-black">Built to edit.</span> Push, Pull and Legs are real routines, not locked templates. Change exercises, targets or order — or delete them completely.</div>

    <div className="mt-7 grid gap-5 lg:grid-cols-2">{savedWorkouts.map(workout=><div key={workout.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><h3 className="text-xl font-black">{workout.name}</h3><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">{workout.exercises.length} exercises</span></div><p className="mt-2 text-sm text-slate-500">{workout.exercises.reduce((n,e)=>n+e.defaultSets,0)} working sets · ready to start</p></div><button onClick={()=>deleteSavedWorkout(workout.id)} title="Delete routine" className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500">×</button></div><div className="mt-5 divide-y divide-slate-100 rounded-2xl bg-slate-50 px-4">{workout.exercises.map((ex,index)=><div key={`${ex.exerciseId}-${index}`} className="flex items-center gap-3 py-3"><span className="w-5 text-xs font-black text-slate-300">{String(index+1).padStart(2,"0")}</span><span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-800">{ex.exerciseName}</span><span className="text-xs font-bold text-slate-600">{ex.defaultSets} sets</span></div>)}</div><div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2"><button disabled={Boolean(activeWorkout)} onClick={()=>startSavedWorkout(workout)} className="rounded-xl bg-blue-500 py-3 font-black text-white disabled:bg-slate-200 disabled:text-slate-600">{activeWorkout?"Workout active":"Start"}</button><button onClick={()=>editRoutine(workout)} className="rounded-xl border border-slate-200 px-4 text-sm font-black">Edit</button><button onClick={()=>duplicateRoutine(workout)} className="rounded-xl border border-slate-200 px-4 text-sm font-black">Copy</button></div></div>)}</div>

    {builderOpen&&<div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/45 p-3 sm:items-center"><div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">Routine Builder</p><h3 className="mt-1 text-3xl font-black">{editingRoutineId ? "Edit routine" : "Design the session"}</h3><p className="mt-1 text-sm text-slate-500">Order exercises, define targets, then save it like any routine you created yourself.</p></div><button onClick={()=>setBuilderOpen(false)} className="h-10 w-10 rounded-xl bg-slate-100 font-black">×</button></div>
      <input value={routineName} onChange={e=>setRoutineName(e.target.value)} placeholder="Routine name — e.g. Push A" className="mt-5 w-full rounded-2xl border border-slate-200 p-4 text-lg font-bold outline-none focus:border-blue-400"/>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><div><div className="flex items-center justify-between"><p className="text-sm font-black">Session order</p><span className="text-xs font-bold text-slate-600">{builderExercises.length} exercises</span></div><div className="mt-3 space-y-3">{builderExercises.map((item,index)=><div key={item.exercise.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="flex flex-col gap-1"><button onClick={()=>moveExercise(index,-1)} className="text-xs text-slate-600">▲</button><button onClick={()=>moveExercise(index,1)} className="text-xs text-slate-600">▼</button></div><ExerciseMedia name={item.exercise.name} compact/><div className="min-w-0"><p className="truncate font-black">{item.exercise.name}</p><p className="text-xs text-slate-600">{item.exercise.muscleGroup}</p></div></div><button onClick={()=>setBuilderExercises(c=>c.filter(x=>x.exercise.id!==item.exercise.id))} className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 font-black text-rose-500">×</button></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5"><BuilderNumber label="Sets" value={item.sets} onChange={v=>setBuilderExercises(c=>c.map(x=>x.exercise.id===item.exercise.id?{...x,sets:Math.max(1,v)}:x))}/><BuilderNumber label="Min reps" value={item.minReps} onChange={v=>setBuilderExercises(c=>c.map(x=>x.exercise.id===item.exercise.id?{...x,minReps:Math.max(1,v)}:x))}/><BuilderNumber label="Max reps" value={item.maxReps} onChange={v=>setBuilderExercises(c=>c.map(x=>x.exercise.id===item.exercise.id?{...x,maxReps:Math.max(1,v)}:x))}/><BuilderNumber label="RIR" value={item.rir} onChange={v=>setBuilderExercises(c=>c.map(x=>x.exercise.id===item.exercise.id?{...x,rir:Math.max(0,v)}:x))}/><BuilderNumber label="Rest sec" value={item.rest} onChange={v=>setBuilderExercises(c=>c.map(x=>x.exercise.id===item.exercise.id?{...x,rest:Math.max(30,v)}:x))}/></div></div>)}{!builderExercises.length&&<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">Choose exercises from the library on the right.</div>}</div></div>
      <div className="rounded-2xl bg-slate-50 p-4"><p className="mb-3 text-sm font-black">Exercise library</p><input value={routineSearch} onChange={e=>setRoutineSearch(e.target.value)} placeholder="Search exercise..." className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none"/><div className="mt-3 max-h-[460px] space-y-2 overflow-y-auto">{exercises.filter(e=>e.name.toLowerCase().includes(routineSearch.toLowerCase())).slice(0,50).map(e=><button key={e.id} onClick={()=>addBuilderExercise(e)} className="flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left hover:ring-1 hover:ring-blue-400"><ExerciseMedia name={e.name} compact/><div><p className="text-sm font-bold">{e.name}</p><p className="text-xs text-slate-600">{e.muscleGroup}</p></div><span className="ml-auto text-xl text-blue-500">+</span></button>)}</div></div></div>
      <div className="mt-6 flex gap-3"><button onClick={()=>setBuilderOpen(false)} className="rounded-2xl border border-slate-200 px-5 py-4 font-black">Cancel</button><button disabled={!routineName.trim()||!builderExercises.length} onClick={saveRoutine} className="flex-1 rounded-2xl bg-blue-500 py-4 font-black text-white disabled:bg-slate-200 disabled:text-slate-600">{editingRoutineId ? "Save changes" : "Save as routine"}</button></div>
    </div></div>}
  </section>;
}

function HistoryTab({ history, deleteHistoryEntry, displayUnits }: { history: WorkoutHistoryEntry[]; deleteHistoryEntry: (id:string)=>void; displayUnits:"metric"|"imperial"; }) {
  const [openWorkoutId,setOpenWorkoutId]=useState<string|null>(null);
  const [query,setQuery]=useState("");
  const [monthOffset,setMonthOffset]=useState(0);
  const sorted=[...history].sort((a,b)=>new Date(b.finishedAt).getTime()-new Date(a.finishedAt).getTime());
  const filtered=sorted.filter(w=>w.name.toLowerCase().includes(query.toLowerCase())||w.exercises.some(e=>e.exerciseName.toLowerCase().includes(query.toLowerCase())));
  const volume=(w:WorkoutHistoryEntry)=>w.exercises.reduce((a,e)=>a+e.sets.reduce((b,set)=>b+set.weight*set.reps,0),0);
  const sets=(w:WorkoutHistoryEntry)=>w.exercises.reduce((a,e)=>a+e.sets.length,0);
  const last30=history.filter(w=>Date.now()-new Date(w.finishedAt).getTime()<30*86400000);
  const thisWeek=history.filter(w=>Date.now()-new Date(w.finishedAt).getTime()<7*86400000).length;
  const avg=last30.length?Math.round(last30.reduce((a,w)=>a+w.durationSeconds,0)/last30.length):0;
  const calendarMonth=new Date();
  calendarMonth.setDate(1);
  calendarMonth.setMonth(calendarMonth.getMonth()+monthOffset);
  const leadingDays=(calendarMonth.getDay()+6)%7;
  const daysInMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,0).getDate();
  const calendarDays=Array.from({length:leadingDays+daysInMonth},(_,index)=>index<leadingDays?null:index-leadingDays+1);
  const workoutDays=new Set(history.map(workout=>{const date=new Date(workout.finishedAt);return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;}));
  return <section className="mt-2">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">Training log</p><h2 className="mt-1 text-3xl font-black tracking-tight">History</h2><p className="mt-2 text-slate-500">Every session, exercise and set — searchable and easy to inspect.</p></div><div className="grid grid-cols-3 gap-2"><WorkoutHeroStat label="This week" value={thisWeek}/><WorkoutHeroStat label="30D sessions" value={last30.length}/><WorkoutHeroStat label="Avg time" value={avg?formatDuration(avg):"—"}/></div></div>
    <div className="mt-6 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><button onClick={()=>setMonthOffset(value=>value-1)} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 font-black text-slate-500">‹</button><p className="font-black text-slate-900">{calendarMonth.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</p><button onClick={()=>setMonthOffset(value=>value+1)} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 font-black text-slate-500">›</button></div>
        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-slate-600">{["M","T","W","T","F","S","S"].map((day,index)=><span key={`${day}-${index}`}>{day}</span>)}</div>
        <div className="mt-2 grid grid-cols-7 gap-1">{calendarDays.map((day,index)=>{if(!day)return <span key={`empty-${index}`} className="aspect-square"/>;const key=`${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}-${day}`;const trained=workoutDays.has(key);const today=new Date();const isToday=today.getFullYear()===calendarMonth.getFullYear()&&today.getMonth()===calendarMonth.getMonth()&&today.getDate()===day;return <div key={key} className={`relative grid aspect-square place-items-center rounded-xl text-xs font-black ${trained?"bg-blue-500 text-white":isToday?"border border-blue-300 bg-blue-50 text-blue-700":"text-slate-600"}`}>{day}{trained&&<span className="absolute bottom-1 h-1 w-1 rounded-full bg-white"/>}</div>;})}</div>
        <p className="mt-4 text-xs font-semibold text-slate-600"><span className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-500"/> Finished workout</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search workout or exercise..." className="h-full min-h-14 w-full rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-200"/></div>
    </div>
    {!filtered.length?<div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><p className="font-black text-slate-900">No workouts found</p><p className="mt-1 text-sm text-slate-500">Finished sessions will build your training timeline here.</p></div>:<div className="mt-6 space-y-3">{filtered.map((workout,index)=>{const isOpen=openWorkoutId===workout.id;const v=volume(workout);const s=sets(workout);const prev=filtered[index+1];const delta=prev&&volume(prev)>0?Math.round((v-volume(prev))/volume(prev)*100):null;return <article key={workout.id} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm"><button onClick={()=>setOpenWorkoutId(isOpen?null:workout.id)} className="w-full p-5 text-left"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-lg font-black text-slate-950">{workout.name}</h3>{delta!==null&&Math.abs(delta)>=2&&<span className={`rounded-full px-2 py-1 text-[10px] font-black ${delta>=0?"bg-blue-50 text-blue-700":"bg-slate-100 text-slate-500"}`}>{delta>=0?"+":""}{delta}% volume</span>}</div><p className="mt-1 text-sm text-slate-600">{formatDate(workout.finishedAt)} · {workout.exercises.length} exercises</p></div><span className="text-slate-300">{isOpen?"⌃":"⌄"}</span></div><div className="mt-4 grid grid-cols-3 gap-2"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase text-slate-600">Duration</p><p className="mt-1 text-sm font-black">{formatDuration(workout.durationSeconds)}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase text-slate-600">Sets</p><p className="mt-1 text-sm font-black">{s}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase text-slate-600">Volume</p><p className="mt-1 truncate text-sm font-black">{formatStoredVolume(v,displayUnits)}</p></div></div></button>{isOpen&&<div className="border-t border-slate-100 bg-slate-50/60 p-5"><div className="space-y-3">{workout.exercises.map(exercise=><div key={exercise.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><div><p className="font-black">{exercise.exerciseName}</p><p className="text-xs text-slate-600">{exercise.sets.length} sets</p></div><p className="text-xs font-black text-blue-600">Best {exercise.sets.length?formatStoredWeight([...exercise.sets].sort((a,b)=>estimated1RM(b.weight,b.reps)-estimated1RM(a.weight,a.reps))[0].weight,displayUnits):"—"}</p></div><div className="mt-3 flex flex-wrap gap-2">{exercise.sets.map((set,i)=><span key={set.id} className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"><span className="mr-1 text-slate-300">{i+1}</span>{formatStoredWeight(set.weight,displayUnits)} × {set.reps}{set.rir!==null?` · ${set.rir} RIR`:""}</span>)}</div></div>)}</div><button onClick={()=>deleteHistoryEntry(workout.id)} className="mt-5 rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-black text-rose-500">Delete workout</button></div>}</article>})}</div>}
  </section>;
}


function ExercisesTab({
  exercises,
  history,
  displayUnits,
  customExercises,
  addCustomExercise,
  deleteCustomExercise,
}: {
  exercises: Exercise[];
  history: WorkoutHistoryEntry[];
  displayUnits: "metric" | "imperial";
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
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(EXERCISE_FAVORITES_KEY) || "[]"); } catch { return []; }
  });
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [newName, setNewName] =
    useState("");

  const [newMuscle, setNewMuscle] =
    useState<MuscleGroup>("Chest");

  useEffect(() => {
    localStorage.setItem(EXERCISE_FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const filtered = exercises.filter(
    (exercise) => {
      const matchesSearch =
        exercise.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesMuscle =
        muscleFilter === "All" ||
        exercise.muscleGroup === muscleFilter;

      const matchesFavorite = !favoritesOnly || favorites.includes(exercise.id);
      return matchesSearch && matchesMuscle && matchesFavorite;
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

          <p className="mt-2 text-slate-500">
            Search CYG exercises or
            create your own.
          </p>
        </div>

        <button
          onClick={() =>
            setShowCreate(!showCreate)
          }
          className="rounded-xl bg-blue-400 px-5 py-3 font-semibold text-white"
        >
          + Create exercise
        </button>
      </div>

      {showCreate && (
        <div className="mt-6 rounded-3xl border border-blue-400/30 bg-white p-6">
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
              className="rounded-xl border border-slate-300 bg-white p-4 outline-none focus:border-blue-400"
            />

            <select
              value={newMuscle}
              onChange={(event) =>
                setNewMuscle(
                  event.target
                    .value as MuscleGroup
                )
              }
              className="rounded-xl border border-slate-300 bg-white p-4 outline-none focus:border-blue-400"
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
              className="rounded-xl bg-blue-400 px-6 font-semibold text-white"
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
        className="mt-6 w-full rounded-xl border border-slate-300 bg-white p-4 outline-none focus:border-blue-400"
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
              role="button"
              tabIndex={0}
              onClick={() => setSelectedExercise(exercise)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedExercise(exercise); }}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <ExerciseMedia name={exercise.name} compact />
                <div className="min-w-0">
                <p className="truncate font-black text-slate-900">
                  {exercise.name}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {exercise.muscleGroup}
                  {isCustom
                    ? " • Custom"
                  : ""}
                </p>
                </div>
              </div>

              {isCustom && (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteCustomExercise(
                      exercise.id
                    );
                  }}
                  className="ml-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-500"
                >
                  Delete
                </button>
              )}
              {!isCustom && <span className="ml-3 text-lg font-black text-blue-500 transition group-hover:translate-x-0.5">›</span>}
            </div>
          );
        })}
      </div>

      {selectedExercise && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-950/45 p-3 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Exercise Detail</p><h2 className="mt-1 text-3xl font-black">{selectedExercise.name}</h2><p className="mt-1 text-sm text-slate-600">{selectedExercise.muscleGroup}</p></div>
              <button onClick={() => setSelectedExercise(null)} className="h-10 w-10 rounded-xl bg-slate-100 font-black">×</button>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
              <div><ExerciseMedia name={selectedExercise.name}/><p className="mt-4 text-sm leading-6 text-slate-600">{exerciseInstructions(selectedExercise.name)}</p></div>
              <ExerciseDetailStats history={history} exerciseId={selectedExercise.id} displayUnits={displayUnits} />
            </div>
          </div>
        </div>
      )}
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
      role="tab"
      aria-selected={active}
      onClick={() => setActiveTab(tab)}
      className={`min-w-0 rounded-xl px-2 py-3 text-center text-[10px] font-black uppercase tracking-tight transition sm:px-4 sm:text-sm sm:normal-case ${
        active
          ? "bg-blue-500 text-white shadow-sm"
          : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
      }`}
    >
      <TrainingNavIcon name={name}/><span>{name}</span>
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
          ? "border-blue-400 bg-blue-400 text-white"
          : "border-slate-300 text-slate-500 hover:text-white"
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
  exerciseId: string,
  displayUnits: "metric" | "imperial"
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
              `${formatStoredWeight(set.weight, displayUnits)} × ${set.reps}`
          )
          .join(" | ");
      }
    }
  }

  return null;
}

function getPreviousSet(
  history: WorkoutHistoryEntry[],
  exerciseId: string,
  setIndex: number
): WorkoutSet | null {
  for (const workout of history) {
    const set = workout.exercises.find((item) => item.exerciseId === exerciseId)?.sets[setIndex];
    if (set && (set.weight > 0 || set.reps > 0)) return set;
  }
  return null;
}

function getPreviousSetText(
  history: WorkoutHistoryEntry[],
  exerciseId: string,
  setIndex: number,
  displayUnits: "metric" | "imperial"
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
      return `${formatStoredWeight(set.weight, displayUnits)} × ${set.reps}`;
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

function estimateRoutineMinutes(workout: SavedWorkout) {
  const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.defaultSets, 0);
  // Approx. 45 s per set, 105 s recovery per gap and 2 min between exercises.
  const recoveryGaps = Math.max(0, totalSets - workout.exercises.length);
  return Math.max(15, Math.round((totalSets * 45 + recoveryGaps * 105 + workout.exercises.length * 120) / 60));
}


function LiveMetric({label,value}:{label:string;value:string|number}) {
  return <div className="rounded-2xl bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{label}</p><p className="mt-1 font-mono text-sm font-black text-slate-900">{value}</p></div>;
}
function SummaryMetric({label,value}:{label:string;value:string|number}) {
  return <div className="rounded-2xl bg-slate-50 p-4 text-center"><p className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</p><p className="mt-2 text-lg font-black">{value}</p></div>;
}
function BuilderNumber({label,value,onChange}:{label:string;value:number;onChange:(v:number)=>void}) {
  return <label className="text-xs font-bold text-slate-500">{label}<input type="number" min="1" value={value} onChange={e=>onChange(Number(e.target.value)||1)} className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-center text-sm font-black text-slate-900"/></label>;
}
function ExerciseProgressMini({history,exerciseId,displayUnits}:{history:WorkoutHistoryEntry[];exerciseId:string;displayUnits:"metric"|"imperial"}) {
  const performances=history.flatMap(w=>w.exercises.filter(e=>e.exerciseId===exerciseId).flatMap(e=>e.sets.map(set=>({weight:set.weight,reps:set.reps}))));
  const best=performances.reduce((m,p)=>p.weight>m.weight?p:m,{weight:0,reps:0});
  const last=performances[0];
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-slate-600">Progress</p><div className="mt-3 grid grid-cols-2 gap-2"><div><p className="text-xs text-slate-600">Best</p><p className="font-black">{formatStoredWeight(best.weight||0, displayUnits)}</p></div><div><p className="text-xs text-slate-600">Last</p><p className="font-black">{last?`${formatStoredWeight(last.weight, displayUnits)} × ${last.reps}`:"—"}</p></div></div></div>;
}


function estimated1RM(weight: number, reps: number) {
  if (!weight || !reps) return 0;
  return weight * (1 + reps / 30);
}

function ExerciseDetailStats({ history, exerciseId, displayUnits }: { history: WorkoutHistoryEntry[]; exerciseId: string; displayUnits: "metric" | "imperial" }) {
  const sessions = history.flatMap((workout) =>
    workout.exercises
      .filter((exercise) => exercise.exerciseId === exerciseId)
      .map((exercise) => ({
        date: workout.finishedAt,
        volume: exercise.sets.reduce((sum, set) => sum + set.weight * set.reps, 0),
        best: exercise.sets.reduce((best, set) => estimated1RM(set.weight, set.reps) > estimated1RM(best.weight, best.reps) ? set : best, { id:"", weight:0, reps:0, rir:null, completed:false } as WorkoutSet)
      }))
  ).slice(0, 12);
  const bestWeight = sessions.reduce((m, row) => Math.max(m, row.best.weight), 0);
  const bestE1rm = sessions.reduce((m, row) => Math.max(m, estimated1RM(row.best.weight, row.best.reps)), 0);
  const maxVolume = sessions.reduce((m, row) => Math.max(m, row.volume), 0);
  const chartMax = Math.max(1, ...sessions.map((row) => estimated1RM(row.best.weight, row.best.reps)));

  return <div>
    <div className="grid grid-cols-3 gap-3">
      <SummaryMetric label="Best weight" value={formatStoredWeight(bestWeight, displayUnits)} />
      <SummaryMetric label="Est. 1RM" value={formatEstimatedWeight(bestE1rm, displayUnits)} />
      <SummaryMetric label="Best volume" value={formatStoredVolume(maxVolume, displayUnits)} />
    </div>
    <div className="mt-5 rounded-2xl border border-slate-200 p-4">
      <p className="text-sm font-black">Strength trend · e1RM</p>
      <div className="mt-5 flex h-40 items-end gap-2">
        {[...sessions].reverse().map((row, index) => {
          const value = estimated1RM(row.best.weight, row.best.reps);
          return <div key={`${row.date}-${index}`} className="flex flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[9px] font-bold text-slate-600">{Math.round(value)}</span>
            <div className="w-full rounded-t-lg bg-blue-400" style={{height:`${Math.max(6,(value/chartMax)*110)}px`}} />
          </div>;
        })}
      </div>
    </div>
    <div className="mt-5 space-y-2">
      {sessions.map((row, index) => <div key={`${row.date}-${index}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
        <span className="text-slate-500">{new Date(row.date).toLocaleDateString()}</span>
        <span className="font-black">{formatStoredWeight(row.best.weight, displayUnits)} × {row.best.reps} · e1RM {formatEstimatedWeight(estimated1RM(row.best.weight,row.best.reps), displayUnits)}</span>
      </div>)}
      {!sessions.length && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No exercise history yet.</p>}
    </div>
  </div>;
}

function AnalyticsTab({ history, exercises, displayUnits }: { history: WorkoutHistoryEntry[]; exercises: Exercise[]; displayUnits: "metric" | "imperial" }) {
  const [range,setRange]=useState<30|90|365>(90);
  const [selectedExercise,setSelectedExercise]=useState<string>("");
  const cutoff=Date.now()-range*86400000;
  const recent=[...history].filter(w=>new Date(w.finishedAt).getTime()>=cutoff).sort((a,b)=>new Date(a.finishedAt).getTime()-new Date(b.finishedAt).getTime());
  const totalSets=recent.reduce((a,w)=>a+w.exercises.reduce((b,e)=>b+e.sets.length,0),0);
  const totalVolume=recent.reduce((a,w)=>a+w.exercises.reduce((b,e)=>b+e.sets.reduce((c,set)=>c+set.weight*set.reps,0),0),0);
  const avgDuration=recent.length?Math.round(recent.reduce((a,w)=>a+w.durationSeconds,0)/recent.length):0;
  const trainingDays=new Set(recent.map(w=>new Date(w.finishedAt).toDateString())).size;
  const muscleSets:Record<string,number>={};
  recent.forEach(w=>w.exercises.forEach(ex=>{const muscle=exercises.find(e=>e.id===ex.exerciseId)?.muscleGroup||"Other";muscleSets[muscle]=(muscleSets[muscle]||0)+ex.sets.length;}));
  const maxMuscle=Math.max(1,...Object.values(muscleSets));
  const weeklyTarget=12;
  const exerciseNames=Array.from(new Map(history.flatMap(w=>w.exercises).map(e=>[e.exerciseId,e.exerciseName])).entries());
  const chosen=selectedExercise||exerciseNames[0]?.[0]||"";
  const performances=history.flatMap(w=>w.exercises.filter(e=>e.exerciseId===chosen).map(e=>({date:w.finishedAt,best:e.sets.reduce((best,set)=>Math.max(best,estimated1RM(set.weight,set.reps)),0),volume:e.sets.reduce((a,set)=>a+set.weight*set.reps,0),bestSet:[...e.sets].sort((a,b)=>estimated1RM(b.weight,b.reps)-estimated1RM(a.weight,a.reps))[0]}))).sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
  const maxE=Math.max(1,...performances.map(p=>p.best));
  const minE=Math.min(...performances.map(p=>p.best),maxE);
  const first=performances[0]?.best||0,last=performances.at(-1)?.best||0;
  const change=first?((last-first)/first)*100:0;
  const weekly:Array<{label:string;count:number;volume:number}>=[];
  for(let i=7;i>=0;i--){const start=Date.now()-(i+1)*7*86400000,end=Date.now()-i*7*86400000;const ws=history.filter(w=>{const t=new Date(w.finishedAt).getTime();return t>=start&&t<end});weekly.push({label:`W${8-i}`,count:ws.length,volume:ws.reduce((a,w)=>a+w.exercises.reduce((b,e)=>b+e.sets.reduce((c,set)=>c+set.weight*set.reps,0),0),0)});}
  const maxWeek=Math.max(1,...weekly.map(w=>w.count));
  return <section className="mt-8">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">Performance center</p><h2 className="mt-1 text-3xl font-black tracking-tight">Progress</h2><p className="mt-2 max-w-2xl text-slate-500">Strength trends, consistency, workload and muscle distribution — built from your actual sessions.</p></div><div className="flex rounded-xl bg-slate-100 p-1">{([30,90,365] as const).map(days=><button key={days} onClick={()=>setRange(days)} className={`rounded-lg px-4 py-2 text-xs font-black ${range===days?"bg-white text-slate-950 shadow-sm":"text-slate-500"}`}>{days===365?"1Y":`${days}D`}</button>)}</div></div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><SummaryMetric label="Workouts" value={recent.length}/><SummaryMetric label="Training days" value={trainingDays}/><SummaryMetric label="Working sets" value={totalSets}/><SummaryMetric label="Total volume" value={formatStoredVolume(totalVolume,displayUnits)}/></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-slate-600">Strength trend</p><h3 className="mt-1 text-xl font-black">Exercise progression</h3></div><select value={chosen} onChange={e=>setSelectedExercise(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold outline-none">{exerciseNames.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></div>{performances.length?<><div className="mt-5 flex items-end gap-4"><div><p className="text-3xl font-black">{formatEstimatedWeight(last,displayUnits)}</p><p className="text-xs font-bold text-slate-600">Current estimated 1RM</p></div><span className={`mb-4 rounded-full px-3 py-1 text-xs font-black ${change>=0?"bg-blue-50 text-blue-700":"bg-rose-50 text-rose-600"}`}>{change>=0?"+":""}{change.toFixed(1)}%</span></div><div className="mt-6 flex h-40 items-end gap-2 border-b border-slate-100 pb-2">{performances.slice(-14).map((p,i)=>{const h=maxE===minE?70:20+((p.best-minE)/(maxE-minE))*80;return <div key={`${p.date}-${i}`} className="group flex h-full flex-1 items-end"><div title={`${new Date(p.date).toLocaleDateString()} · ${formatEstimatedWeight(p.best,displayUnits)}`} className="w-full rounded-t-md bg-blue-400 transition hover:bg-blue-500" style={{height:`${h}%`}}/></div>})}</div><div className="mt-4 grid grid-cols-3 gap-2"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase text-slate-600">Sessions</p><p className="mt-1 font-black">{performances.length}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase text-slate-600">Best e1RM</p><p className="mt-1 font-black">{formatEstimatedWeight(maxE,displayUnits)}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase text-slate-600">Last volume</p><p className="mt-1 truncate font-black">{formatStoredVolume(performances.at(-1)?.volume||0,displayUnits)}</p></div></div></>:<p className="mt-8 rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">Log this exercise a few times to unlock its strength curve.</p>}</div>
      <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-blue-400">Training pulse</p><h3 className="mt-1 text-xl font-black">Consistency</h3><div className="mt-7 flex h-32 items-end gap-2">{weekly.map(w=><div key={w.label} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="rounded-t-md bg-blue-400" style={{height:`${Math.max(6,(w.count/maxWeek)*100)}%`}}/><p className="text-center text-[9px] font-bold text-slate-500">{w.label}</p></div>)}</div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-600">Avg session</p><p className="mt-1 text-lg font-black">{avgDuration?formatDuration(avgDuration):"—"}</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-600">Per week</p><p className="mt-1 text-lg font-black">{(recent.length/(range/7)).toFixed(1)}</p></div></div></div>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-slate-600">Workload</p><h3 className="mt-1 text-xl font-black">Weekly muscle targets</h3></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">Target {weeklyTarget}</span></div>
        <div className="mt-6 space-y-4">{Object.entries(muscleSets).sort((a,b)=>b[1]-a[1]).map(([muscle,sets])=>{const progress=Math.min(100,(sets/weeklyTarget)*100);return <div key={muscle}><div className="flex justify-between text-sm"><span className="font-bold">{muscle}</span><span className="font-bold text-slate-600">{sets} / {weeklyTarget} sets</span></div><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{width:`${progress}%`}}/></div></div>})}{!Object.keys(muscleSets).length&&<p className="text-sm text-slate-600">Finish workouts to unlock muscle analytics.</p>}</div>
      </div>
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wider text-slate-600">Muscle map</p><h3 className="mt-1 text-xl font-black">What you trained</h3><p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">Darker green means more completed working sets in the selected period.</p></div><div className="grid grid-cols-2 gap-2 text-center text-[10px] font-black"><MuscleMapTile name="Chest" sets={muscleSets.Chest||0} max={maxMuscle}/><MuscleMapTile name="Back" sets={muscleSets.Back||0} max={maxMuscle}/><MuscleMapTile name="Shoulders" sets={muscleSets.Shoulders||0} max={maxMuscle}/><MuscleMapTile name="Arms" sets={(muscleSets.Biceps||0)+(muscleSets.Triceps||0)} max={maxMuscle}/><MuscleMapTile name="Legs" sets={(muscleSets.Quads||0)+(muscleSets.Hamstrings||0)+(muscleSets.Glutes||0)+(muscleSets.Calves||0)} max={maxMuscle}/><MuscleMapTile name="Abs" sets={muscleSets.Abs||0} max={maxMuscle}/></div></div><div className="mt-5 space-y-3"><InsightRow title={recent.length>=range/14?"Training frequency is established":"Build more consistency"} detail={recent.length?`${recent.length} sessions in the selected period · ${(recent.length/(range/7)).toFixed(1)} per week.`:"Complete your first sessions to establish a baseline."}/><InsightRow title={change>2?"Strength is trending up":change<-2?"Strength trend has dipped":"Strength is stable"} detail={performances.length>=2?`Selected exercise e1RM changed ${change>=0?"+":""}${change.toFixed(1)}% across logged sessions.`:"Choose an exercise with multiple logged sessions for a strength trend."}/></div></div>
    </div>
  </section>;
}

function MuscleMapTile({name,sets,max}:{name:string;sets:number;max:number}) {
  const opacity=sets?Math.max(.24,Math.min(1,sets/Math.max(max,1))):.08;
  return <div className="rounded-2xl border border-blue-100 p-2" style={{backgroundColor:`rgba(16,185,129,${opacity})`}}><p className="text-slate-900">{name}</p><p className="mt-1 text-[9px] font-bold text-slate-600">{sets} sets</p></div>;
}

function InsightRow({title,detail}:{title:string;detail:string}){return <div className="rounded-2xl bg-slate-50 p-4"><div className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-400"/><div><p className="text-sm font-black text-slate-900">{title}</p><p className="mt-1 text-sm leading-5 text-slate-500">{detail}</p></div></div></div>}

function WorkoutV2Chip({title,detail}:{title:string;detail:string}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-black text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function WorkoutHeroStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}

function makeId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function estimateWorkoutCalories(startedAt: string, finishedAt: Date, exercises: WorkoutExercise[] = []) {
  const minutes = Math.max(0, Math.min(180, (finishedAt.getTime() - Date.parse(startedAt)) / 60000));
  const bodyWeight = getWorkoutWeight();
  const cardio = exercises.filter(exercise => exercise.cardio);
  const cardioMinutes = cardio.reduce((sum, exercise) => sum + Math.max(0, exercise.cardio?.durationMinutes || 0), 0);
  const strengthMinutes = exercises.some(exercise => !exercise.cardio) ? Math.max(0, minutes - cardioMinutes) : 0;
  return Math.round(4.5 * 3.5 * bodyWeight / 200 * strengthMinutes + cardio.reduce((sum, exercise) => sum + cardioCalories(exercise, bodyWeight), 0));
}
