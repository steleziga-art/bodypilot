import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// CYG uses stable string keys so new app modules can be synced
// without changing the storage layer every time a feature is added.
export type MucipesStorageKey = string;

const PRIVATE_CACHE_DB = "cyg-private-cache";
const PRIVATE_CACHE_STORE = "accounts";

function privateCacheDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("IndexedDB unavailable"));
    const request = indexedDB.open(PRIVATE_CACHE_DB, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(PRIVATE_CACHE_STORE)) {
        request.result.createObjectStore(PRIVATE_CACHE_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open local account cache"));
  });
}

function privateDataKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const appDataKey = key && (key.startsWith("bodypilot-") || key.startsWith("cyg-") || key.startsWith("mucipes-"));
    if (key && appDataKey && !["bodypilot-settings", "cyg-cloud-outbox"].includes(key)) keys.push(key);
  }
  return keys;
}

function clearPrivateLocalData() {
  for (const key of privateDataKeys()) localStorage.removeItem(key);
}

/** Move account-specific browser cache out of the shared app keys before logout. */
export async function cacheAccountDataLocally(userId: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const snapshot: Record<string, string> = {};
    for (const key of privateDataKeys()) {
      const value = localStorage.getItem(key);
      if (value !== null) snapshot[key] = value;
    }
    const db = await privateCacheDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(PRIVATE_CACHE_STORE, "readwrite");
      tx.objectStore(PRIVATE_CACHE_STORE).put(snapshot, userId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("Could not save local account cache"));
      tx.onabort = () => reject(tx.error || new Error("Local account cache save aborted"));
    });
    db.close();
    return true;
  } catch (error) {
    console.error("CYG: could not preserve local account cache:", error);
    return false;
  }
}

/** Clear shared keys while logged out, then restore only this account's cache on sign-in. */
export async function restoreAccountDataLocally(userId: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await privateCacheDb();
    const snapshot = await new Promise<Record<string, string> | undefined>((resolve, reject) => {
      const request = db.transaction(PRIVATE_CACHE_STORE, "readonly").objectStore(PRIVATE_CACHE_STORE).get(userId);
      request.onsuccess = () => resolve(request.result as Record<string, string> | undefined);
      request.onerror = () => reject(request.error || new Error("Could not load local account cache"));
    });
    db.close();
    if (snapshot) {
      clearPrivateLocalData();
      for (const [key, value] of Object.entries(snapshot)) localStorage.setItem(key, value);
    }
    return true;
  } catch (error) {
    console.error("CYG: could not restore local account cache:", error);
    return false;
  }
}

export function clearPrivateAccountCache() {
  if (typeof window !== "undefined") clearPrivateLocalData();
}

async function getUserId() {
  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  // The cached authenticated identity scopes offline writes. Supabase still
  // validates the token when the queued operation reaches the database.
  if (session?.user.id) return session.user.id;
  const { data: { user }, error } = await supabase.auth.getUser();
  if(error)return null;
  return user?.id ?? null;
}

async function rawLoadCloudData<T>(key: MucipesStorageKey): Promise<T | null> {
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
      console.error(`CYG: failed loading "${key}":`, error);
      return null;
    }

    return data ? (data.data as T) : null;
  } catch (error) {
    console.error(`CYG: failed loading "${key}":`, error);
    return null;
  }
}

async function rawSaveCloudData<T>(key: MucipesStorageKey, value: T): Promise<boolean> {
  try {
    const supabase = getSupabaseBrowserClient();
    const userId = await getUserId();
    if (!userId) return false;

    const { error } = await supabase.from("user_app_data").upsert(
      { user_id: userId, data_key: key, data: value },
      { onConflict: "user_id,data_key" }
    );

    if (error) {
      console.error(`CYG: failed saving "${key}":`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`CYG: failed saving "${key}":`, error);
    return false;
  }
}

async function rawDeleteCloudData(key: MucipesStorageKey): Promise<boolean> {
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
      console.error(`CYG: failed deleting "${key}":`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`CYG: failed deleting "${key}":`, error);
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
      console.error("CYG: failed loading cloud data:", error);
      return {};
    }

    const result: Record<string, unknown> = {};
    for (const row of data ?? []) result[row.data_key] = row.data;
    return result;
  } catch (error) {
    console.error("CYG: failed loading cloud data:", error);
    return {};
  }
}

// A user-scoped durable outbox keeps the newest change until acknowledged.
type PendingWrite = {userId:string; key:string; value?:unknown; remove:boolean; revision:string};
const OUTBOX = "cyg-cloud-outbox";
const running = new Map<string,Promise<boolean>>();
let submission=0;
const newestSubmission=new Map<string,number>();
function readOutbox():Record<string,PendingWrite>{try{return JSON.parse(localStorage.getItem(OUTBOX)||"{}")}catch{return {}}}
function announce(state:string){if(typeof window!=="undefined")window.dispatchEvent(new CustomEvent("cyg-sync-status",{detail:state}))}
function writeOutbox(value:Record<string,PendingWrite>){localStorage.setItem(OUTBOX,JSON.stringify(value))}
async function drain(id:string):Promise<boolean>{
 if(running.has(id))return running.get(id)!;
 const task=(async()=>{while(true){const item=readOutbox()[id];if(!item)return true;
 if((await getUserId())!==item.userId)return false;
 announce("Saving…");
 const ok=item.remove?await rawDeleteCloudData(item.key):await rawSaveCloudData(item.key,item.value);
 if(!ok){announce("Saved on device · sync pending");return false;}
 const pending=readOutbox();if(pending[id]?.revision===item.revision){delete pending[id];writeOutbox(pending)}
 if(!pending[id]){announce(Object.values(pending).some(p=>p.userId===item.userId)?"Sync pending":"Saved to cloud");return true;}
 }})().catch(()=>{announce("Saved on device · sync pending");return false}).finally(()=>{running.delete(id)});
 running.set(id,task);return task;
}
async function enqueue(key:string,value:unknown,remove:boolean){
 const order=++submission;
 if(typeof window==="undefined")return false;
 let userId:string|null=null;try{userId=await getUserId()}catch{}
 if(!userId){announce("Saved on device · sign in to sync");return false;}
 const id=JSON.stringify([userId,key]);
 if((newestSubmission.get(id)||0)>order)return running.get(id)||true;
 newestSubmission.set(id,order);
 const pending=readOutbox();
 pending[id]={userId,key,value,remove,revision:crypto.randomUUID()};
 try{writeOutbox(pending)}catch{announce("Storage unavailable · changes not queued");return false;}
 if(!navigator.onLine){announce("Saved on device · offline");return false;}
 return drain(id);
}
export async function saveCloudData<T>(key:MucipesStorageKey,value:T):Promise<boolean>{return enqueue(key,value,false)}
export async function deleteCloudData(key:MucipesStorageKey):Promise<boolean>{return enqueue(key,undefined,true)}
export async function loadCloudData<T>(key:MucipesStorageKey):Promise<T|null>{
 try{const userId=await getUserId();if(userId){const queued=readOutbox()[JSON.stringify([userId,key])];if(queued)return queued.remove?null:queued.value as T;}}catch{}
 return rawLoadCloudData<T>(key);
}
export async function retryCloudSync(){
 let userId:string|null=null;try{userId=await getUserId()}catch{return;}
 if(!userId){announce("Saved on device · sign in to sync");return;}
 const pending=readOutbox();await Promise.all(Object.entries(pending).filter(([,v])=>v.userId===userId).map(([id])=>drain(id)));
}
