"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import KPICard from "@/components/ui/KPICard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useData } from "@/lib/data-context";
import { trendData } from "@/lib/data";
import {
  ShoppingCart, DollarSign, CalendarRange, Clock, UtensilsCrossed,
  Users, TrendingUp, Star, AlertTriangle, ArrowRight
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer
} from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function OverviewPage() {
  const { orders, cateringEvents, menuItems, inventoryItems, staffMembers } = useData();

  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const upcomingEvents = cateringEvents.filter(e => e.status === "Upcoming").slice(0, 3);
  const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const activeEvents = cateringEvents.filter(e => e.status === "Upcoming" || e.status === "In Progress").length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const onDutyCount = staffMembers.filter(s => s.status === "On Duty").length;
  const avgOrderValue = totalRevenue / Math.max(orders.filter(o => o.status !== "Cancelled").length, 1);
  const criticalStock = inventoryItems.filter(i => i.status === "Critical" || i.status === "Out");

  const topMenuItems = [...menuItems]
    .sort((a, b) => b.ordersThisMonth - a.ordersThisMonth)
    .slice(0, 6)
    .map(m => ({ name: m.name.length > 22 ? m.name.slice(0, 22) + "…" : m.name, orders: m.ordersThisMonth }));

  return (
    <DashboardLayout title="Overview Dashboard">
      <div className="p-6 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Total Orders" value={orders.length} trend={-6} prevValue="27" icon={ShoppingCart} />
          <KPICard title="Revenue (AUD)" value={formatCurrency(totalRevenue)} trend={12} prevValue="$18.4k" icon={DollarSign} iconBg="bg-green-50" iconColor="text-green-600" />
          <KPICard title="Active Catering Events" value={activeEvents} trend={40} prevValue="10" icon={CalendarRange} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <KPICard title="Pending Orders" value={pendingOrders} trend={-25} prevValue="4" icon={Clock} iconBg="bg-yellow-50" iconColor="text-yellow-600" />
          <KPICard title="Menu Items" value={menuItems.filter(m => m.status === "Available").length} trend={5} prevValue="28" icon={UtensilsCrossed} iconBg="bg-accent-50" iconColor="text-accent-600" />
          <KPICard title="Staff On Duty" value={onDutyCount} trend={17} prevValue="12" icon={Users} iconBg="bg-purple-50" iconColor="text-purple-600" />
          <KPICard title="Avg Order Value" value={formatCurrency(avgOrderValue)} trend={8} prevValue="$188" icon={TrendingUp} iconBg="bg-teal-50" iconColor="text-teal-600" />
          <KPICard title="Customer Rating" value="4.8 ★" trend={2} prevValue="4.7" icon={Star} iconBg="bg-orange-50" iconColor="text-orange-500" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Order &amp; Revenue Trend (12 Months)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={v => `$${(Number(v) / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value, name) => name === "revenue" ? formatCurrency(Number(value)) : value} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#C07820" strokeWidth={2} dot={false} name="Orders" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#8B5E1A" strokeWidth={2} dot={false} name="Revenue (AUD)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Top Menu Items (This Month)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topMenuItems} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10, fill: "#6b7280" }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#C07820" radius={[0, 4, 4, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Orders */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Recent Orders</h2>
              <Link href="/orders" className="text-xs text-primary-600 hover:underline flex items-center gap-0.5">View All <ArrowRight size={11} /></Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div><p className="text-xs font-medium text-gray-800">{o.reference}</p><p className="text-[11px] text-gray-400">{o.customer}</p></div>
                  <div className="text-right"><StatusBadge status={o.status} size="sm" /><p className="text-[11px] text-gray-400 mt-0.5">{formatCurrency(o.total)}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Upcoming Events</h2>
              <Link href="/events" className="text-xs text-primary-600 hover:underline flex items-center gap-0.5">View All <ArrowRight size={11} /></Link>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map(ev => (
                <div key={ev.id} className="p-3 rounded-lg border border-gray-100 hover:border-primary-200 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div><p className="text-xs font-semibold text-gray-800">{ev.client}</p><p className="text-[11px] text-gray-400 mt-0.5">{ev.venue}</p></div>
                    <span className="text-[10px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium shrink-0">{ev.headcount} guests</span>
                  </div>
                  <p className="text-[11px] text-accent-600 font-medium mt-1.5">{formatDate(ev.date)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Alerts */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-red-500" /> Urgent Alerts
              </h2>
              <Link href="/inventory" className="text-xs text-primary-600 hover:underline flex items-center gap-0.5">View All <ArrowRight size={11} /></Link>
            </div>
            <div className="space-y-2.5">
              {criticalStock.length === 0 ? (
                <p className="text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">All inventory levels are OK.</p>
              ) : criticalStock.slice(0, 5).map(item => (
                <div key={item.id} className={`p-2.5 rounded-lg border ${item.status === "Out" ? "bg-red-50 border-red-100" : "bg-yellow-50 border-yellow-100"}`}>
                  <p className={`text-xs font-medium ${item.status === "Out" ? "text-red-800" : "text-yellow-800"}`}>
                    {item.name} — {item.status === "Out" ? "OUT OF STOCK" : `${item.inStock}${item.unit} / ${item.minLevel}${item.unit} min`}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${item.status === "Out" ? "text-red-600" : "text-yellow-600"}`}>Supplier: {item.supplier}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
