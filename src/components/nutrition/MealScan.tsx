"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { formatEnergy, type MucipesDisplaySettings } from "@/lib/mucipes/display";

type Food = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealId?: string;
};

type Meal = { id: string; name: string };

type ScannedItem = {
  name: string;
  grams: number;
  caloriesPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  confidence?: number;
};

type ScanResponse = {
  items?: ScannedItem[];
  note?: string;
  error?: string;
};

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function itemTotals(item: ScannedItem) {
  const factor = Math.max(0, item.grams) / 100;
  return {
    calories: item.caloriesPer100 * factor,
    protein: item.proteinPer100 * factor,
    carbs: item.carbsPer100 * factor,
    fat: item.fatPer100 * factor,
  };
}

async function optimizePhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 15 * 1024 * 1024) throw new Error("Use an image smaller than 15 MB.");

  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read this photo."));
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read this photo."));
    reader.readAsDataURL(file);
  });

  // Resize large phone photos before sending them to the vision endpoint. This keeps
  // uploads fast and avoids paying to send pixels that do not improve portion estimates.
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not decode this photo."));
      image.src = raw;
    });
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    if (scale >= 0.99 && file.size < 2_500_000) return raw;

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return raw;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return raw;
  }
}

export default function MealScan({
  meals,
  defaultMealId,
  onAddFoods,
  displaySettings,
}: {
  meals: Meal[];
  defaultMealId?: string;
  onAddFoods: (foods: Food[]) => void;
  displaySettings: MucipesDisplaySettings;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [mealId, setMealId] = useState(defaultMealId || meals[0]?.id || "breakfast");
  const [loading, setLoading] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [message, setMessage] = useState("");

  const totals = useMemo(
    () =>
      items.reduce(
        (sum, item) => {
          const x = itemTotals(item);
          sum.calories += x.calories;
          sum.protein += x.protein;
          sum.carbs += x.carbs;
          sum.fat += x.fat;
          return sum;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [items]
  );

  async function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setItems([]);
    setMessage("");
    if (!file) return;
    setPreparing(true);
    try {
      const optimized = await optimizePhoto(file);
      setImageData(optimized);
      setPreview(optimized);
      setMessage("Photo ready. Tap Analyze meal when the whole plate is visible.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not prepare this photo.");
    } finally {
      setPreparing(false);
    }
  }

  function reset() {
    setPreview(null);
    setImageData(null);
    setItems([]);
    setMessage("");
  }

  async function scan() {
    if (!imageData) {
      setMessage("Take or choose a meal photo first.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/meal-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      });
      const data = (await response.json()) as ScanResponse;
      if (!response.ok) {
        setMessage(data.error || "Meal scan failed.");
        return;
      }
      const valid = (data.items || [])
        .filter((item) => item && item.name)
        .map((item) => ({
          ...item,
          name: String(item.name).trim(),
          grams: Math.max(0, Math.round(Number(item.grams) || 0)),
          caloriesPer100: Math.max(0, Number(item.caloriesPer100) || 0),
          proteinPer100: Math.max(0, Number(item.proteinPer100) || 0),
          carbsPer100: Math.max(0, Number(item.carbsPer100) || 0),
          fatPer100: Math.max(0, Number(item.fatPer100) || 0),
          confidence: Math.max(0, Math.min(1, Number(item.confidence) || 0)),
        }));
      setItems(valid);
      setMessage(
        valid.length
          ? data.note || "Review the estimated foods and portions before logging."
          : "No foods were confidently detected. Try a brighter photo from directly above."
      );
    } catch {
      setMessage("Could not reach the meal scanner.");
    } finally {
      setLoading(false);
    }
  }

  function updateItem(index: number, patch: Partial<ScannedItem>) {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
    );
  }

  function addToDiary() {
    if (!items.length) return;
    const base = Date.now();
    onAddFoods(
      items.map((item, index) => {
        const x = itemTotals(item);
        return {
          id: base + index,
          name: `${item.name} (${Math.round(item.grams)} g)`,
          calories: Math.round(x.calories),
          protein: round1(x.protein),
          carbs: round1(x.carbs),
          fat: round1(x.fat),
          mealId,
        };
      })
    );
    setMessage("Meal added to your diary. You can edit every item there.");
  }

  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">AI Meal Scan</p>
          <h3 className="mt-1 text-2xl font-black text-slate-950">Camera → review → diary</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Take a photo or choose one from your library. CYG estimates visible foods and portions; you stay in control before anything is logged.
          </p>
        </div>
        <select
          value={mealId}
          onChange={(event) => setMealId(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-blue-500"
        >
          {meals.map((meal) => (
            <option key={meal.id} value={meal.id}>{meal.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Meal preview" className="max-h-80 w-full rounded-xl object-cover" />
          ) : (
            <div className="grid min-h-56 place-items-center rounded-xl bg-white/70 p-6 text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-2xl" aria-hidden="true">⌁</div>
                <p className="mt-3 font-black text-slate-900">Photograph the whole plate</p>
                <p className="mt-1 text-sm text-slate-500">Good light and a top-down angle improve portion estimates.</p>
              </div>
            </div>
          )}

          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={chooseImage} />
          <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={chooseImage} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              disabled={preparing || loading}
              className="rounded-xl bg-blue-500 px-3 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              📷 Take photo
            </button>
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              disabled={preparing || loading}
              className="rounded-xl border border-blue-200 bg-white px-3 py-3 text-sm font-black text-blue-700 disabled:opacity-50"
            >
              Choose photo
            </button>
          </div>
          <button
            type="button"
            onClick={scan}
            disabled={!imageData || loading || preparing}
            className="mt-2 w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {preparing ? "Preparing photo…" : loading ? "Analyzing meal…" : "Analyze meal"}
          </button>
          {preview && (
            <button type="button" onClick={reset} disabled={loading} className="mt-2 w-full rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-white">
              Clear / take another
            </button>
          )}
        </div>

        <div>
          {items.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-slate-900">Detected foods</p>
                <button type="button" onClick={scan} disabled={loading} className="text-xs font-black text-blue-600 disabled:opacity-50">Rescan photo</button>
              </div>
              {items.map((item, index) => {
                const x = itemTotals(item);
                const confidence = Math.round((item.confidence || 0) * 100);
                return (
                  <div key={`${item.name}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <input
                          value={item.name}
                          onChange={(event) => updateItem(index, { name: event.target.value })}
                          aria-label={`Detected food ${index + 1}`}
                          className="w-full bg-transparent font-black text-slate-950 outline-none"
                        />
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>{formatEnergy(x.calories, displaySettings.energyUnit)} · {round1(x.protein)} P · {round1(x.carbs)} C · {round1(x.fat)} F</span>
                          {confidence > 0 && <span className={`rounded-full px-2 py-0.5 font-bold ${confidence >= 75 ? "bg-blue-50 text-blue-700" : confidence >= 50 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{confidence}% confidence</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setItems((current) => current.filter((_, i) => i !== index))}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-500"
                      >
                        Remove
                      </button>
                    </div>
                    <label className="mt-3 block text-xs font-bold text-slate-500">
                      Estimated portion (g)
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step={5}
                        value={item.grams}
                        onChange={(event) => updateItem(index, { grams: Math.max(0, Number(event.target.value) || 0) })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base font-black outline-none focus:border-blue-500"
                      />
                    </label>
                  </div>
                );
              })}

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <ScanStat label="Energy" value={formatEnergy(totals.calories, displaySettings.energyUnit)} />
                <ScanStat label="Protein" value={`${round1(totals.protein)} g`} />
                <ScanStat label="Carbs" value={`${round1(totals.carbs)} g`} />
                <ScanStat label="Fat" value={`${round1(totals.fat)} g`} />
              </div>
              <button type="button" onClick={addToDiary} className="w-full rounded-2xl bg-blue-500 py-4 font-black text-white">
                Add reviewed meal to diary
              </button>
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <div>
                <p className="font-black text-slate-900">Your analysis appears here</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Nothing is logged automatically. Edit names or grams, remove uncertain items, then add the reviewed meal.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {message && <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">{message}</p>}
    </section>
  );
}

function ScanStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}
