"use client";
import {useEffect,useState} from "react";
import {retryCloudSync} from "@/lib/supabase/storage";
export default function SyncStatus(){
 const [status,setStatus]=useState("Saved on device");
 useEffect(()=>{const update=(e:Event)=>setStatus((e as CustomEvent<string>).detail);const retry=()=>{void retryCloudSync()};window.addEventListener("cyg-sync-status",update);window.addEventListener("online",retry);retry();return()=>{window.removeEventListener("cyg-sync-status",update);window.removeEventListener("online",retry)}},[]);
 return <div role="status" className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-2 text-xs text-slate-500"><span>{status}</span>{/pending|offline|unavailable/.test(status)&&<button className="font-bold text-blue-700" onClick={()=>void retryCloudSync()}>Retry sync</button>}</div>;
}
