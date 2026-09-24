/** Keep sessions in split order even when older saved preferences have gaps. */
export function splitFamily(name: string): "Push" | "Pull" | "Legs" | null {
  if (/^push\b/i.test(name.trim())) return "Push";
  if (/^pull\b/i.test(name.trim())) return "Pull";
  if (/^(legs?|lower)\b/i.test(name.trim())) return "Legs";
  return null;
}

export function orderTrainingDays<T extends { name: string }>(days: T[]): T[] {
  const families = ["Push", "Pull", "Legs"] as const;
  if (days.length < 3 || days.some(day => !splitFamily(day.name)) ||
      families.some(family => !days.some(day => splitFamily(day.name) === family))) return [...days];
  const buckets = families.map(family => days.filter(day => splitFamily(day.name) === family)
    .sort((a,b) => a.name.localeCompare(b.name, undefined, {numeric:true})));
  const result: T[] = [];
  for (let cycle = 0; cycle < Math.max(...buckets.map(bucket => bucket.length)); cycle++) {
    for (const bucket of buckets) if (bucket[cycle]) result.push(bucket[cycle]);
  }
  return result;
}

export function strengthDaySlots(count: number, preferred: number[] = []): number[] {
  const defaults: Record<number, number[]> = { 1:[0], 2:[0,3], 3:[0,2,4], 4:[0,1,3,4], 5:[0,1,2,4,5], 6:[0,1,2,4,5,6], 7:[0,1,2,3,4,5,6] };
  const total = Math.min(7,Math.max(0,Math.floor(count)));
  const days = [...new Set(preferred)].filter(day => Number.isInteger(day) && day>=0 && day<=6).sort((a,b)=>a-b).slice(0,total);
  for (const day of [...(defaults[total] || []),0,1,2,3,4,5,6]) {
    if (days.length >= total) break;
    if (!days.includes(day)) days.push(day);
  }
  // Sort AFTER filling: [Mon,Tue,Thu,Fri] + Wed must become Mon,Tue,Wed,Thu,Fri.
  return days.sort((a,b)=>a-b);
}

export function strengthWeek<T extends {name:string}>(days:T[], preferred:number[] = []) {
  const ordered = orderTrainingDays(days);
  const slots = strengthDaySlots(ordered.length,preferred);
  return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day,index)=>({
    day, index, session: ordered[slots.indexOf(index)] as T | undefined,
  }));
}
