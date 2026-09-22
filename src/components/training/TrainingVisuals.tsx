"use client";

import flatArt from "./assets/cyg-flat-bench.png";
import smithArt from "./assets/cyg-smith-incline.png";
import shoulderArt from "./assets/cyg-seated-db-press.png";
import rowArt from "./assets/cyg-supported-t-bar-row.png";
import muscles from "./assets/muscles-v2.png";
import type { ReactNode } from "react";
import type { MuscleGroup } from "./types";

const url = (image: unknown) => typeof image === "string" ? image : (image as {src:string}).src;
const normalize = (name:string) => name.toLowerCase().replace(/[-–]/g," ").replace(/\s+/g," ").trim();
const artwork: Record<string, unknown> = {
 "lever lying t bar row":rowArt,"chest supported t bar row":rowArt,
 "seated dumbbell shoulder press":shoulderArt,
 "barbell bench press":flatArt,"flat barbell bench press":flatArt,"bench press":flatArt,
 "smith machine incline bench press":smithArt,
};
export function hasExerciseArt(name:string) { return Boolean(artwork[normalize(name)]); }
export function ExerciseArt({name,compact=false}:{name:string;compact?:boolean}) {
 const asset=artwork[normalize(name)];
 if(asset) return <div className={`mv-exercise-art cyg-anatomical-art ${compact?'compact':''}`}><img src={url(asset)} alt={`${name}: anatomical exercise illustration with highlighted muscles`} loading="lazy"/></div>;
 return <div className={`mv-exercise-art cyg-art-pending ${compact?'compact':''}`}><span>{compact?'CYG':name}</span><small>Illustration in preparation</small></div>;
}
const groups: MuscleGroup[] = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Hamstrings", "Glutes", "Calves", "Abs"];

export function AnatomyMap({
  counts,
  selected,
  onSelect,
}: {
  counts: Partial<Record<MuscleGroup, number>>;
  selected?: string;
  onSelect?: (group: MuscleGroup) => void;
}) {
  const active =
    selected ||
    Object.entries(counts)
      .filter(([, value]) => value && value > 0)
      .sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]?.[0];
  const index = active && groups.includes(active as MuscleGroup) ? groups.indexOf(active as MuscleGroup) + 1 : 11;

  return (
    <div className="mv-anatomy-wrap">
      <div
        className="mv-anatomy-v2"
        role="img"
        aria-label={active ? `${active} muscle illustration` : "Front and back anatomy"}
        style={{
          backgroundImage: `url(${url(muscles)})`,
          backgroundPosition: `${((index % 4) * 100) / 3}% ${Math.floor(index / 4) * 50}%`,
        }}
      />
      {onSelect && (
        <select aria-label="Muscle shown" className="mv-muscle-select" value={active || ""} onChange={(event) => onSelect(event.target.value as MuscleGroup)}>
          <option value="" disabled>Select muscle</option>
          {groups.map((group) => (
            <option key={group} value={group}>{group} · {counts[group] || 0} sets</option>
          ))}
        </select>
      )}
    </div>
  );
}

export function TrainingNavIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    Workout: <><path d="M6 5v14M3 8v8M18 5v14M21 8v8M6 12h12" /></>,
    Exercises: <><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></>,
    History: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4m8-4v4M4 10h16M8 14h3m2 3h3" /></>,
    Progress: <><path d="M4 20V12h3v8zm6 0V7h3v13zm6 0V3h3v17z" /></>,
    Routines: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
