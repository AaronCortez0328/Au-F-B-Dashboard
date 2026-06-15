"use client";

import { Globe } from "lucide-react";

interface DemoBannerProps {
  branch: string;
  range: string;
}

export default function DemoBanner({ branch, range }: DemoBannerProps) {
  return (
    <div className="flex items-center justify-between px-6 py-2 bg-primary-50 border-b border-primary-100 text-xs">
      <div className="flex items-center gap-1.5 text-primary-700 font-medium">
        <Globe size={13} />
        <span>
          Viewing: <strong>{branch === "All Branches" ? "All Outback Table Co. Locations Nationwide" : branch}</strong>
          {" · "}
          <strong>{range}</strong>
        </span>
      </div>
      <span className="text-primary-600 italic">This dashboard uses anonymized operational data only.</span>
    </div>
  );
}
