"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem { id: number; msg: string; type: ToastType; }
interface ToastCtx { toast: (msg: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  function toast(msg: string, type: ToastType = "success") {
    const id = Date.now();
    setItems(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 3200);
  }

  const Icon = { success: CheckCircle, error: XCircle, info: Info };
  const bg = { success: "bg-gray-900", error: "bg-red-600", info: "bg-primary-600" };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {items.map(t => {
          const I = Icon[t.type];
          return (
            <div key={t.id} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white ${bg[t.type]} pointer-events-auto animate-in`}>
              <I size={16} className="shrink-0" />
              {t.msg}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
