"use client";
import oldExercises from './assets/exercises.png';
import exerciseAtlas from './assets/exercises-v2.png';
import muscles from './assets/muscles-v2.png';
import type {MuscleGroup} from './types';
const url=(image:unknown)=>typeof image==='string'?image:(image as {src:string}).src;
const names=[['barbell bench press','bench press','paused bench press'],['incline barbell bench press','incline bench press','incline chest press','paused incline bench press'],['machine chest press','chest press machine'],['seated dumbbell shoulder press','seated dumbbell press'],['pull ups','pull up','weighted pull ups','weighted pull up'],['lat pulldown','wide grip lat pulldown'],['seated cable row'],['barbell row','bent over barbell row'],['barbell back squat','barbell squat','back squat','squat'],['romanian deadlift','barbell romanian deadlift'],['leg extension','machine leg extension'],['lying leg curl','lying machine leg curl'],['dumbbell curl','dumbbell biceps curl','standing dumbbell curl','standing dumbbell biceps curl'],['preacher curl','ez bar preacher curl','barbell preacher curl'],['rope triceps pushdown','triceps rope pushdown','cable rope triceps pushdown','rope pushdown'],['dumbbell lateral raise','standing dumbbell lateral raise']];
const normalize=(n:string)=>n.toLowerCase().replace(/[-–]/g,' ').replace(/\s+/g,' ').trim();
export function exerciseArtIndex(name:string){return names.findIndex(ns=>ns.includes(normalize(name)))}
function oldIndex(name:string){const n=normalize(name);if(['incline dumbbell press','incline dumbbell bench press'].includes(n))return 0;if(['one arm dumbbell row','single arm dumbbell row'].includes(n))return 3;return -1;}
export function hasExerciseArt(name:string){return exerciseArtIndex(name)>=0||oldIndex(name)>=0}
export function ExerciseArt({name,compact=false}:{name:string;compact?:boolean}){
 const i=exerciseArtIndex(name),old=oldIndex(name),index=i>=0?i:old;
 if(index<0)return compact?null:<p className="mv-no-art">Illustration not yet available for this exercise.</p>;
 const cols=i>=0?4:3,rows=i>=0?4:2;
 return <div role="img" aria-label={`${name} illustration`} className={`mv-exercise-art ${compact?'compact':''}`} style={{backgroundImage:`url(${url(i>=0?exerciseAtlas:oldExercises)})`,backgroundSize:`${cols*100}% ${rows*100}%`,backgroundPosition:`${index%cols*100/(cols-1)}% ${Math.floor(index/cols)*100/(rows-1)}%`}}/>;
}
const groups=['Chest','Back','Shoulders','Biceps','Triceps','Quads','Hamstrings','Glutes','Calves','Abs'];
export function AnatomyMap({counts,selected,onSelect}:{counts:Partial<Record<MuscleGroup,number>>;selected?:string;onSelect?:(group:MuscleGroup)=>void}){
 const active=selected||Object.entries(counts).filter(([,v])=>v&&v>0).sort((a,b)=>(b[1]||0)-(a[1]||0))[0]?.[0];
 const index=active&&groups.includes(active)?groups.indexOf(active)+1:11;
 return <div className="mv-anatomy-wrap"><div className="mv-anatomy-v2" role="img" aria-label={active?`${active} muscle illustration`:'Front and back anatomy'} style={{backgroundImage:`url(${url(muscles)})`,backgroundPosition:`${index%4*100/3}% ${Math.floor(index/4)*50}%`}}/>{onSelect&&<select aria-label="Muscle shown" className="mv-muscle-select" value={active||''} onChange={e=>onSelect(e.target.value as MuscleGroup)}><option value="" disabled>Select muscle</option>{groups.map(g=><option key={g} value={g}>{g} · {counts[g as MuscleGroup]||0} sets</option>)}</select>}</div>;
}
export function TrainingNavIcon({name}:{name:string}){const paths:Record<string,React.ReactNode>={Workout:<><path d="M6 5v14M3 8v8M18 5v14M21 8v8M6 12h12"/></>,Exercises:<><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,History:<><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 10h16M8 14h3m2 3h3"/></>,Progress:<><path d="M4 20V12h3v8zm6 0V7h3v13zm6 0V3h3v17z"/></>,Routines:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>};return <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>}
