"use client";
import {useEffect,useMemo,useState} from "react";
import {CygIcon} from "@/components/ui/CygUI";
import {orderTrainingDays,splitFamily,strengthWeek} from "@/lib/training/schedule";
import type {SavedWorkout,WorkoutHistoryEntry} from "./types";
import {historyDurationSeconds} from "./exerciseIdentity";

export default function WorkoutOverview({routines,history,onStart,onEmpty,onNavigate}:{routines:SavedWorkout[];history:WorkoutHistoryEntry[];onStart:(routine:SavedWorkout)=>void;onEmpty:()=>void;onNavigate:(tab:"saved"|"history"|"exercises"|"analytics")=>void}){
 const today=(new Date().getDay()+6)%7;
 const [selected,setSelected]=useState(today);
 const [profile,setProfile]=useState<{trainingDays:number;preferredTrainingDays:number[]}>({trainingDays:3,preferredTrainingDays:[]});
 useEffect(()=>{try{const p=JSON.parse(localStorage.getItem("bodypilot-profile")||"{}");setProfile({trainingDays:p.trainingDays||3,preferredTrainingDays:p.preferredTrainingDays||[]})}catch{}},[]);
 const program=useMemo(()=>{
   const generated=routines.filter(r=>r.id.startsWith("bodypilot-plan-"));
   if(generated.length)return orderTrainingDays(generated).slice(0,Math.max(1,profile.trainingDays));
   const base=orderTrainingDays(routines);
   const ppl=base.length===3&&base.every(r=>splitFamily(r.name));
   return ppl&&profile.trainingDays>=5?[...base,...base.slice(0,profile.trainingDays-3).map(r=>({...r,id:r.id+"-b",name:r.name+" B"}))].slice(0,profile.trainingDays):base.slice(0,Math.max(1,profile.trainingDays));
 },[routines,profile.trainingDays]);
 const week=strengthWeek(program,profile.preferredTrainingDays);
 const chosen=week[selected]?.session;
 const next=chosen||week.slice(selected+1).find(day=>day.session)?.session||program[0];
 const monday=new Date();monday.setDate(monday.getDate()-today);monday.setHours(0,0,0,0);
 const weeklyHistory=history.filter(w=>Date.parse(w.finishedAt)>=+monday&&Date.parse(w.finishedAt)<=Date.now());
 const completedDays=new Set(weeklyHistory.map(w=>(new Date(w.finishedAt).getDay()+6)%7));
 const nSets=next?.exercises.reduce((sum,e)=>sum+e.defaultSets,0)||0;
 const minutes=Math.max(10,Math.round(nSets*2.4+(next?.exercises.length||0)*2+5));
 const split=program.every(r=>splitFamily(r.name))&&program.length>=3?"Push Pull Legs":"Your training plan";
 const recent=[...history].sort((a,b)=>Date.parse(b.finishedAt)-Date.parse(a.finishedAt)).slice(0,3);
 return <div className="cyg-workout-overview">
  <section className="cyg-current-split"><div className="cyg-card-heading"><div><h2>{split}</h2><p>Build strength. Stay consistent.</p></div><button className="mv-link" onClick={()=>onNavigate("saved")}>Edit plan</button></div><div className="cyg-workout-week">{week.map(day=><button key={day.day} aria-label={`${day.day}: ${day.session?.name||'Rest'}`} className={selected===day.index?'is-active':''} onClick={()=>setSelected(day.index)}><span>{day.day}</span><strong>{day.session?.name||'Rest'}</strong>{completedDays.has(day.index)&&<i/>}</button>)}</div></section>
  <div className="cyg-workout-home-grid"><section className="cyg-workout-photo cyg-main-workout"><img src={/pull/i.test(next?.name||'')?"/cyg/hero-athlete.png":"/cyg/hero-workout.png"} alt="Training at the gym"/><div><span className="cyg-pill">{chosen?selected===today?'Today':week[selected].day:'Next session'}</span><h3>{next?.name||'Your Workout'}{next&&/^(Push|Pull|Legs)$/.test(next.name)?' Day':''}</h3><p>{next?/pull/i.test(next.name)?'Back · Biceps':/legs|lower/i.test(next.name)?'Quads · Hamstrings · Glutes':/push/i.test(next.name)?'Chest · Shoulders · Triceps':`${next.exercises.length} exercises · Your saved routine`:'Create a workout that fits your goals.'}</p><div className="cyg-workout-meta"><span><CygIcon name="clock" size={15}/>~{minutes} min</span><span><CygIcon name="workout" size={15}/>{next?.exercises.length||0} exercises</span><span>{nSets} sets</span></div><button className="cyg-primary" onClick={()=>next?onStart(next):onEmpty()}><CygIcon name="play" size={17}/>Start Workout</button>{!chosen&&<small className="cyg-recovery-message">{week[selected].day} is a recovery day. This is your next planned session.</small>}</div></section>
  <div className="cyg-workout-overview-side"><section className="cyg-week-summary"><div className="cyg-card-heading"><h2>This Week</h2><span>{weeklyHistory.length} / {program.length||profile.trainingDays} workouts</span></div><div className="cyg-track"><i style={{width:`${Math.min(100,weeklyHistory.length/Math.max(1,program.length)*100)}%`}}/></div><div className="cyg-week-activity">{week.map(day=><div key={day.day}><span className={completedDays.has(day.index)?'is-done':day.index===today?'is-today':''}>{completedDays.has(day.index)?<CygIcon name="check" size={15}/>:'–'}</span><small>{day.day}</small></div>)}</div></section>
  <div className="cyg-workout-links">{[{title:'Workout Plan',sub:'Your routines and weekly split',icon:'calendar',tab:'saved'},{title:'Exercise Library',sub:'Find exercises and technique guides',icon:'book',tab:'exercises'},{title:'Workout History',sub:'Every session, set and personal best',icon:'clock',tab:'history'},{title:'Training Progress',sub:'Strength trends and muscle workload',icon:'progress',tab:'analytics'}].map(item=><button key={item.tab} onClick={()=>onNavigate(item.tab as "saved"|"history"|"exercises"|"analytics")}><span><CygIcon name={item.icon}/></span><div><strong>{item.title}</strong><small>{item.sub}</small></div><CygIcon name="chevron" size={16}/></button>)}</div><button className="cyg-empty-workout" onClick={onEmpty}><CygIcon name="plus" size={17}/> Start an empty workout</button></div></div>
  {recent.length>0&&<section className="cyg-recent-workouts"><div className="cyg-card-heading"><h2>Recent Workouts</h2><button className="mv-link" onClick={()=>onNavigate('history')}>View all</button></div>{recent.map(w=><button key={w.id} onClick={()=>onNavigate('history')}><span className="cyg-completed-dot"><CygIcon name="check" size={15}/></span><div><strong>{w.name}</strong><small>{new Date(w.finishedAt).toLocaleDateString('en',{month:'short',day:'numeric'})} · {Math.round(historyDurationSeconds(w)/60)} min · {w.exercises.reduce((sum,e)=>sum+e.sets.filter(s=>s.completed).length,0)} sets</small></div><CygIcon name="chevron" size={17}/></button>)}</section>}
 </div>;
}
