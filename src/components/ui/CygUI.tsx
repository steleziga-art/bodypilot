import type { ReactNode } from "react";

export function CygIcon({name,size=22,...props}:{name:string;size?:number;className?:string}) {
 const paths:Record<string,ReactNode>={
  home:<><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></>,
  workout:<><path d="M6 5v14M3 8v8M18 5v14M21 8v8M6 12h12"/></>,
  nutrition:<><path d="M12 7c-6-5-11 1-8 8 2 5 5 7 8 5 3 2 6 0 8-5 3-7-2-13-8-8Z"/><path d="M12 7c-1-3 1-5 4-5 0 3-1 5-4 5Z"/></>,
  progress:<><path d="M5 20V11h3v9M11 20V6h3v14M17 20V2h3v18"/></>,
  more:<><path d="M9 5h12M9 12h12M9 19h12"/><circle cx="3" cy="5" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="19" r="1"/></>,
  calendar:<><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2"/></>,
  clock:<><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6M12 2v3"/></>,
  arrow:<path d="M4 12h15m-5-5 5 5-5 5"/>,
  chevron:<path d="m9 5 7 7-7 7"/>,
  back:<path d="m15 5-7 7 7 7"/>,
  plus:<path d="M12 5v14M5 12h14"/>,
  check:<path d="m5 12 4 4L19 6"/>,
  close:<path d="m6 6 12 12M6 18 18 6"/>,
  play:<path d="m8 4 12 8-12 8Z"/>,
  target:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
  user:<><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
  trophy:<><path d="M8 3h8v7a4 4 0 0 1-8 0ZM8 5H4v3c0 3 2 4 5 4M16 5h4v3c0 3-2 4-5 4M12 14v6M8 21h8"/></>,
  flame:<path d="M12 2c2 6 7 6 7 12a7 7 0 0 1-14 0c0-3 2-5 3-7 0 4 2 4 2 4s4-3 2-9Z"/>,
  edit:<><path d="m16 3 5 5-12 12-6 1 1-6Z"/><path d="m13 6 5 5"/></>,
  share:<><path d="M12 16V3m-5 5 5-5 5 5M5 12H3v9h18v-9h-2"/></>,
  delete:<><path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/></>,
  dots:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  search:<><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
  sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/></>,
  moon:<path d="M20 15A9 9 0 0 1 9 3 9 9 0 1 0 20 15Z"/>,
  water:<path d="M12 2S4 11 4 15a8 8 0 0 0 16 0c0-4-8-13-8-13Z"/>,
  bowl:<><path d="M3 11h18c0 6-4 9-9 9s-9-3-9-9ZM6 21h12M8 7V4m4 3V2m4 5V4"/></>,
  protein:<><path d="M6 4c6-4 15 2 14 9-1 5-6 9-10 6-2-2-1-5-3-7S1 7 6 4Z"/><path d="m8 8 6 6"/></>,
  friends:<><circle cx="9" cy="7" r="4"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M16 4a4 4 0 0 1 0 7m2 3a6 6 0 0 1 4 6"/></>,
  info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/></>,
  settings:<><path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="3"/><circle cx="16" cy="17" r="3"/></>,
  spark:<><path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/></>,
  book:<><path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1v15"/></>,
 };
 return <svg {...props} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.workout}</svg>;
}

export function CygBrand(){return <span className="cyg-wordmark" aria-label="CYG Choose Your Goal"><span>C</span>YG</span>}

export function EnergyRing({value,goal,unit="kcal",label="consumed"}:{value:number;goal:number;unit?:string;label?:string}){
 const p=Math.max(0,Math.min(1,goal>0?value/goal:0));
 return <div className="cyg-energy-ring"><svg viewBox="0 0 140 140" role="img" aria-label={`${Math.round(value)} of ${Math.round(goal)} ${unit}`}><circle className="cyg-ring-track" cx="70" cy="70" r="60"/><circle className="cyg-ring-value" cx="70" cy="70" r="60" strokeDasharray={`${p*377} 377`} transform="rotate(-90 70 70)"/></svg><div><strong>{Math.round(value).toLocaleString()}</strong><span>{unit} {label}</span><small>of {Math.round(goal).toLocaleString()}</small></div></div>;
}
export function MacroTrack({label,value,goal}:{label:string;value:number;goal:number}){
 return <div className="cyg-macro-track"><div><span>{label}</span><span><strong>{Math.round(value)}</strong> / {Math.round(goal)}g</span></div><div className="cyg-track"><i style={{width:`${Math.max(0,Math.min(100,goal?value/goal*100:0))}%`}}/></div></div>;
}
export function PageHeader({title,subtitle,action}:{title:string;subtitle?:string;action?:ReactNode}){
 return <header className="cyg-page-heading"><div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{action}</header>;
}
export function MiniTrend({values,labels=[]}:{values:number[];labels?:string[]}){
 if(values.length<2)return <div className="cyg-trend-empty"><CygIcon name="progress" size={30}/><p>Add two check-ins to see your trend.</p></div>;
 const min=Math.min(...values),max=Math.max(...values),pad=Math.max(1,(max-min)*.15),lo=min-pad,hi=max+pad;
 const pts=values.map((v,i)=>`${38+i/(values.length-1)*280},${150-(v-lo)/(hi-lo)*118}`).join(" ");
 return <svg className="cyg-mini-trend" viewBox="0 0 340 190" role="img" aria-label={`Trend from ${values[0]} to ${values.at(-1)}`}><defs><linearGradient id="cyg-trend-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#0783ff" stopOpacity=".3"/><stop offset="1" stopColor="#0783ff" stopOpacity="0"/></linearGradient></defs>{[0,.33,.66,1].map(t=><g key={t}><line x1="36" x2="322" y1={32+t*118} y2={32+t*118} className="cyg-grid-line"/><text x="28" y={36+t*118} textAnchor="end">{(hi-t*(hi-lo)).toFixed(0)}</text></g>)}<polygon points={`38,150 ${pts} 318,150`} fill="url(#cyg-trend-fill)"/><polyline points={pts} fill="none" stroke="#087aff" strokeWidth="2.8" strokeLinejoin="round"/>{values.map((v,i)=><circle key={i} cx={38+i/(values.length-1)*280} cy={150-(v-lo)/(hi-lo)*118} r={i===values.length-1?4:2} fill="#087aff"><title>{labels[i]}: {v}</title></circle>)}<text x="38" y="178">{labels[0]||"First"}</text><text x="320" y="178" textAnchor="end">{labels.at(-1)||"Latest"}</text></svg>;
}
