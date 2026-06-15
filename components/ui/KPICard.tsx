import { TrendingUp, TrendingDown } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  prevValue?: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export default function KPICard({ title, value, trend, prevValue, icon: Icon, iconBg = "bg-primary-50", iconColor = "text-primary-600" }: KPICardProps) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconBg}`}>
          <Icon className={iconColor} size={20} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full ${isPositive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"}`}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{title}</p>
      {prevValue && (
        <p className="text-xs text-gray-400 mt-1">vs. prev. period ({prevValue})</p>
      )}
    </div>
  );
}
