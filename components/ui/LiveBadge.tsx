"use client";

import { RefreshCw, Wifi, WifiOff } from "lucide-react";

interface Props {
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function LiveBadge({ lastUpdated, loading, error, onRefresh }: Props) {
  const time = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
        <WifiOff size={12} />
        <span>GHL offline — showing cached data</span>
        <button onClick={onRefresh} className="underline hover:no-underline ml-1">Retry</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <Wifi size={12} />
      <span>Live from GHL{time ? ` · ${time}` : ""}</span>
      <button onClick={onRefresh} disabled={loading} className="ml-1 text-green-600 hover:text-green-800 disabled:opacity-40">
        <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
      </button>
    </div>
  );
}
