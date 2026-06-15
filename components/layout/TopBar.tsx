"use client";

import { Search, Globe, Calendar, ChevronDown, Bell, User } from "lucide-react";
import { useState } from "react";
import { branches } from "@/lib/data";

const dateRanges = ["Today", "This Week", "This Month", "Last Month", "Last 3 Months", "This Year"];

interface TopBarProps {
  title: string;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export default function TopBar({ title, selectedBranch, onBranchChange, selectedRange, onRangeChange }: TopBarProps) {
  const [branchOpen, setBranchOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <header className="flex items-center gap-4 px-6 py-3.5 bg-white border-b border-gray-200 sticky top-0 z-20">
      <h1 className="text-lg font-bold text-gray-900 shrink-0 mr-2">{title}</h1>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders, events, items..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Branch selector */}
        <div className="relative">
          <button
            onClick={() => { setBranchOpen(!branchOpen); setRangeOpen(false); }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Globe size={14} className="text-primary-500" />
            <span>{selectedBranch}</span>
            <ChevronDown size={13} className="text-gray-400" />
          </button>
          {branchOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 max-h-72 overflow-y-auto scrollbar-thin">
              {branches.map((b) => (
                <button
                  key={b}
                  onClick={() => { onBranchChange(b); setBranchOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${selectedBranch === b ? "bg-primary-50 text-primary-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date range */}
        <div className="relative">
          <button
            onClick={() => { setRangeOpen(!rangeOpen); setBranchOpen(false); }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar size={14} className="text-primary-500" />
            <span>{selectedRange}</span>
            <ChevronDown size={13} className="text-gray-400" />
          </button>
          {rangeOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1">
              {dateRanges.map((r) => (
                <button
                  key={r}
                  onClick={() => { onRangeChange(r); setRangeOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${selectedRange === r ? "bg-primary-50 text-primary-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold">
            N
          </button>
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(branchOpen || rangeOpen) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => { setBranchOpen(false); setRangeOpen(false); }}
        />
      )}
    </header>
  );
}
