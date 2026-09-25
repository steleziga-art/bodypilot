"use client";

import { useMemo, useState } from "react";
import type { Exercise, WorkoutHistoryEntry, WorkoutSet } from "./types";
import { resolveExercise } from "./exerciseIdentity";

type Props = {
  exercises: Exercise[];
  onImport: (entries: WorkoutHistoryEntry[]) => void;
};

type CsvRow = Record<string, string>;

type ParsedSet = {
  date: string;
  workout: string;
  exercise: string;
  weight: number;
  reps: number;
};

const DATE_HEADERS = ["date", "workout date", "workout_date", "start date", "started at", "created at", "timestamp"];
const WORKOUT_HEADERS = ["workout", "workout name", "workout_name", "routine", "routine name", "title"];
const EXERCISE_HEADERS = ["exercise", "exercise name", "exercise_name", "movement", "movement name"];
const WEIGHT_HEADERS = ["weight", "weight kg", "weight (kg)", "kg", "load", "load kg"];
const REPS_HEADERS = ["reps", "rep", "repetitions", "repetition"];

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (ch === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function findValue(row: CsvRow, aliases: string[]) {
  for (const alias of aliases) {
    const value = row[alias];
    if (value !== undefined && value !== "") return value;
  }
  return "";
}

function parseNumber(value: string) {
  const cleaned = value.replace(/[^0-9.,-]/g, "").replace(",", ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseDate(value: string) {
  if (!value) return null;
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;
  const match = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
  if (!match) return null;
  const year = Number(match[3].length === 2 ? `20${match[3]}` : match[3]);
  const date = new Date(year, Number(match[2]) - 1, Number(match[1]), 12, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "exercise";
}

function mapExercise(name: string, exercises: Exercise[]) {
  return resolveExercise(name, exercises) ?? { id: `import-${slug(name)}`, name: name.trim() || "Imported exercise", muscleGroup: "Other" as const, custom: true };
}

function rowsToHistory(rows: ParsedSet[], exercises: Exercise[]) {
  const grouped = new Map<string, ParsedSet[]>();
  rows.forEach((row) => {
    const key = `${row.date}|${row.workout}`;
    grouped.set(key, [...(grouped.get(key) ?? []), row]);
  });

  return Array.from(grouped.entries()).map(([key, sets], workoutIndex): WorkoutHistoryEntry => {
    const date = parseDate(sets[0].date) ?? new Date();
    const workoutName = sets[0].workout || "Imported workout";
    const byExercise = new Map<string, ParsedSet[]>();
    sets.forEach((set) => byExercise.set(set.exercise, [...(byExercise.get(set.exercise) ?? []), set]));
    const finishedAt = new Date(date);
    finishedAt.setHours(12, 0, 0, 0);
    const durationSeconds = Math.max(8 * 60, 3 * 60 + sets.reduce((count, row) => count + (row.reps > 0 ? 1 : 0), 0) * 150 + byExercise.size * 90);
    const startedAt = new Date(finishedAt.getTime() - durationSeconds * 1000);

    return {
      id: `lyfta-${finishedAt.getTime()}-${workoutIndex}-${slug(workoutName)}`,
      name: workoutName,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      // The export has no session duration column. Estimate from logged work
      // instead of assigning every imported workout a misleading 60 minutes.
      durationSeconds,
      exercises: Array.from(byExercise.entries()).map(([name, exerciseSets], exerciseIndex) => {
        const mapped = mapExercise(name, exercises);
        return {
          id: `lyfta-ex-${finishedAt.getTime()}-${exerciseIndex}`,
          exerciseId: mapped.id,
          exerciseName: mapped.name,
          sets: exerciseSets.map((set, setIndex): WorkoutSet => ({
            id: `lyfta-set-${finishedAt.getTime()}-${exerciseIndex}-${setIndex}`,
            weight: Math.max(0, set.weight),
            reps: Math.max(0, Math.round(set.reps)),
            rir: null,
            completed: true,
          })),
        };
      }),
    };
  }).sort((a, b) => new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime());
}


type LyftaApiSet = {
  id?: string | number;
  weight?: string | number;
  reps?: string | number;
  rir?: string | number;
  is_completed?: boolean;
};

type LyftaApiExercise = {
  exercise_id?: string | number;
  excercise_name?: string;
  exercise_name?: string;
  sets?: LyftaApiSet[];
};

type LyftaApiWorkout = {
  id: string | number;
  title?: string;
  workout_perform_date?: string;
  exercises?: LyftaApiExercise[];
};

type LyftaApiResponse = {
  workouts?: LyftaApiWorkout[];
  error?: string;
  message?: string;
};

function apiWorkoutsToHistory(workouts: LyftaApiWorkout[], exercises: Exercise[]) {
  return workouts.flatMap((workout): WorkoutHistoryEntry[] => {
    const finishedAt = new Date(workout.workout_perform_date || "");
    if (Number.isNaN(finishedAt.getTime())) return [];
    const mappedExercises = (workout.exercises || []).map((item, exerciseIndex) => {
      const sourceName = item.excercise_name || item.exercise_name || "Imported exercise";
      const mapped = mapExercise(sourceName, exercises);
      const sets = (item.sets || []).filter((set) => set.is_completed !== false).map((set, setIndex): WorkoutSet => ({
        id: `lyfta-api-set-${workout.id}-${item.exercise_id ?? exerciseIndex}-${set.id ?? setIndex}`,
        weight: Math.max(0, Number(set.weight) || 0),
        reps: Math.max(0, Math.round(Number(set.reps) || 0)),
        rir: set.rir === "" || set.rir == null || !Number.isFinite(Number(set.rir)) ? null : Number(set.rir),
        completed: true,
      }));
      return {
        id: `lyfta-api-ex-${workout.id}-${item.exercise_id ?? exerciseIndex}`,
        exerciseId: mapped.id,
        exerciseName: mapped.name,
        sets,
      };
    }).filter((item) => item.sets.length > 0);
    const totalSets = mappedExercises.reduce((sum, item) => sum + item.sets.length, 0);
    const durationSeconds = Math.max(8 * 60, 3 * 60 + totalSets * 150 + mappedExercises.length * 90);
    const startedAt = new Date(finishedAt.getTime() - durationSeconds * 1000);
    return [{
      id: `lyfta-api-${workout.id}`,
      name: workout.title?.trim() || "Lyfta workout",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationSeconds,
      exercises: mappedExercises,
    }];
  }).sort((a, b) => Date.parse(b.finishedAt) - Date.parse(a.finishedAt));
}

export default function LyftaImport({ exercises, onImport }: Props) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ParsedSet[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const history = useMemo(() => rowsToHistory(rows, exercises), [rows, exercises]);

  async function syncLyfta() {
    setSyncing(true);
    setError("");
    setSyncMessage("");
    try {
      const response = await fetch("/api/lyfta/workouts", { cache: "no-store" });
      const data = (await response.json()) as LyftaApiResponse;
      if (!response.ok) throw new Error(data.error || data.message || "Lyfta sync failed.");
      const entries = apiWorkoutsToHistory(data.workouts || [], exercises);
      if (!entries.length) {
        setSyncMessage("Lyfta returned no completed workouts for this account. You can still import your history with CSV.");
        return;
      }
      onImport(entries);
      setSyncMessage(`Synced ${entries.length} Lyfta workout${entries.length === 1 ? "" : "s"}. Existing matching workouts are kept only once.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sync Lyfta.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    setRows([]);
    setFileName(file.name);
    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      if (parsed.length < 2) throw new Error("No workout rows found.");
      const headers = parsed[0].map(normalizeHeader);
      const objects: CsvRow[] = parsed.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
      const converted = objects.map((row) => ({
        date: findValue(row, DATE_HEADERS),
        workout: findValue(row, WORKOUT_HEADERS) || "Imported workout",
        exercise: findValue(row, EXERCISE_HEADERS),
        weight: parseNumber(findValue(row, WEIGHT_HEADERS)),
        reps: parseNumber(findValue(row, REPS_HEADERS)),
      })).filter((row) => row.exercise && row.reps > 0 && parseDate(row.date));
      if (!converted.length) {
        throw new Error("CYG could not detect Date, Exercise, Weight and Reps columns. Export the workout history as CSV and try again.");
      }
      setRows(converted);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not read this CSV file.");
    }
  }

  function confirmImport() {
    if (!history.length) return;
    onImport(history);
    setOpen(false);
    setRows([]);
    setFileName("");
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><p className="text-xs font-black uppercase tracking-widest text-blue-600">Bring your history</p><span className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">Beta</span></div>
          <h3 className="mt-1 text-lg font-black">Lyfta</h3>
          <p className="mt-1 text-sm text-slate-500">Try direct sync, or import a CSV if Lyfta does not return your completed workouts.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void syncLyfta()} disabled={syncing} className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-black text-white disabled:opacity-60">{syncing ? "Syncing…" : "Sync now"}</button>
          <button type="button" onClick={() => setOpen(true)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black">Import CSV</button>
        </div>
      </div>
      {syncMessage && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{syncMessage}</div>}
      {error && !open && <div className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}

      {open && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-950/50 p-3 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-widest text-blue-600">History import</p><h3 className="mt-1 text-2xl font-black">CSV preview</h3></div>
              <button type="button" onClick={() => setOpen(false)} className="h-10 w-10 rounded-xl bg-slate-100 font-black">×</button>
            </div>
            <label className="mt-5 block cursor-pointer rounded-2xl border border-dashed border-slate-300 p-6 text-center">
              <span className="font-black">Choose CSV file</span>
              <span className="mt-1 block text-xs text-slate-500">Your original file is not changed.</span>
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => void handleFile(event.target.files?.[0])} />
            </label>
            {fileName && <p className="mt-3 text-xs text-slate-500">{fileName}</p>}
            {error && <div className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}
            {history.length > 0 && (
              <>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-600">Workouts</p><p className="mt-1 text-xl font-black">{history.length}</p></div>
                  <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-600">Sets</p><p className="mt-1 text-xl font-black">{rows.length}</p></div>
                  <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-600">Exercises</p><p className="mt-1 text-xl font-black">{new Set(rows.map((row) => row.exercise)).size}</p></div>
                </div>
                <div className="mt-4 space-y-2">
                  {history.slice(0, 5).map((workout) => <div key={workout.id} className="rounded-xl bg-slate-50 px-4 py-3"><div className="flex justify-between gap-3"><span className="font-bold">{workout.name}</span><span className="text-xs text-slate-600">{new Date(workout.finishedAt).toLocaleDateString()}</span></div><p className="mt-1 text-xs text-slate-500">{workout.exercises.length} exercises</p></div>)}
                  {history.length > 5 && <p className="text-center text-xs text-slate-600">+ {history.length - 5} more workouts</p>}
                </div>
                <button type="button" onClick={confirmImport} className="mt-5 w-full rounded-2xl bg-blue-500 py-3.5 font-black text-white">Import {history.length} workouts</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
