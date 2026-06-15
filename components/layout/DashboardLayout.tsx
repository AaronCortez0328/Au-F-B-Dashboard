"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import DemoBanner from "./DemoBanner";

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const [branch, setBranch] = useState("All Branches");
  const [range, setRange] = useState("This Month");

  return (
    <div className="flex min-h-screen bg-[#F5F0E6]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={title}
          selectedBranch={branch}
          onBranchChange={setBranch}
          selectedRange={range}
          onRangeChange={setRange}
        />
        <DemoBanner branch={branch} range={range} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <div className="fixed bottom-4 left-4 z-50 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2 shadow-sm">
          <p className="text-xs font-semibold text-primary-800">🍖 Demo Mode</p>
          <p className="text-[10px] text-primary-700">Anonymized operational data only.</p>
        </div>
      </div>
    </div>
  );
}
