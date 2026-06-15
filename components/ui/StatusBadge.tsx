import { getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${getStatusColor(status)} ${size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"}`}>
      {status}
    </span>
  );
}
