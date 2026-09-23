"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type SocialProfile = {
  user_id: string;
  username: string;
  display_name: string;
  bio: string | null;
  discoverable: boolean;
};

type Friendship = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "declined" | "blocked";
  created_at: string;
  accepted_at?: string | null;
};

type Permission = {
  owner_id: string;
  friend_id: string;
  share_training: boolean;
  share_progress: boolean;
  share_nutrition: boolean;
  share_measurements: boolean;
};

type FriendSnapshot = {
  profile?: SocialProfile | null;
  training?: {
    workouts?: number;
    weeklyWorkouts?: number;
    latestWorkout?: { name: string; finishedAt: string; durationMinutes: number } | null;
    prs?: Array<{ exercise: string; weight: number; reps: number }>;
  } | null;
  progress?: {
    latestWeight?: number | null;
    weightChange?: number | null;
    weightEntries?: number;
  } | null;
  nutrition?: {
    todayCalories?: number;
    calorieGoal?: number;
    protein?: number;
    proteinGoal?: number;
    daysLogged?: number;
  } | null;
  measurements?: {
    latest?: { date: string; waist?: number; chest?: number; arm?: number } | null;
  } | null;
};

function safeJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function makeSnapshot() {
  const workouts = safeJson<any[]>("bodypilot-workout-history", []);
  const weights = safeJson<any[]>("bodypilot-weight", []);
  const nutrition = safeJson<any[]>("bodypilot-nutrition-history", []);
  const goals = safeJson<any>("bodypilot-goals", { calories: 0, protein: 0 });
  const measurements = safeJson<any[]>("bodypilot-measurements", []);
  const now = Date.now();
  const weekAgo = now - 7 * 86400000;
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime());
  const sortedWeights = [...weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestWeight = sortedWeights.at(-1)?.weight ?? null;
  const previousWeight = sortedWeights.at(-2)?.weight ?? null;
  const today = new Date();
  const todayKey = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
  const todayNutrition = nutrition.find((day) => day.date === todayKey) || null;

  const prMap = new Map<string, { exercise: string; weight: number; reps: number; score: number }>();
  for (const workout of workouts) {
    for (const exercise of workout.exercises || []) {
      for (const set of exercise.sets || []) {
        const weight = Number(set.weight) || 0;
        const reps = Number(set.reps) || 0;
        if (weight <= 0 || reps <= 0) continue;
        const score = weight * (1 + reps / 30);
        const current = prMap.get(exercise.exerciseId || exercise.exerciseName);
        if (!current || score > current.score) {
          prMap.set(exercise.exerciseId || exercise.exerciseName, {
            exercise: exercise.exerciseName,
            weight,
            reps,
            score,
          });
        }
      }
    }
  }

  return {
    training: {
      workouts: workouts.length,
      weeklyWorkouts: workouts.filter((workout) => new Date(workout.finishedAt).getTime() >= weekAgo).length,
      latestWorkout: sortedWorkouts[0]
        ? {
            name: sortedWorkouts[0].name,
            finishedAt: sortedWorkouts[0].finishedAt,
            durationMinutes: Math.round((sortedWorkouts[0].durationSeconds || 0) / 60),
          }
        : null,
      prs: [...prMap.values()].sort((a, b) => b.score - a.score).slice(0, 5).map(({ score: _score, ...rest }) => rest),
    },
    progress: {
      latestWeight,
      weightChange: latestWeight !== null && previousWeight !== null ? Math.round((latestWeight - previousWeight) * 10) / 10 : null,
      weightEntries: weights.length,
    },
    nutrition: {
      todayCalories: Math.round(todayNutrition?.calories || 0),
      calorieGoal: Number(goals?.calories) || 0,
      protein: Math.round(todayNutrition?.protein || 0),
      proteinGoal: Number(goals?.protein) || 0,
      daysLogged: nutrition.length,
    },
    measurements: {
      latest: measurements.length ? measurements[measurements.length - 1] : null,
    },
  };
}

export default function FriendsPanel() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [me, setMe] = useState<string | null>(null);
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SocialProfile[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [profiles, setProfiles] = useState<Record<string, SocialProfile>>({});
  const [permissions, setPermissions] = useState<Record<string, Permission>>({});
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<FriendSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [setupMissing, setSetupMissing] = useState(false);
  const [socialTab, setSocialTab] = useState<"friends" | "search" | "requests">("friends");
  const [searching, setSearching] = useState(false);
  const [searchTouched, setSearchTouched] = useState(false);

  async function refresh() {
    setMessage("");
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) {
      setMe(null);
      setLoading(false);
      return;
    }
    setMe(user.id);

    const { data: myProfile, error: profileError } = await supabase
      .from("social_profiles")
      .select("user_id, username, display_name, bio, discoverable")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError && /does not exist|relation/i.test(profileError.message)) {
      setSetupMissing(true);
      setLoading(false);
      return;
    }

    const defaultName = user.user_metadata?.display_name || user.email?.split("@")[0] || "CYG user";
    const defaultUsername = (user.email?.split("@")[0] || `user-${user.id.slice(0, 6)}`)
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 24);

    if (!myProfile) {
      const { data: created, error } = await supabase
        .from("social_profiles")
        .upsert({ user_id: user.id, username: defaultUsername, display_name: defaultName, discoverable: true }, { onConflict: "user_id" })
        .select("user_id, username, display_name, bio, discoverable")
        .single();
      if (error) {
        setMessage(error.message);
      } else if (created) {
        setProfile(created);
        setUsername(created.username);
        setDisplayName(created.display_name);
      }
    } else {
      setProfile(myProfile);
      setUsername(myProfile.username);
      setDisplayName(myProfile.display_name);
    }

    const { data: relationRows, error: relationError } = await supabase
      .from("friendships")
      .select("id, requester_id, addressee_id, status, created_at, accepted_at")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (relationError) {
      setMessage(relationError.message);
      setLoading(false);
      return;
    }

    const rows = (relationRows || []) as Friendship[];
    setFriendships(rows);
    const ids = [...new Set(rows.flatMap((row) => [row.requester_id, row.addressee_id]).filter((id) => id !== user.id))];
    if (ids.length) {
      const { data: socialProfiles } = await supabase
        .from("social_profiles")
        .select("user_id, username, display_name, bio, discoverable")
        .in("user_id", ids);
      const map: Record<string, SocialProfile> = {};
      for (const item of (socialProfiles || []) as SocialProfile[]) map[item.user_id] = item;
      setProfiles(map);

      const { data: permissionRows } = await supabase
        .from("friend_permissions")
        .select("owner_id, friend_id, share_training, share_progress, share_nutrition, share_measurements")
        .eq("owner_id", user.id)
        .in("friend_id", ids);
      const permissionMap: Record<string, Permission> = {};
      for (const item of (permissionRows || []) as Permission[]) permissionMap[item.friend_id] = item;
      setPermissions(permissionMap);
    } else {
      setProfiles({});
      setPermissions({});
    }

    const localSnapshot = makeSnapshot();
    await supabase.from("social_snapshots").upsert(
      { user_id: user.id, ...localSnapshot, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    setLoading(false);
  }

  useEffect(() => {
    void refresh().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Could not load friends.");
      setLoading(false);
    });
  }, []);

  async function saveProfile() {
    if (!me) return;
    const clean = username.toLowerCase().trim().replace(/[^a-z0-9_]/g, "").slice(0, 24);
    if (clean.length < 3) {
      setMessage("Username needs at least 3 letters, numbers or underscores.");
      return;
    }
    const { error } = await supabase.from("social_profiles").upsert(
      { user_id: me, username: clean, display_name: displayName.trim() || clean, discoverable: true },
      { onConflict: "user_id" }
    );
    if (error) setMessage(error.message);
    else {
      setMessage("Social profile saved.");
      await refresh();
    }
  }

  async function searchUsers() {
    if (!me) return;
    const q = search.trim().replace(/^@/, "").replace(/[%(),]/g, "");
    setSearchTouched(true);
    if (q.length < 2) {
      setResults([]);
      setMessage("Type at least 2 characters to search.");
      return;
    }
    setSearching(true);
    setMessage("");
    const { data, error } = await supabase
      .from("social_profiles")
      .select("user_id, username, display_name, bio, discoverable")
      .eq("discoverable", true)
      .neq("user_id", me)
      .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
      .limit(12);
    setSearching(false);
    if (error) { setResults([]); setMessage(error.message); }
    else setResults((data || []) as SocialProfile[]);
  }

  async function requestFriend(userId: string) {
    if (!me) return;
    const { error } = await supabase.from("friendships").insert({ requester_id: me, addressee_id: userId, status: "pending" });
    if (error) setMessage(error.message.includes("duplicate") ? "A request already exists." : error.message);
    else {
      setMessage("Friend request sent.");
      setResults((current) => current.filter((item) => item.user_id !== userId));
      await refresh();
    }
  }

  async function setRequest(id: string, status: "accepted" | "declined") {
    const { error } = await supabase.from("friendships").update({ status, accepted_at: status === "accepted" ? new Date().toISOString() : null }).eq("id", id);
    if (error) setMessage(error.message);
    else await refresh();
  }

  async function removeFriend(id: string) {
    if (!window.confirm("Remove this friend?")) return;
    const { error } = await supabase.from("friendships").delete().eq("id", id);
    if (error) setMessage(error.message);
    else {
      setSelectedFriend(null);
      setSnapshot(null);
      await refresh();
    }
  }

  async function updatePermission(friendId: string, key: keyof Omit<Permission, "owner_id" | "friend_id">, value: boolean) {
    if (!me) return;
    const current = permissions[friendId] || {
      owner_id: me,
      friend_id: friendId,
      share_training: true,
      share_progress: false,
      share_nutrition: false,
      share_measurements: false,
    };
    const next = { ...current, [key]: value };
    setPermissions((all) => ({ ...all, [friendId]: next }));
    const { error } = await supabase.from("friend_permissions").upsert(next, { onConflict: "owner_id,friend_id" });
    if (error) setMessage(error.message);
  }

  async function openFriend(friendId: string) {
    setSelectedFriend(friendId);
    setSnapshot(null);
    const { data, error } = await supabase.rpc("get_friend_snapshot", { friend_user: friendId });
    if (error) setMessage(error.message);
    else setSnapshot((data || {}) as FriendSnapshot);
  }

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-6"><p className="font-black">Loading Friends…</p></div>;
  if (!me) return <div className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-black">Sign in first</h2><p className="mt-2 text-sm text-slate-500">Friends use your CYG cloud account so requests and privacy rules work across devices.</p></div>;
  if (setupMissing) return <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6"><h2 className="text-xl font-black text-amber-950">Friends database setup is required once</h2><p className="mt-2 text-sm leading-6 text-amber-800">Run the included <b>social database</b> migration in Supabase, then reopen this page. No existing workout or nutrition data is deleted.</p></div>;

  const accepted = friendships.filter((row) => row.status === "accepted");
  const incoming = friendships.filter((row) => row.status === "pending" && row.addressee_id === me);
  const outgoing = friendships.filter((row) => row.status === "pending" && row.requester_id === me);

  if (selectedFriend) {
    const social = profiles[selectedFriend];
    const permission = permissions[selectedFriend] || {
      owner_id: me,
      friend_id: selectedFriend,
      share_training: true,
      share_progress: false,
      share_nutrition: false,
      share_measurements: false,
    };
    const relation = accepted.find((row) => row.requester_id === selectedFriend || row.addressee_id === selectedFriend);
    return (
      <div className="space-y-5">
        <button onClick={() => { setSelectedFriend(null); setSnapshot(null); }} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black">← Friends</button>
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-xl font-black text-blue-700">{(social?.display_name || "F")[0].toUpperCase()}</div><div><h2 className="text-2xl font-black">{social?.display_name || "Friend"}</h2><p className="text-sm text-slate-500">@{social?.username || "user"}</p></div></div>
            {relation && <button onClick={() => void removeFriend(relation.id)} className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-black text-rose-600">Remove friend</button>}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-slate-600">What they can see from you</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <PrivacyToggle label="Training & PRs" value={permission.share_training} onChange={(value) => void updatePermission(selectedFriend, "share_training", value)} />
            <PrivacyToggle label="Weight progress" value={permission.share_progress} onChange={(value) => void updatePermission(selectedFriend, "share_progress", value)} />
            <PrivacyToggle label="Nutrition summary" value={permission.share_nutrition} onChange={(value) => void updatePermission(selectedFriend, "share_nutrition", value)} />
            <PrivacyToggle label="Measurements" value={permission.share_measurements} onChange={(value) => void updatePermission(selectedFriend, "share_measurements", value)} />
          </div>
          <p className="mt-3 text-xs text-slate-600">Private categories stay hidden until you explicitly enable them for this friend.</p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-blue-600">Shared with you</p><h3 className="mt-1 text-xl font-black">Friend activity</h3></div><button onClick={() => void openFriend(selectedFriend)} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black">Refresh</button></div>
          {!snapshot ? <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Loading shared data…</p> : <FriendSnapshotView snapshot={snapshot} />}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 rounded-2xl bg-slate-100 p-1">
        {([['friends','Friends'],['search','Search'],['requests',`Requests${incoming.length ? ` (${incoming.length})` : ''}`]] as const).map(([key,label]) => (
          <button type="button" key={key} onClick={() => setSocialTab(key)} className={`rounded-xl px-3 py-2.5 text-sm font-black transition ${socialTab===key?'bg-white text-slate-950 shadow-sm':'text-slate-500'}`}>{label}</button>
        ))}
      </div>
      {socialTab === "friends" && <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">Your social profile</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label><span className="text-xs font-black text-slate-500">Username</span><div className="mt-1 flex rounded-xl border border-slate-200"><span className="self-center pl-3 text-slate-600">@</span><input value={username} onChange={(event) => setUsername(event.target.value)} className="min-w-0 flex-1 rounded-xl px-2 py-3 outline-none" /></div></label>
          <label><span className="text-xs font-black text-slate-500">Display name</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none" /></label>
          <button onClick={() => void saveProfile()} className="self-end rounded-xl bg-blue-500 px-5 py-3 text-sm font-black text-white">Save</button>
        </div>
        {profile && <p className="mt-3 text-xs text-slate-600">Friends can find you as @{profile.username}. Your private fitness data is not public.</p>}
      </section>}

      {socialTab === "search" && <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Find friends</h2>
        <div className="mt-3 flex gap-2"><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void searchUsers(); }} placeholder="Search @username or name" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" /><button type="button" disabled={searching} onClick={() => void searchUsers()} className="rounded-xl bg-blue-500 px-5 text-sm font-black text-white disabled:opacity-50">{searching ? "Searching…" : "Search"}</button></div>
        {searchTouched && !searching && search.trim().length >= 2 && results.length === 0 && !message && <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No discoverable users found. Try their exact @username.</p>}
        {results.length > 0 && <div className="mt-3 space-y-2">{results.map((item) => <div key={item.user_id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><div className="min-w-0 flex-1"><p className="font-black">{item.display_name}</p><p className="text-xs text-slate-500">@{item.username}</p></div><button onClick={() => void requestFriend(item.user_id)} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-blue-700">Add friend</button></div>)}</div>}
      </section>}

      {socialTab === "requests" && <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-black">Requests</h2>{incoming.length === 0 && outgoing.length === 0 ? <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No pending friend requests.</p> : null}{incoming.length > 0 && <div className="mt-3 space-y-2">{incoming.map((row) => { const person = profiles[row.requester_id]; return <div key={row.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 p-3"><div className="min-w-0 flex-1"><p className="font-black">{person?.display_name || "CYG user"}</p><p className="text-xs text-slate-500">@{person?.username || "user"}</p></div><button type="button" onClick={() => void setRequest(row.id, "declined")} className="rounded-xl px-3 py-2 text-xs font-black text-rose-600">Decline</button><button type="button" onClick={() => void setRequest(row.id, "accepted")} className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-black text-white">Accept</button></div>; })}</div>}{outgoing.length > 0 && <div className="mt-5"><p className="text-xs font-black uppercase tracking-widest text-slate-600">Sent</p><div className="mt-2 space-y-2">{outgoing.map(row => { const person=profiles[row.addressee_id]; return <div key={row.id} className="rounded-2xl bg-slate-50 p-3"><p className="font-black">{person?.display_name || "CYG user"}</p><p className="text-xs text-slate-500">@{person?.username || "user"} · Pending</p></div>; })}</div></div>}</section>}

      {socialTab === "friends" && <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black">Friends</h2><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">{accepted.length}</span></div>
        <div className="mt-3 space-y-2">
          {accepted.map((row) => {
            const friendId = row.requester_id === me ? row.addressee_id : row.requester_id;
            const person = profiles[friendId];
            return <button key={row.id} onClick={() => void openFriend(friendId)} className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white font-black text-blue-700">{(person?.display_name || "F")[0].toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate font-black">{person?.display_name || "CYG user"}</p><p className="text-xs text-slate-500">@{person?.username || "user"}</p></div><span className="text-slate-600">›</span></button>;
          })}
          {!accepted.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No friends yet. Search by username and send a request.</p>}
        </div>
        {outgoing.length > 0 && <p className="mt-3 text-xs text-slate-600">{outgoing.length} outgoing request{outgoing.length === 1 ? "" : "s"} pending.</p>}
      </section>}

      {message && <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">{message}</p>}
    </div>
  );
}

function PrivacyToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return <button onClick={() => onChange(!value)} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 text-left"><span className="text-sm font-black">{label}</span><span className={`relative h-7 w-12 rounded-full ${value ? "bg-blue-500" : "bg-slate-200"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${value ? "left-6" : "left-1"}`} /></span></button>;
}

function FriendSnapshotView({ snapshot }: { snapshot: FriendSnapshot }) {
  const sections = [snapshot.training, snapshot.progress, snapshot.nutrition, snapshot.measurements].filter(Boolean);
  if (!sections.length) return <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">This friend has not shared any fitness categories with you yet.</p>;
  return <div className="mt-4 grid gap-3 sm:grid-cols-2">
    {snapshot.training && <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-widest text-slate-600">Training</p><p className="mt-2 text-2xl font-black">{snapshot.training.weeklyWorkouts ?? 0} <span className="text-sm text-slate-600">this week</span></p>{snapshot.training.latestWorkout && <p className="mt-2 text-sm text-slate-500">Latest: {snapshot.training.latestWorkout.name} · {snapshot.training.latestWorkout.durationMinutes} min</p>}{snapshot.training.prs?.slice(0, 3).map((pr) => <p key={`${pr.exercise}-${pr.weight}`} className="mt-2 text-xs font-bold text-slate-600">PR · {pr.exercise}: {pr.weight} kg × {pr.reps}</p>)}</div>}
    {snapshot.progress && <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-widest text-slate-600">Progress</p><p className="mt-2 text-2xl font-black">{snapshot.progress.latestWeight ?? "—"} <span className="text-sm text-slate-600">kg</span></p><p className="mt-2 text-sm text-slate-500">Latest change: {snapshot.progress.weightChange === null || snapshot.progress.weightChange === undefined ? "—" : `${snapshot.progress.weightChange > 0 ? "+" : ""}${snapshot.progress.weightChange} kg`}</p></div>}
    {snapshot.nutrition && <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-widest text-slate-600">Nutrition</p><p className="mt-2 text-2xl font-black">{snapshot.nutrition.todayCalories ?? 0} <span className="text-sm text-slate-600">/ {snapshot.nutrition.calorieGoal ?? 0} kcal</span></p><p className="mt-2 text-sm text-slate-500">Protein {snapshot.nutrition.protein ?? 0} / {snapshot.nutrition.proteinGoal ?? 0} g</p></div>}
    {snapshot.measurements && <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-widest text-slate-600">Measurements</p>{snapshot.measurements.latest ? <p className="mt-2 text-sm font-bold">Waist {snapshot.measurements.latest.waist ?? "—"} · Chest {snapshot.measurements.latest.chest ?? "—"} · Arm {snapshot.measurements.latest.arm ?? "—"} cm</p> : <p className="mt-2 text-sm text-slate-500">No measurements shared.</p>}</div>}
  </div>;
}
