export type DatedDiary<T> = { date: string; foods: T[] };

/** Undated legacy cloud food lists are intentionally not accepted here. */
export function mergeDatedDiaries<T>(remote: DatedDiary<T>[], local: DatedDiary<T>[], existingDates: string[]) {
  // A blank local day can be created on startup before cloud loading finishes.
  // It must not erase a populated day from another device.
  const remoteByDate = new Map(remote.map(day => [day.date, day]));
  const known = new Set(existingDates);
  const meaningfulLocal = local.filter(day =>
    day.foods.length > 0 || (known.has(day.date) && !(remoteByDate.get(day.date)?.foods.length))
  );
  return Array.from(new Map([...remote, ...meaningfulLocal].map(day => [day.date, day])).values())
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function diaryForDate<T>(history: DatedDiary<T>[], date: string): T[] {
  return history.find(day => day.date === date)?.foods || [];
}
