"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}
