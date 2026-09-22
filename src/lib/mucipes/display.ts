export type MucipesDisplaySettings = {
  units: "metric" | "imperial";
  weekStarts: "monday" | "sunday";
  appearance: "light" | "dark" | "system";
  energyUnit: "kcal" | "kj";
  density: "comfortable" | "compact";
  showRir: boolean;
  restTimer: boolean;
  restSeconds: number;
};

export const defaultMucipesDisplaySettings: MucipesDisplaySettings = {
  units: "metric",
  weekStarts: "monday",
  appearance: "light",
  energyUnit: "kcal",
  density: "comfortable",
  showRir: true,
  restTimer: true,
  restSeconds: 120,
};

export function readMucipesDisplaySettings(): MucipesDisplaySettings {
  if (typeof window === "undefined") return defaultMucipesDisplaySettings;
  try {
    const raw = window.localStorage.getItem("bodypilot-settings");
    if (!raw) return defaultMucipesDisplaySettings;
    const parsed = JSON.parse(raw) as Partial<MucipesDisplaySettings>;
    return {
      ...defaultMucipesDisplaySettings,
      ...parsed,
      units: parsed.units === "imperial" ? "imperial" : "metric",
      energyUnit: parsed.energyUnit === "kj" ? "kj" : "kcal",
      weekStarts: parsed.weekStarts === "sunday" ? "sunday" : "monday",
      appearance:
        parsed.appearance === "dark" || parsed.appearance === "system"
          ? parsed.appearance
          : "light",
      density: parsed.density === "compact" ? "compact" : "comfortable",
      showRir: parsed.showRir !== false,
      restTimer: parsed.restTimer !== false,
      restSeconds:
        typeof parsed.restSeconds === "number" && parsed.restSeconds >= 15
          ? Math.round(parsed.restSeconds)
          : 120,
    };
  } catch {
    return defaultMucipesDisplaySettings;
  }
}

export function kcalToDisplay(kcal: number, unit: MucipesDisplaySettings["energyUnit"]) {
  return unit === "kj" ? kcal * 4.184 : kcal;
}

export function displayToKcal(value: number, unit: MucipesDisplaySettings["energyUnit"]) {
  return unit === "kj" ? value / 4.184 : value;
}

export function energyUnitLabel(unit: MucipesDisplaySettings["energyUnit"]) {
  return unit === "kj" ? "kJ" : "kcal";
}

export function formatEnergy(kcal: number, unit: MucipesDisplaySettings["energyUnit"], digits = 0) {
  const value = kcalToDisplay(kcal, unit);
  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })} ${energyUnitLabel(unit)}`;
}

export function kgToDisplay(kg: number, units: MucipesDisplaySettings["units"]) {
  return units === "imperial" ? kg * 2.2046226218 : kg;
}

export function displayToKg(value: number, units: MucipesDisplaySettings["units"]) {
  return units === "imperial" ? value / 2.2046226218 : value;
}

export function cmToDisplay(cm: number, units: MucipesDisplaySettings["units"]) {
  return units === "imperial" ? cm / 2.54 : cm;
}

export function displayToCm(value: number, units: MucipesDisplaySettings["units"]) {
  return units === "imperial" ? value * 2.54 : value;
}

export function weightUnitLabel(units: MucipesDisplaySettings["units"]) {
  return units === "imperial" ? "lb" : "kg";
}

export function lengthUnitLabel(units: MucipesDisplaySettings["units"]) {
  return units === "imperial" ? "in" : "cm";
}

export function formatWeight(kg: number, units: MucipesDisplaySettings["units"], digits = 1) {
  return `${kgToDisplay(kg, units).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  })} ${weightUnitLabel(units)}`;
}

export function formatLength(cm: number, units: MucipesDisplaySettings["units"], digits = 1) {
  return `${cmToDisplay(cm, units).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  })} ${lengthUnitLabel(units)}`;
}

export function applyMucipesAppearance(settings: MucipesDisplaySettings) {
  if (typeof document === "undefined") return () => {};

  const root = document.documentElement;
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");

  const paint = () => {
    const dark =
      settings.appearance === "dark" ||
      (settings.appearance === "system" && Boolean(media?.matches));
    root.dataset.mucipesTheme = dark ? "dark" : "light";
    root.dataset.mucipesDensity = settings.density;
  };

  paint();
  if (settings.appearance === "system" && media) {
    media.addEventListener?.("change", paint);
    return () => media.removeEventListener?.("change", paint);
  }
  return () => {};
}
