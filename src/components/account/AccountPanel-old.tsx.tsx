"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function AccountPanel() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setLoading(false);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: displayName.trim() || email.split("@")[0] },
          },
        });
        if (signUpError) throw signUpError;

        if (data.session) {
          setMessage("Account created. You are signed in.");
        } else {
          setMessage("Account created. Check your email and confirm your address, then log in.");
          setMode("login");
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (loginError) throw loginError;
        setMessage("Signed in successfully.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setError("");
    setMessage("");
    setLoading(true);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
    setLoading(false);
  }

  if (loading && !session) {
    return (
      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-black text-slate-900">Loading BodyPilot account…</p>
      </div>
    );
  }

  if (session?.user) {
    const name =
      session.user.user_metadata?.display_name ||
      session.user.email?.split("@")[0] ||
      "BodyPilot user";

    return (
      <div className="max-w-2xl space-y-4">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">BodyPilot Cloud</p>
            <h2 className="mt-2 text-3xl font-black">You&apos;re signed in.</h2>
            <p className="mt-2 text-sm text-slate-300">Your account session is active on this device.</p>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-700">
                {name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xl font-black text-slate-950">{name}</p>
                <p className="truncate text-sm text-slate-500">{session.user.email}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <StatusCard label="Account" value="Connected" detail="Supabase Auth" />
              <StatusCard label="Session" value="Active" detail="Persists after refresh" />
            </div>

            <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-black">Cloud data migration comes next</p>
              <p className="mt-1 leading-6 text-amber-800">
                Your existing workouts, nutrition and progress still stay in localStorage for now, so nothing is lost while we move each module safely.
              </p>
            </div>

            {message && <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p>}
            {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

            <button
              onClick={signOut}
              disabled={loading}
              className="mt-6 rounded-2xl border-2 border-slate-300 bg-white px-5 py-3 text-sm font-black !text-slate-950 shadow-sm hover:bg-slate-50 disabled:opacity-50" style={{ color: "#020617" }}
            >
              {loading ? "Signing out…" : "Log out"}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-950 p-6 text-white">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">BodyPilot Cloud</p>
          <h2 className="mt-2 text-3xl font-black">{mode === "login" ? "Welcome back." : "Create your account."}</h2>
          <p className="mt-2 text-sm text-slate-300">
            {mode === "login" ? "Sign in to your BodyPilot account." : "One account for your future training, nutrition and progress sync."}
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6 flex rounded-2xl bg-slate-100 p-1">
            <button onClick={() => { setMode("login"); setError(""); setMessage(""); }} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black ${mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>Log in</button>
            <button onClick={() => { setMode("signup"); setError(""); setMessage(""); }} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black ${mode === "signup" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>Sign up</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <Field label="Name">
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" />
              </Field>
            )}
            <Field label="Email">
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" />
            </Field>
            <Field label="Password">
              <input type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" />
            </Field>

            {message && <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p>}
            {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 block w-full cursor-pointer rounded-2xl border-2 border-emerald-700 !bg-emerald-600 px-5 py-4 text-center text-base font-black !text-slate-950 shadow-md hover:!bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50" style={{ backgroundColor: "#059669", color: "#020617" }}
            >
              {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-xs leading-5 text-slate-400">
            BodyPilot never needs your Supabase secret/service-role key in the browser. The app uses only the public publishable key from your environment file.
          </p>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-black text-slate-700">{label}</span>{children}</label>;
}

function StatusCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-lg font-black text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}
