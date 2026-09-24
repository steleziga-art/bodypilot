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

/**
 * Older rollover bugs could write the exact same food-entry IDs on adjacent
 * dates. Normal logging and "copy yesterday" create fresh IDs, so an identical
 * consecutive ID list is a stale carry-over; retain the first day and blank
 * the duplicated days while keeping their dates available in History.
 */
export function clearRepeatedDiaryCopies<T extends { id: number | string }>(history: DatedDiary<T>[]) {
  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const clearedDates: string[] = [];
  let previousSignature: string | null = null;
  let previousDate: string | null = null;

  const next = sorted.map(day => {
    if (day.foods.length === 0) {
      previousSignature = null;
      previousDate = day.date;
      return day;
    }

    const signature = day.foods.map(food => String(food.id)).sort().join("|");
    const priorDate = previousDate ? new Date(`${previousDate}T12:00:00`) : null;
    if (priorDate) priorDate.setDate(priorDate.getDate() + 1);
    const consecutive = Boolean(priorDate && [priorDate.getFullYear(), String(priorDate.getMonth()+1).padStart(2,"0"), String(priorDate.getDate()).padStart(2,"0")].join("-") === day.date);

    if (consecutive && signature === previousSignature) {
      clearedDates.push(day.date);
      previousDate = day.date;
      return { ...day, foods: [] };
    }

    previousSignature = signature;
    previousDate = day.date;
    return day;
  });

  return { history: next, clearedDates };
}
