"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  CalendarRange,
  Package,
  Users,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChefHat,
} from "lucide-react";
import { useState } from "react";
import { useNotifications } from "@/lib/notifications-context";

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Menu", href: "/menu", icon: UtensilsCrossed },
  { label: "Events", href: "/events", icon: CalendarRange },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Staff", href: "/staff", icon: Users },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      } min-h-screen shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 shrink-0">
          <ChefHat className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 leading-none">Outback Table Co.</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Catering Operations</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group ${
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"}`} size={18} />
              {!collapsed && <span className="truncate">{label}</span>}
              {label === "Notifications" && unreadCount > 0 && (
                <span className={`ml-auto flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none ${collapsed ? "absolute top-1.5 right-1.5 w-4 h-4" : "w-5 h-5"}`}>
                  {unreadCount}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
