"use client";

import { useMemo, useState } from "react";
import type { Exercise, WorkoutHistoryEntry, WorkoutSet } from "./types";

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
  const n = name.trim().toLowerCase();
  const exact = exercises.find((exercise) => exercise.name.trim().toLowerCase() === n);
  if (exact) return exact;
  const loose = exercises.find((exercise) => {
    const e = exercise.name.trim().toLowerCase();
    return e.includes(n) || n.includes(e);
  });
  return loose ?? { id: `import-${slug(name)}`, name: name.trim() || "Imported exercise", muscleGroup: "Other" as const, custom: true };
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
    const startedAt = new Date(finishedAt.getTime() - 60 * 60 * 1000);

    return {
      id: `lyfta-${finishedAt.getTime()}-${workoutIndex}-${slug(workoutName)}`,
      name: workoutName,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationSeconds: 3600,
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

export default function LyftaImport({ exercises, onImport }: Props) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ParsedSet[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const history = useMemo(() => rowsToHistory(rows, exercises), [rows, exercises]);

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
        throw new Error("Mucipes could not detect Date, Exercise, Weight and Reps columns. Export the workout history as CSV and try again.");
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
          <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Bring your history</p>
          <h3 className="mt-1 text-lg font-black">Import workouts from CSV</h3>
          <p className="mt-1 text-sm text-slate-500">Works with Lyfta-style workout exports that contain date, exercise, weight and reps columns.</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black">Import</button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-950/50 p-3 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-widest text-emerald-600">History import</p><h3 className="mt-1 text-2xl font-black">CSV preview</h3></div>
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
                  <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Workouts</p><p className="mt-1 text-xl font-black">{history.length}</p></div>
                  <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Sets</p><p className="mt-1 text-xl font-black">{rows.length}</p></div>
                  <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Exercises</p><p className="mt-1 text-xl font-black">{new Set(rows.map((row) => row.exercise)).size}</p></div>
                </div>
                <div className="mt-4 space-y-2">
                  {history.slice(0, 5).map((workout) => <div key={workout.id} className="rounded-xl bg-slate-50 px-4 py-3"><div className="flex justify-between gap-3"><span className="font-bold">{workout.name}</span><span className="text-xs text-slate-400">{new Date(workout.finishedAt).toLocaleDateString()}</span></div><p className="mt-1 text-xs text-slate-500">{workout.exercises.length} exercises</p></div>)}
                  {history.length > 5 && <p className="text-center text-xs text-slate-400">+ {history.length - 5} more workouts</p>}
                </div>
                <button type="button" onClick={confirmImport} className="mt-5 w-full rounded-2xl bg-emerald-500 py-3.5 font-black text-white">Import {history.length} workouts</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
