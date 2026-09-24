"use client";

import { CygIcon, EnergyRing, MacroTrack, PageHeader } from "@/components/ui/CygUI";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import FoodSearch from "@/components/FoodSearch";
import MealOptimizer from "@/components/MealOptimizer";
import NutritionInsights from "@/components/nutrition/NutritionInsights";
import MealScan from "@/components/nutrition/MealScan";
import PremiumPaywall from "@/components/premium/PremiumPaywall";
import { loadCloudData, saveCloudData } from "@/lib/supabase/storage";
import {
  displayToKcal,
  energyUnitLabel,
  formatEnergy,
  kcalToDisplay,
  type MucipesDisplaySettings,
} from "@/lib/mucipes/display";

type Food = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealId?: string;
  micronutrients?: Record<string, { value: number; unit: string }>;
};

type Meal = { id: string; name: string };
type Goals = { calories: number; protein: number; carbs: number; fat: number };
type NutritionDay = { date: string; calories: number; protein: number; carbs: number; fat: number };
type FoodDiaryDay = { date: string; foods: Food[] };
type SavedMeal = { id: string; name: string; foods: Food[] };
type Recipe = { id: string; name: string; servings: number; foods: Food[] };
type Tab = "today" | "history" | "insights" | "library";
type AddMode = "menu" | "search" | "scan" | "optimizer" | "quick" | "saved";

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function todayKey() {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

function mealTotals(foods: Food[]) {
  return foods.reduce(
    (sum, food) => ({
      calories: sum.calories + food.calories,
      protein: sum.protein + food.protein,
      carbs: sum.carbs + food.carbs,
      fat: sum.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export default function NutritionHub({
  foods,
  meals,
  goals,
  setGoals,
  addFood,
  addFoods,
  deleteFood: removeFood,
  moveFood,
  addMeal,
  deleteMeal,
  caloriesEaten,
  proteinEaten,
  carbsEaten,
  fatEaten,
  caloriesRemaining,
  proteinRemaining,
  carbsRemaining,
  fatRemaining,
  nutritionHistory,
  foodDiaryHistory,
  onUpdateDiary,
  updateFood,
  duplicateFood,
  duplicateMeal,
  copyYesterdayFoods,
  displaySettings,
  planTier,
}: {
  foods: Food[];
  meals: Meal[];
  goals: Goals;
  setGoals: Dispatch<SetStateAction<Goals>>;
  addFood: (food: Food) => void;
  addFoods: (foods: Food[]) => void;
  deleteFood: (id: number) => void;
  moveFood: (foodId: number, mealId: string) => void;
  addMeal: (name: string) => void;
  deleteMeal: (mealId: string) => void;
  caloriesEaten: number;
  proteinEaten: number;
  carbsEaten: number;
  fatEaten: number;
  caloriesRemaining: number;
  proteinRemaining: number;
  carbsRemaining: number;
  fatRemaining: number;
  nutritionHistory: NutritionDay[];
  foodDiaryHistory: FoodDiaryDay[];
  onUpdateDiary: (date:string, foods:Food[])=>void;
  updateFood: (food: Food) => void;
  duplicateFood: (id: number) => void;
  duplicateMeal: (mealId: string) => void;
  copyYesterdayFoods: () => boolean;
  displaySettings: MucipesDisplaySettings;
  planTier: "free" | "premium";
}) {
  const [removedFood,setRemovedFood]=useState<Food|null>(null);
  function deleteFood(id:number){setRemovedFood(foods.find(f=>f.id===id)||null);removeFood(id);}
  const [historyDate, setHistoryDate] = useState(yesterdayKey);
  const historicFoods = foodDiaryHistory.find(day=>day.date===historyDate)?.foods || [];
  const historicSnapshot = nutritionHistory.find(day=>day.date===historyDate);
  const historicTotals = historicFoods.length ? mealTotals(historicFoods) : historicSnapshot || mealTotals([]);
  const shiftHistoryDate = (offset:number) => {const d=new Date(historyDate+"T12:00:00"); d.setDate(d.getDate()+offset); const next=[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-"); if(next<=todayKey())setHistoryDate(next);};
  const [tab, setTab] = useState<Tab>("today");
  const [addOpen, setAddOpen] = useState(false);
  const [addMode, setAddMode] = useState<AddMode>("menu");
  const [targetMealId, setTargetMealId] = useState(meals[0]?.id || "breakfast");
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({ breakfast: true });
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [showGoals, setShowGoals] = useState(false);
  const [diaryMessage, setDiaryMessage] = useState("");
  const [waterMl, setWaterMl] = useState(0);
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newMealName, setNewMealName] = useState("");
  const [showNewMeal, setShowNewMeal] = useState(false);

  const [goalCalories, setGoalCalories] = useState(() => String(Math.round(kcalToDisplay(goals.calories, displaySettings.energyUnit))));
  const [goalProtein, setGoalProtein] = useState(String(goals.protein));
  const [goalCarbs, setGoalCarbs] = useState(String(goals.carbs));
  const [goalFat, setGoalFat] = useState(String(goals.fat));

  const [quickName, setQuickName] = useState("");
  const [quickCalories, setQuickCalories] = useState("");
  const [quickProtein, setQuickProtein] = useState("");
  const [quickCarbs, setQuickCarbs] = useState("");
  const [quickFat, setQuickFat] = useState("");

  useEffect(() => {
    setGoalCalories(String(Math.round(kcalToDisplay(goals.calories, displaySettings.energyUnit))));
    setGoalProtein(String(goals.protein));
    setGoalCarbs(String(goals.carbs));
    setGoalFat(String(goals.fat));
  }, [goals, displaySettings.energyUnit]);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      let localWater = 0;
      let localSaved: SavedMeal[] = [];
      let localRecipes: Recipe[] = [];
      try {
        localWater = Number(localStorage.getItem(`bodypilot-water-${todayKey()}`) || 0);
        localSaved = JSON.parse(localStorage.getItem("bodypilot-saved-meals") || "[]");
        localRecipes = JSON.parse(localStorage.getItem("bodypilot-recipes") || "[]");
      } catch {
        // keep defaults
      }
      if (!cancelled) {
        setWaterMl(Number.isFinite(localWater) ? localWater : 0);
        setSavedMeals(Array.isArray(localSaved) ? localSaved : []);
        setRecipes(Array.isArray(localRecipes) ? localRecipes : []);
      }
      const [cloudWater, cloudSaved, cloudRecipes] = await Promise.all([
        loadCloudData<number>(`water_${todayKey()}`),
        loadCloudData<SavedMeal[]>("saved_meals"),
        loadCloudData<Recipe[]>("recipes"),
      ]);
      if (cancelled) return;
      if (typeof cloudWater === "number") setWaterMl(cloudWater);
      if (Array.isArray(cloudSaved)) setSavedMeals(cloudSaved);
      if (Array.isArray(cloudRecipes)) setRecipes(cloudRecipes);
    }
    void hydrate();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try { localStorage.setItem(`bodypilot-water-${todayKey()}`, String(waterMl)); } catch {}
    void saveCloudData(`water_${todayKey()}`, waterMl);
  }, [waterMl]);

  useEffect(() => {
    try { localStorage.setItem("bodypilot-saved-meals", JSON.stringify(savedMeals)); } catch {}
    void saveCloudData("saved_meals", savedMeals);
  }, [savedMeals]);

  useEffect(() => {
    try { localStorage.setItem("bodypilot-recipes", JSON.stringify(recipes)); } catch {}
    void saveCloudData("recipes", recipes);
  }, [recipes]);

  const nutritionStats = useMemo(() => {
    const completed = nutritionHistory.filter((day) => day.date !== todayKey());
    const average = (days: number) => {
      const sample = completed.slice(-days);
      if (!sample.length) return null;
      return Math.round(sample.reduce((sum, day) => sum + day.calories, 0) / sample.length);
    };
    const recent14 = completed.slice(-14);
    const adherent = recent14.filter((day) => Math.abs(day.calories - goals.calories) <= goals.calories * 0.1).length;
    return {
      avg7: average(7),
      avg14: average(14),
      adherence: recent14.length ? Math.round((adherent / recent14.length) * 100) : null,
    };
  }, [nutritionHistory, goals.calories]);

  const caloriePct = goals.calories > 0 ? Math.min(100, Math.max(0, (caloriesEaten / goals.calories) * 100)) : 0;
  const waterGoal = 3000;

  function openAdd(mode: AddMode, mealId?: string) {
    if (mealId) setTargetMealId(mealId);
    setAddMode(mode);
    setAddOpen(true);
  }

  function closeAdd() {
    setAddOpen(false);
    setAddMode("menu");
  }

  function saveGoals() {
    const displayCalories = Number(goalCalories);
    const next = {
      calories: Math.round(displayToKcal(displayCalories, displaySettings.energyUnit)),
      protein: Math.round(Number(goalProtein)),
      carbs: Math.round(Number(goalCarbs)),
      fat: Math.round(Number(goalFat)),
    };
    if (!Number.isFinite(next.calories) || next.calories <= 0 || next.protein <= 0 || next.carbs <= 0 || next.fat <= 0) {
      setDiaryMessage("Enter valid daily targets.");
      return;
    }
    setGoals(next);
    setShowGoals(false);
  }

  function addQuickFood() {
    const displayCalories = Number(quickCalories);
    const food: Food = {
      id: Date.now(),
      name: quickName.trim() || "Quick add",
      calories: Math.max(0, Math.round(displayToKcal(displayCalories || 0, displaySettings.energyUnit))),
      protein: Math.max(0, round1(Number(quickProtein) || 0)),
      carbs: Math.max(0, round1(Number(quickCarbs) || 0)),
      fat: Math.max(0, round1(Number(quickFat) || 0)),
      mealId: targetMealId,
    };
    if (food.calories <= 0 && food.protein <= 0 && food.carbs <= 0 && food.fat <= 0) {
      setDiaryMessage("Enter at least one nutrition value.");
      return;
    }
    addFood(food);
    setQuickName(""); setQuickCalories(""); setQuickProtein(""); setQuickCarbs(""); setQuickFat("");
    setDiaryMessage(`${food.name} added.`);
    closeAdd();
  }

  function saveEditedFood() {
    if (!editingFood) return;
    updateFood({
      ...editingFood,
      calories: Math.max(0, Number(editingFood.calories) || 0),
      protein: Math.max(0, Number(editingFood.protein) || 0),
      carbs: Math.max(0, Number(editingFood.carbs) || 0),
      fat: Math.max(0, Number(editingFood.fat) || 0),
    });
    setEditingFood(null);
  }

  function saveMealFromMeal(mealId: string) {
    const mealFoods = foods.filter((food) => (food.mealId || "breakfast") === mealId);
    if (!mealFoods.length) return;
    const sourceMeal = meals.find((meal) => meal.id === mealId);
    const name = window.prompt("Saved meal name:", sourceMeal?.name || "Meal");
    if (!name?.trim()) return;
    setSavedMeals((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        name: name.trim(),
        foods: mealFoods.map((food, index) => ({ ...food, id: Date.now() + index })),
      },
    ]);
    setDiaryMessage("Meal saved to Library.");
  }

  function createRecipeFromMeal(mealId: string) {
    const mealFoods = foods.filter((food) => (food.mealId || "breakfast") === mealId);
    if (!mealFoods.length) return;
    const name = window.prompt("Recipe name:", meals.find((m) => m.id === mealId)?.name || "Recipe");
    if (!name?.trim()) return;
    const servings = Math.max(1, Number(window.prompt("Number of servings:", "1")) || 1);
    setRecipes((current) => [...current, { id: `${Date.now()}`, name: name.trim(), servings, foods: mealFoods.map((f) => ({ ...f })) }]);
    setDiaryMessage("Recipe saved to Library.");
  }

  function addSavedMeal(item: SavedMeal, mealId = targetMealId) {
    const now = Date.now();
    addFoods(item.foods.map((food, index) => ({ ...food, id: now + index, mealId })));
    setDiaryMessage(`${item.name} added.`);
    closeAdd();
  }

  function addRecipe(recipe: Recipe, mealId = targetMealId) {
    const factor = 1 / Math.max(1, recipe.servings);
    const now = Date.now();
    addFoods(recipe.foods.map((food, index) => ({
      ...food,
      id: now + index,
      mealId,
      calories: round1(food.calories * factor),
      protein: round1(food.protein * factor),
      carbs: round1(food.carbs * factor),
      fat: round1(food.fat * factor),
    })));
    setDiaryMessage(`${recipe.name} added.`);
  }

  function createCustomMeal() {
    if (!newMealName.trim()) return;
    addMeal(newMealName.trim());
    setNewMealName("");
    setShowNewMeal(false);
  }

  const hasYesterday = foodDiaryHistory.some((day) => day.date === yesterdayKey() && day.foods.length > 0);

  return (
    <div className="cyg-nutrition-page space-y-4">
      <PageHeader title="Nutrition" action={<div className="flex gap-2"><button className="cyg-icon-button" aria-label="Open nutrition history" onClick={()=>setTab('history')}><CygIcon name="calendar"/></button><button className="cyg-icon-button" aria-label="Nutrition targets" onClick={()=>{setTab('today');setShowGoals(value=>!value)}}><CygIcon name="dots"/></button></div>}/>
      <div className="cyg-segments">{([['today','Diary'],['history','History'],['insights','Insights'],['library','Library']] as const).map(([name,label])=><button key={name} onClick={()=>setTab(name)} className={tab===name?'is-active':''}>{label}</button>)}</div>
      {tab==='today'&&<div className="cyg-date-control"><button aria-label="Yesterday's diary" onClick={()=>{setHistoryDate(yesterdayKey());setTab('history')}}><CygIcon name="back" size={20}/></button><strong>{new Date().toLocaleDateString('en',{weekday:'short',month:'short',day:'numeric'})}</strong><button aria-label="Next day" disabled><CygIcon name="chevron" size={20}/></button></div>}

      {removedFood&&<div role="status" className="rounded-xl border p-3 text-sm">Food removed. <button className="ml-3 font-bold text-blue-700" onClick={()=>{addFood(removedFood);setRemovedFood(null)}}>Undo</button><button className="ml-3" aria-label="Dismiss undo" onClick={()=>setRemovedFood(null)}>×</button></div>}
      {diaryMessage && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
          {diaryMessage}
        </div>
      )}

      {tab === "history" && <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black">Food diary history</h2><p className="text-sm text-slate-500">Your saved meals and daily totals.</p></div><div className="flex gap-2"><button aria-label="Previous day" onClick={()=>shiftHistoryDate(-1)} className="rounded-xl border px-4">‹</button><input aria-label="Food history date" type="date" max={todayKey()} value={historyDate} onChange={e=>{if(e.target.value)setHistoryDate(e.target.value)}} className="rounded-xl border p-2"/><button aria-label="Next day" disabled={historyDate>=todayKey()} onClick={()=>shiftHistoryDate(1)} className="rounded-xl border px-4 disabled:opacity-30">›</button></div></div>
        <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-950 p-5 text-white sm:grid-cols-4"><div><p className="text-xs text-slate-300">Energy</p><strong>{formatEnergy(historicTotals.calories,displaySettings.energyUnit)}</strong></div>{(["protein","carbs","fat"] as const).map(k=><div key={k}><p className="text-xs capitalize text-slate-300">{k}</p><strong>{round1(historicTotals[k])} g</strong></div>)}</div>
        {historicFoods.length ? Array.from(new Set(historicFoods.map(f=>f.mealId||"unassigned"))).map(mealId=>{
          const items=historicFoods.filter(f=>(f.mealId||"unassigned")===mealId),total=mealTotals(items);
          const title=meals.find(m=>m.id===mealId)?.name || (mealId==="unassigned"?"Other foods":mealId);
          return <details key={`${historyDate}-${mealId}`} className="mt-3 rounded-2xl border border-slate-200 p-4"><summary className="cursor-pointer"><span className="font-black">{title}</span><span className="ml-3 text-sm">{formatEnergy(total.calories,displaySettings.energyUnit)}</span><span className="mt-1 block text-xs text-slate-500">{items.length} foods · {round1(total.protein)}P / {round1(total.carbs)}C / {round1(total.fat)}F</span></summary>
          <button className="mt-3 text-sm font-bold text-blue-700" onClick={()=>{addFoods(items.map((food,i)=>({...food,id:Date.now()+i+Math.floor(Math.random()*100000),mealId:meals.some(m=>m.id===mealId)?mealId:meals[0]?.id})));setDiaryMessage(`${title} copied to today.`)}}>Copy meal to today</button>
          {items.map((food,index)=><div key={`${food.id}-${index}`} className="flex flex-wrap items-center justify-between gap-3 border-t py-3 mt-2"><div><strong>{food.name}</strong><p className="text-xs text-slate-500">{round1(food.protein)}P / {round1(food.carbs)}C / {round1(food.fat)}F</p></div><span>{formatEnergy(food.calories,displaySettings.energyUnit)}</span><button className="text-xs font-bold text-blue-700" onClick={()=>{const input=window.prompt("Portion multiplier (0.5 = half, 2 = double)","1");if(input===null)return;const factor=Number(input);if(!Number.isFinite(factor)||factor<=0){setDiaryMessage("Enter a positive portion multiplier.");return;}onUpdateDiary(historyDate,historicFoods.map(f=>f===food?{...f,calories:f.calories*factor,protein:f.protein*factor,carbs:f.carbs*factor,fat:f.fat*factor,micronutrients:f.micronutrients?Object.fromEntries(Object.entries(f.micronutrients).map(([k,v])=>[k,{...v,value:v.value*factor}])):undefined}:f));}}>Edit portion</button></div>)}
          </details>;
        }):<p className="py-6 text-slate-500">{historicSnapshot?"Daily totals are saved; individual food entries are unavailable for this day.":"No food entries saved for this date."}</p>}

        <div className="mt-5 flex flex-wrap gap-2">{[...foodDiaryHistory].filter(d=>d.foods.length).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,14).map(d=><button key={d.date} className={`rounded-xl border px-3 py-2 text-xs font-bold ${historyDate===d.date?'bg-blue-50 text-blue-800':''}`} onClick={()=>setHistoryDate(d.date)}>{d.date}</button>)}</div>
      </section>}

      {tab === "today" && (
        <>
          <section className="cyg-card cyg-diary-summary">
            <div className="cyg-nutrition-summary"><EnergyRing value={kcalToDisplay(caloriesEaten,displaySettings.energyUnit)} goal={kcalToDisplay(goals.calories,displaySettings.energyUnit)} unit={energyUnitLabel(displaySettings.energyUnit)}/><div><h2 className="mb-3 text-sm font-bold">Macros</h2><MacroTrack label="Protein" value={proteinEaten} goal={goals.protein}/><MacroTrack label="Carbs" value={carbsEaten} goal={goals.carbs}/><MacroTrack label="Fats" value={fatEaten} goal={goals.fat}/></div></div>
            <p className="cyg-card-footnote">{formatEnergy(Math.max(0,caloriesRemaining),displaySettings.energyUnit)} remaining today</p>
          </section>

          {showGoals && (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div><h2 className="text-xl font-black">Daily targets</h2><p className="mt-1 text-sm text-slate-500">Stored internally as kcal and grams, displayed in your selected energy unit.</p></div>
                <button onClick={() => setShowGoals(false)} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black">Close</button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <GoalField label="Energy" value={goalCalories} onChange={setGoalCalories} unit={energyUnitLabel(displaySettings.energyUnit)} />
                <GoalField label="Protein" value={goalProtein} onChange={setGoalProtein} unit="g" />
                <GoalField label="Carbs" value={goalCarbs} onChange={setGoalCarbs} unit="g" />
                <GoalField label="Fat" value={goalFat} onChange={setGoalFat} unit="g" />
              </div>
              <button onClick={saveGoals} className="mt-4 rounded-xl bg-blue-500 px-5 py-3 text-sm font-black text-white">Save targets</button>
            </section>
          )}

          <section className="cyg-meals">
            {meals.map((meal) => {
              const mealFoods = foods.filter((food) => (food.mealId || "breakfast") === meal.id);
              const totals = mealTotals(mealFoods);
              const expanded = Boolean(expandedMeals[meal.id]);
              return (
                <div key={meal.id} className="cyg-meal-card overflow-hidden border border-slate-200 bg-white shadow-sm">
                  <button
                    onClick={() => setExpandedMeals((current) => ({ ...current, [meal.id]: !current[meal.id] }))}
                    className="cyg-meal-header"
                  >
                    <span className={`cyg-meal-symbol ${meal.id}`}><CygIcon name={meal.id==='breakfast'?'sun':meal.id==='dinner'?'moon':'nutrition'} size={24}/></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-lg font-black text-slate-950">{meal.name}</h3>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">{mealFoods.length}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{formatEnergy(totals.calories, displaySettings.energyUnit)} · {round1(totals.protein)}P · {round1(totals.carbs)}C · {round1(totals.fat)}F</p>
                    </div>
                    <span className="text-xl text-slate-600">{expanded ? "⌃" : "⌄"}</span>
                  </button>

                  {expanded && (
                    <div className="border-t border-slate-100 p-3 sm:p-4">
                      {mealFoods.length ? (
                        <div className="space-y-2">
                          {mealFoods.map((food) => (
                            <div key={food.id} className="cyg-food-item">
                              <span className="cyg-food-emoji" aria-hidden="true"><CygIcon name={/oat|cereal|granola|rice/i.test(food.name)?'bowl':/yog|skyr|milk/i.test(food.name)?'water':/chicken|turkey|egg/i.test(food.name)?'protein':'nutrition'} size={22}/></span>
                              <div><strong>{food.name}</strong><p>{round1(food.protein)}P · {round1(food.carbs)}C · {round1(food.fat)}F</p><details className="cyg-food-details"><summary aria-label={`Options for ${food.name}`}>Edit · more</summary><div className="cyg-food-actions"><button onClick={()=>setEditingFood({...food})}>Edit</button><button onClick={()=>duplicateFood(food.id)}>Copy</button><select aria-label={`Meal for ${food.name}`} value={food.mealId||'breakfast'} onChange={event=>moveFood(food.id,event.target.value)}>{meals.map(option=><option key={option.id} value={option.id}>{option.name}</option>)}</select><button onClick={()=>deleteFood(food.id)}>Delete</button></div></details></div>
                              <span className="cyg-food-energy">{formatEnergy(food.calories,displaySettings.energyUnit)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Nothing logged yet.</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={() => openAdd("menu", meal.id)} className="rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-black text-white">+ Add food</button>
                        {mealFoods.length > 0 && <button onClick={() => saveMealFromMeal(meal.id)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black">Save meal</button>}
                        {mealFoods.length > 0 && <button onClick={() => createRecipeFromMeal(meal.id)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black">Save recipe</button>}
                        {mealFoods.length > 0 && <button onClick={() => duplicateMeal(meal.id)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black">Duplicate</button>}
                        {!(["breakfast", "lunch", "dinner", "snacks"] as string[]).includes(meal.id) && <button onClick={() => deleteMeal(meal.id)} className="rounded-xl border border-rose-200 px-4 py-2.5 text-xs font-black text-rose-600">Delete meal</button>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          <section className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div><p className="text-xs font-black uppercase tracking-widest text-sky-600">Water</p><p className="mt-1 text-2xl font-black">{(waterMl / 1000).toFixed(1)} / {(waterGoal / 1000).toFixed(1)} L</p></div>
                <button onClick={() => setWaterMl(0)} className="rounded-lg bg-slate-100 px-3 py-2 text-[11px] font-black text-slate-500">Reset</button>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.min(100, (waterMl / waterGoal) * 100)}%` }} /></div>
              <div className="mt-3 flex gap-2">{[250, 500, 750].map((ml) => <button key={ml} onClick={() => setWaterMl((value) => value + ml)} className="flex-1 rounded-xl bg-slate-100 py-2 text-xs font-black">+{ml} ml</button>)}</div>
            </div>
            <div className="grid gap-2 sm:w-52">
              <button onClick={() => openAdd("optimizer")} className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-left text-sm font-black text-blue-800">What can I eat? →</button>
              <button onClick={() => openAdd("scan")} className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-left text-sm font-black text-violet-800">AI Meal Scan →</button>
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            {hasYesterday && <button onClick={() => { const ok = copyYesterdayFoods(); setDiaryMessage(ok ? "Yesterday copied to today." : "No yesterday log found."); }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black">Copy yesterday</button>}
            <button onClick={() => setShowNewMeal((value) => !value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black">+ Custom meal</button>
          </div>
          {showNewMeal && (
            <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-3">
              <input value={newMealName} onChange={(event) => setNewMealName(event.target.value)} placeholder="Meal name" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
              <button onClick={createCustomMeal} className="rounded-xl bg-blue-500 px-4 text-sm font-black text-white">Create</button>
            </div>
          )}
        </>
      )}

      {tab === "insights" && (
        <div className="space-y-5">
          <NutritionInsights
            foods={foods}
            caloriesEaten={caloriesEaten}
            proteinEaten={proteinEaten}
            carbsEaten={carbsEaten}
            fatEaten={fatEaten}
            goals={goals}
            nutritionHistory={nutritionHistory}
            waterMl={waterMl}
            setWaterMl={setWaterMl}
          />
          <section className="grid gap-3 sm:grid-cols-3">
            <InsightStat label="7-day average" value={nutritionStats.avg7 === null ? "—" : formatEnergy(nutritionStats.avg7, displaySettings.energyUnit)} />
            <InsightStat label="14-day average" value={nutritionStats.avg14 === null ? "—" : formatEnergy(nutritionStats.avg14, displaySettings.energyUnit)} />
            <InsightStat label="Calorie adherence" value={nutritionStats.adherence === null ? "—" : `${nutritionStats.adherence}%`} />
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-slate-600">History</p><h2 className="mt-1 text-xl font-black">Recent nutrition</h2></div><span className="text-xs text-slate-600">Auto-saved</span></div>
            <div className="mt-4 space-y-2">
              {[...nutritionHistory].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14).map((day) => (
                <div key={day.date} className="grid grid-cols-[1fr_auto] gap-4 rounded-2xl bg-slate-50 p-3 text-sm">
                  <div><p className="font-black">{day.date === todayKey() ? "Today" : day.date}</p><p className="mt-1 text-xs text-slate-500">{round1(day.protein)}P · {round1(day.carbs)}C · {round1(day.fat)}F</p></div>
                  <p className="self-center font-black">{formatEnergy(day.calories, displaySettings.energyUnit)}</p>
                </div>
              ))}
              {nutritionHistory.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Start logging and your trends will appear here.</p>}
            </div>
          </section>
        </div>
      )}

      {tab === "library" && (
        <div className="space-y-5">
          <section className="grid gap-4 lg:grid-cols-2">
            <LibraryCard title="Saved meals" detail="Reusable meals you can add in one tap." empty="Save a meal from Today to build your library.">
              {savedMeals.map((meal) => (
                <div key={meal.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="min-w-0 flex-1"><p className="truncate font-black">{meal.name}</p><p className="mt-1 text-xs text-slate-500">{meal.foods.length} foods · {formatEnergy(mealTotals(meal.foods).calories, displaySettings.energyUnit)}</p></div>
                  <button onClick={() => addSavedMeal(meal, meals[0]?.id)} className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-black text-white">Add</button>
                  <button onClick={() => setSavedMeals((current) => current.filter((item) => item.id !== meal.id))} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-rose-500">×</button>
                </div>
              ))}
            </LibraryCard>
            <LibraryCard title="Recipes" detail="Saved recipes are divided by servings." empty="Save a recipe from any meal in Today.">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="min-w-0 flex-1"><p className="truncate font-black">{recipe.name}</p><p className="mt-1 text-xs text-slate-500">{recipe.servings} servings · {recipe.foods.length} foods</p></div>
                  <button onClick={() => addRecipe(recipe, meals[0]?.id)} className="rounded-xl bg-violet-500 px-3 py-2 text-xs font-black text-white">Add serving</button>
                  <button onClick={() => setRecipes((current) => current.filter((item) => item.id !== recipe.id))} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-rose-500">×</button>
                </div>
              ))}
            </LibraryCard>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-slate-600">Food library</p><h2 className="mt-1 text-xl font-black">Search, barcode & custom foods</h2><p className="mt-1 text-sm text-slate-500">Use one search surface instead of keeping it open on the daily diary.</p></div><button onClick={() => openAdd("search")} className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-black text-white">Open food search</button></div>
          </section>
        </div>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/45 p-2 sm:items-center sm:p-5">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-[#f7f8f9] p-4 shadow-2xl sm:p-6">
            <div className="sticky top-0 z-10 -mx-1 mb-4 flex items-center justify-between gap-3 rounded-2xl bg-[#f7f8f9]/95 px-1 py-2 backdrop-blur">
              <div><p className="text-xs font-black uppercase tracking-widest text-blue-600">Add to {meals.find((meal) => meal.id === targetMealId)?.name || "meal"}</p><h2 className="mt-1 text-2xl font-black">{addTitle(addMode)}</h2></div>
              <button onClick={closeAdd} className="rounded-xl bg-white px-4 py-2 text-sm font-black shadow-sm">Close</button>
            </div>

            {addMode === "menu" && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <AddChoice title="Search food" detail="Database, barcode and your custom foods." onClick={() => setAddMode("search")} />
                <AddChoice title="AI Meal Scan" detail="Take a photo and review an estimated meal." onClick={() => setAddMode("scan")} />
                <AddChoice title="What can I eat?" detail="Tell CYG what you have; it calculates portions." onClick={() => setAddMode("optimizer")} />
                <AddChoice title="Quick add" detail={`Enter ${energyUnitLabel(displaySettings.energyUnit)} and macros manually.`} onClick={() => setAddMode("quick")} />
                <AddChoice title="Saved meals" detail="Reuse meals from your Library." onClick={() => setAddMode("saved")} />
              </div>
            )}

            {addMode === "search" && (
              <FoodSearch meals={meals} onAddFood={(food) => { addFood({ ...food, mealId: targetMealId }); setDiaryMessage(`${food.name} added.`); }} requestedMealId={targetMealId} />
            )}

            {addMode === "scan" && (planTier === "premium" ? <MealScan meals={meals} defaultMealId={targetMealId} displaySettings={displaySettings} onAddFoods={(items) => { addFoods(items); setDiaryMessage("Scanned meal added."); }} /> : <PremiumPaywall title="AI Meal Scan is Premium" detail="Photo-based meal estimation is available on CYG Premium. You can still search foods, use barcode lookup and quick add on Free." />)}

            {addMode === "optimizer" && (
              <MealOptimizer
                caloriesRemaining={caloriesRemaining}
                proteinRemaining={proteinRemaining}
                carbsRemaining={carbsRemaining}
                fatRemaining={fatRemaining}
                meals={meals}
                displaySettings={displaySettings}
                onAddFoods={(items) => { addFoods(items); setDiaryMessage("Suggested meal added."); }}
              />
            )}

            {addMode === "quick" && (
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <QuickField label="Food name" value={quickName} onChange={setQuickName} />
                  <QuickField label={`Energy (${energyUnitLabel(displaySettings.energyUnit)})`} value={quickCalories} onChange={setQuickCalories} type="number" />
                  <QuickField label="Protein (g)" value={quickProtein} onChange={setQuickProtein} type="number" />
                  <QuickField label="Carbs (g)" value={quickCarbs} onChange={setQuickCarbs} type="number" />
                  <QuickField label="Fat (g)" value={quickFat} onChange={setQuickFat} type="number" />
                </div>
                <button onClick={addQuickFood} className="mt-4 w-full rounded-2xl bg-blue-500 py-4 font-black text-white">Add quick food</button>
              </section>
            )}

            {addMode === "saved" && (
              <section className="space-y-3">
                {savedMeals.map((meal) => (
                  <button key={meal.id} onClick={() => addSavedMeal(meal)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                    <div><p className="font-black">{meal.name}</p><p className="mt-1 text-xs text-slate-500">{meal.foods.length} foods · {formatEnergy(mealTotals(meal.foods).calories, displaySettings.energyUnit)}</p></div><span className="font-black text-blue-600">+ Add</span>
                  </button>
                ))}
                {!savedMeals.length && <p className="rounded-2xl bg-white p-5 text-sm text-slate-500">No saved meals yet. Save one from Today.</p>}
              </section>
            )}
          </div>
        </div>
      )}

      {editingFood && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-950/45 p-2 sm:items-center">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black">Edit food</h2><button onClick={() => setEditingFood(null)} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black">Close</button></div>
            <div className="mt-4 space-y-3">
              <EditField label="Name" value={editingFood.name} onChange={(value) => setEditingFood((food) => food ? { ...food, name: value } : food)} />
              <EditField label={`Energy (${energyUnitLabel(displaySettings.energyUnit)})`} value={String(Math.round(kcalToDisplay(editingFood.calories, displaySettings.energyUnit)))} onChange={(value) => setEditingFood((food) => food ? { ...food, calories: Math.max(0, Math.round(displayToKcal(Number(value) || 0, displaySettings.energyUnit))) } : food)} type="number" />
              <div className="grid grid-cols-3 gap-2">
                <EditField label="Protein" value={String(editingFood.protein)} onChange={(value) => setEditingFood((food) => food ? { ...food, protein: Number(value) || 0 } : food)} type="number" />
                <EditField label="Carbs" value={String(editingFood.carbs)} onChange={(value) => setEditingFood((food) => food ? { ...food, carbs: Number(value) || 0 } : food)} type="number" />
                <EditField label="Fat" value={String(editingFood.fat)} onChange={(value) => setEditingFood((food) => food ? { ...food, fat: Number(value) || 0 } : food)} type="number" />
              </div>
            </div>
            <button onClick={saveEditedFood} className="mt-4 w-full rounded-2xl bg-blue-500 py-4 font-black text-white">Save changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

function addTitle(mode: AddMode) {
  return ({ menu: "Add food", search: "Food search", scan: "AI Meal Scan", optimizer: "What can I eat?", quick: "Quick add", saved: "Saved meals" } as Record<AddMode, string>)[mode];
}

function MacroMini({ label, value, goal }: { label: string; value: number; goal: number }) {
  const pct = goal > 0 ? Math.min(100, (value / goal) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between gap-2 text-xs"><span className="font-black text-slate-700">{label}</span><span className="text-slate-600">{Math.round(value)}/{goal}g</span></div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function GoalField({ label, value, onChange, unit }: { label: string; value: string; onChange: (value: string) => void; unit: string }) {
  return <label className="block"><span className="text-xs font-black uppercase tracking-wider text-slate-600">{label}</span><div className="mt-1 flex rounded-xl border border-slate-200 bg-white"><input type="number" min="0" value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-3 font-black outline-none"/><span className="self-center pr-3 text-xs font-bold text-slate-600">{unit}</span></div></label>;
}

function InsightStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-slate-600">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div>;
}

function LibraryCard({ title, detail, empty, children }: { title: string; detail: string; empty: string; children: React.ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-black">{title}</h2><p className="mt-1 text-sm text-slate-500">{detail}</p><div className="mt-4 space-y-2">{hasChildren ? children : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{empty}</p>}</div></section>;
}

function AddChoice({ title, detail, onClick }: { title: string; detail: string; onClick: () => void }) {
  return <button onClick={onClick} className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300"><p className="font-black text-slate-950">{title}</p><p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p><span className="mt-4 inline-block text-sm font-black text-blue-600">Open →</span></button>;
}

function QuickField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: "text" | "number" }) {
  return <label className="block"><span className="text-xs font-black uppercase tracking-wider text-slate-600">{label}</span><input type={type} min={type === "number" ? 0 : undefined} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"/></label>;
}

function EditField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: "text" | "number" }) {
  return <label className="block"><span className="text-xs font-black uppercase tracking-wider text-slate-600">{label}</span><input type={type} min={type === "number" ? 0 : undefined} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"/></label>;
}
