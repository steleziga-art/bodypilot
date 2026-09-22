"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { loadCloudData, saveCloudData } from "@/lib/supabase/storage";
import PremiumPaywall from "@/components/premium/PremiumPaywall";

type PlanTier = "free" | "premium";
type FocusKey = "skin" | "hair" | "smile" | "grooming" | "posture" | "physique";
type RoutineItem = { id: string; title: string; detail: string; focus: FocusKey; cadence: "daily" | "weekly" };
type ProgressPhoto = { id: string; createdAt: string; image: string; note: string };
type ScanResult = { observations?: string[]; suggestions?: string[]; note?: string; error?: string };

const focusOptions: Array<{ key: FocusKey; title: string; detail: string; icon: string }> = [
  { key: "skin", title: "Skin", detail: "Consistency, sun protection and visible skin-care habits.", icon: "◌" },
  { key: "hair", title: "Hair", detail: "Style, grooming consistency and hair-care routine.", icon: "≈" },
  { key: "smile", title: "Teeth & Smile", detail: "Oral-care routine and smile presentation.", icon: "⌣" },
  { key: "grooming", title: "Grooming", detail: "Facial hair, brows and general grooming habits.", icon: "✦" },
  { key: "posture", title: "Posture", detail: "Daily posture cues and presentation habits.", icon: "↥" },
  { key: "physique", title: "Physique", detail: "Training, body composition and visual progress.", icon: "◇" },
];

const routineLibrary: Record<FocusKey, RoutineItem[]> = {
  skin: [
    { id: "skin-am", title: "AM skin routine", detail: "Cleanse if needed, moisturize and use SPF.", focus: "skin", cadence: "daily" },
    { id: "skin-pm", title: "PM skin routine", detail: "Cleanse and keep your evening routine consistent.", focus: "skin", cadence: "daily" },
  ],
  hair: [
    { id: "hair-style", title: "Style check", detail: "Keep the cut/style intentional and consistent.", focus: "hair", cadence: "daily" },
    { id: "hair-review", title: "Hair review", detail: "Review cut, shape and maintenance needs.", focus: "hair", cadence: "weekly" },
  ],
  smile: [
    { id: "smile-care", title: "Oral care", detail: "Brush, floss and keep your routine consistent.", focus: "smile", cadence: "daily" },
  ],
  grooming: [
    { id: "grooming-check", title: "Grooming check", detail: "Facial hair, brows, nails and small details.", focus: "grooming", cadence: "weekly" },
  ],
  posture: [
    { id: "posture-cue", title: "Posture cue", detail: "Use one simple cue: tall torso, relaxed shoulders, neutral head.", focus: "posture", cadence: "daily" },
  ],
  physique: [
    { id: "physique-train", title: "Follow training plan", detail: "Consistency beats frequent program changes.", focus: "physique", cadence: "daily" },
    { id: "physique-photo", title: "Progress photo", detail: "Use similar lighting and pose for comparisons.", focus: "physique", cadence: "weekly" },
  ],
};

async function optimizeImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read photo."));
    reader.onerror = () => reject(new Error("Could not read photo."));
    reader.readAsDataURL(file);
  });
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = raw;
    });
    const maxSide = 1400;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    if (scale >= 0.99 && file.size < 2_000_000) return raw;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const ctx = canvas.getContext("2d"); if (!ctx) return raw;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch { return raw; }
}

export default function Looksmaxing({ planTier, onPreviewPremium }: { planTier: PlanTier; onPreviewPremium: () => void }) {
  const [focus, setFocus] = useState<FocusKey[]>(["skin", "hair", "posture", "physique"]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [routineDate, setRoutineDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanData, setScanData] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [message, setMessage] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bodypilot-looksmaxing") || "{}");
      if (Array.isArray(saved.focus)) setFocus(saved.focus);
      const today = new Date().toISOString().slice(0, 10);
      if (saved.routineDate === today && saved.completed && typeof saved.completed === "object") setCompleted(saved.completed);
      else setCompleted({});
      setRoutineDate(today);
      if (Array.isArray(saved.photos)) setPhotos(saved.photos);
    } catch {}
    void loadCloudData<any>("looksmaxing").then((cloud) => {
      if (!cloud) return;
      if (Array.isArray(cloud.focus)) setFocus(cloud.focus);
      const today = new Date().toISOString().slice(0, 10);
      if (cloud.routineDate === today && cloud.completed && typeof cloud.completed === "object") setCompleted(cloud.completed);
      if (Array.isArray(cloud.photos)) setPhotos(cloud.photos);
    });
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (routineDate !== today) {
      setRoutineDate(today);
      setCompleted({});
      return;
    }
    const data = { focus, completed, photos, routineDate };
    try { localStorage.setItem("bodypilot-looksmaxing", JSON.stringify(data)); } catch {}
    void saveCloudData("looksmaxing", data);
  }, [focus, completed, photos, routineDate]);

  const routine = useMemo(() => focus.flatMap((key) => routineLibrary[key]), [focus]);
  const todayItems = routine.filter((item) => item.cadence === "daily");
  const completedCount = todayItems.filter((item) => completed[item.id]).length;
  const score = todayItems.length ? Math.round((completedCount / todayItems.length) * 100) : 0;

  if (planTier === "free") {
    return (
      <div className="space-y-5">
        <header><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Looksmaxing</p><h1 className="mt-2 text-4xl font-black tracking-tight">Build a better appearance routine.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">A practical routine for visible, changeable habits — without attractiveness scores.</p></header>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{focusOptions.map((item) => <div key={item.key} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="text-2xl">{item.icon}</div><p className="mt-3 font-black text-slate-950">{item.title}</p><p className="mt-1 text-sm leading-6 text-slate-500">{item.detail}</p></div>)}</div>
        <PremiumPaywall title="Looksmaxing is a Premium module" detail="Unlock your personalized routine, progress photos, AI Looks Scan and weekly appearance check-ins." onPreviewPremium={onPreviewPremium} />
      </div>
    );
  }

  function toggleFocus(key: FocusKey) {
    setFocus((current) => current.includes(key) ? current.filter((x) => x !== key) : [...current, key]);
  }

  async function chooseScanImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.currentTarget.value = ""; if (!file) return;
    setMessage(""); setScan(null);
    try { const img = await optimizeImage(file); setPreview(img); setScanData(img); } catch (e) { setMessage(e instanceof Error ? e.message : "Could not prepare photo."); }
  }

  async function addProgressPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.currentTarget.value = ""; if (!file) return;
    try {
      const img = await optimizeImage(file);
      setPhotos((current) => [{ id: String(Date.now()), createdAt: new Date().toISOString(), image: img, note: "" }, ...current].slice(0, 12));
    } catch (e) { setMessage(e instanceof Error ? e.message : "Could not save photo."); }
  }

  async function analyze() {
    if (!scanData) return setMessage("Choose a clear photo first.");
    setScanLoading(true); setMessage("");
    try {
      const response = await fetch("/api/looksmaxing-scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageData: scanData, focus }) });
      const data = await response.json() as ScanResult;
      if (!response.ok) setMessage(data.error || "Looks Scan failed."); else setScan(data);
    } catch { setMessage("Could not reach Looks Scan."); } finally { setScanLoading(false); }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Looksmaxing · Premium</p><h1 className="mt-2 text-4xl font-black tracking-tight">Improve what you can control.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Habits, grooming, posture and physique progress in one place. No attractiveness score.</p></div><div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3"><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Today</p><p className="mt-1 text-2xl font-black text-slate-950">{score}%</p></div></header>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-600">Your focus</p><h2 className="mt-1 text-2xl font-black">Choose what matters</h2></div><span className="text-xs font-bold text-slate-400">{focus.length} selected</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{focusOptions.map((item) => { const active = focus.includes(item.key); return <button key={item.key} type="button" onClick={() => toggleFocus(item.key)} className={`rounded-2xl border p-4 text-left transition ${active ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"}`}><div className="flex items-start justify-between gap-3"><span className="text-xl">{item.icon}</span><span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>{active ? "Active" : "Add"}</span></div><p className="mt-3 font-black">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p></button>; })}</div></section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="text-xs font-black uppercase tracking-widest text-emerald-600">Daily routine</p><h2 className="mt-1 text-2xl font-black">Today&apos;s checklist</h2><div className="mt-5 space-y-2">{todayItems.length ? todayItems.map((item) => <button key={item.id} type="button" onClick={() => setCompleted((current) => ({ ...current, [item.id]: !current[item.id] }))} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left ${completed[item.id] ? "border-emerald-200 bg-emerald-50" : "border-slate-200"}`}><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-black ${completed[item.id] ? "bg-emerald-500 text-white" : "border border-slate-300"}`}>{completed[item.id] ? "✓" : ""}</span><span><span className="font-black text-slate-900">{item.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{item.detail}</span></span></button>) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Select at least one focus area.</p>}</div></div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="text-xs font-black uppercase tracking-widest text-emerald-600">Weekly review</p><h2 className="mt-1 text-2xl font-black">Keep changes measurable</h2><div className="mt-5 space-y-3">{routine.filter((x) => x.cadence === "weekly").map((item) => <div key={item.id} className="rounded-2xl bg-slate-50 p-4"><p className="font-black">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p></div>)}<button type="button" onClick={() => progressRef.current?.click()} className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">+ Add progress photo</button><input ref={progressRef} type="file" accept="image/*" className="hidden" onChange={addProgressPhoto}/></div></div>
      </section>

      <section className="rounded-[2rem] border border-emerald-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-600">AI Looks Scan</p><h2 className="mt-1 text-2xl font-black">Useful observations, not a beauty score</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">CYG only comments on visible, changeable presentation factors. It does not diagnose skin or health conditions.</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">Premium</span></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><div>{preview ? <img src={preview} alt="Looks scan preview" className="max-h-96 w-full rounded-2xl object-cover"/> : <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-6 text-center"><div><div className="text-4xl">◎</div><p className="mt-3 font-black">Choose a clear photo</p><p className="mt-1 text-xs text-slate-500">Neutral lighting and a natural expression work best.</p></div></div>}<input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={chooseScanImage}/><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => photoRef.current?.click()} className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-black text-emerald-700">Choose photo</button><button type="button" disabled={!scanData || scanLoading} onClick={() => void analyze()} className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-white disabled:opacity-40">{scanLoading ? "Analyzing…" : "Analyze"}</button></div></div><div className="rounded-2xl bg-slate-50 p-4">{scan ? <div className="space-y-4"><div><p className="text-xs font-black uppercase tracking-widest text-slate-400">Observations</p><div className="mt-2 space-y-2">{(scan.observations || []).map((x) => <p key={x} className="rounded-xl bg-white p-3 text-sm font-semibold text-slate-700">{x}</p>)}</div></div><div><p className="text-xs font-black uppercase tracking-widest text-slate-400">Suggestions</p><div className="mt-2 space-y-2">{(scan.suggestions || []).map((x) => <p key={x} className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">{x}</p>)}</div></div>{scan.note && <p className="text-xs leading-5 text-slate-500">{scan.note}</p>}</div> : <p className="text-sm leading-6 text-slate-500">Your scan results will appear here after you analyze a photo.</p>}{message && <p className="mt-3 text-sm font-semibold text-amber-700">{message}</p>}</div></div></section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-600">Progress photos</p><h2 className="mt-1 text-2xl font-black">Compare over time</h2></div><button type="button" onClick={() => progressRef.current?.click()} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-black text-white">Add photo</button></div>{photos.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{photos.map((photo) => <div key={photo.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><img src={photo.image} alt="Looksmaxing progress" className="aspect-[4/5] w-full object-cover"/><div className="p-3 text-xs font-bold text-slate-500">{new Date(photo.createdAt).toLocaleDateString()}</div></div>)}</div> : <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">No photos yet. Add one when you want a consistent visual baseline.</div>}</section>
    </div>
  );
}
