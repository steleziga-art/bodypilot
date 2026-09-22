import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Mucipes uses stable string keys so new app modules can be synced
// without changing the storage layer every time a feature is added.
export type MucipesStorageKey = string;

async function getUserId() {
  const supabase = getSupabaseBrowserClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Mucipes: could not get Supabase user:", error);
    return null;
  }

  return user?.id ?? null;
}

export async function loadCloudData<T>(key: MucipesStorageKey): Promise<T | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    const userId = await getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from("user_app_data")
      .select("data")
      .eq("user_id", userId)
      .eq("data_key", key)
      .maybeSingle();

    if (error) {
      console.error(`Mucipes: failed loading "${key}":`, error);
      return null;
    }

    return data ? (data.data as T) : null;
  } catch (error) {
    console.error(`Mucipes: failed loading "${key}":`, error);
    return null;
  }
}

export async function saveCloudData<T>(key: MucipesStorageKey, value: T): Promise<boolean> {
  try {
    const supabase = getSupabaseBrowserClient();
    const userId = await getUserId();
    if (!userId) return false;

    const { error } = await supabase.from("user_app_data").upsert(
      { user_id: userId, data_key: key, data: value },
      { onConflict: "user_id,data_key" }
    );

    if (error) {
      console.error(`Mucipes: failed saving "${key}":`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Mucipes: failed saving "${key}":`, error);
    return false;
  }
}

export async function deleteCloudData(key: MucipesStorageKey): Promise<boolean> {
  try {
    const supabase = getSupabaseBrowserClient();
    const userId = await getUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from("user_app_data")
      .delete()
      .eq("user_id", userId)
      .eq("data_key", key);

    if (error) {
      console.error(`Mucipes: failed deleting "${key}":`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Mucipes: failed deleting "${key}":`, error);
    return false;
  }
}

export async function loadAllCloudData(): Promise<Record<string, unknown>> {
  try {
    const supabase = getSupabaseBrowserClient();
    const userId = await getUserId();
    if (!userId) return {};

    const { data, error } = await supabase
      .from("user_app_data")
      .select("data_key, data")
      .eq("user_id", userId);

    if (error) {
      console.error("Mucipes: failed loading cloud data:", error);
      return {};
    }

    const result: Record<string, unknown> = {};
    for (const row of data ?? []) result[row.data_key] = row.data;
    return result;
  } catch (error) {
    console.error("Mucipes: failed loading cloud data:", error);
    return {};
  }
}
