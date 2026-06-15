"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Modal from "@/components/ui/Modal";
import { useNotifications } from "@/lib/notifications-context";
import { Notification, NotificationCategory } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";
import { Bell, Package, CalendarRange, ShoppingCart, Settings, CheckCheck, Circle } from "lucide-react";

const FILTERS = ["All", "Unread", "Order", "Inventory", "Event", "System"] as const;
type Filter = typeof FILTERS[number];

function categoryIcon(cat: NotificationCategory) {
  if (cat === "Order")     return <ShoppingCart size={16} className="text-orange-500 shrink-0" />;
  if (cat === "Inventory") return <Package       size={16} className="text-red-500 shrink-0" />;
  if (cat === "Event")     return <CalendarRange size={16} className="text-green-500 shrink-0" />;
  return                          <Settings      size={16} className="text-blue-500 shrink-0" />;
}

function categoryBg(cat: NotificationCategory) {
  if (cat === "Order")     return "bg-orange-50";
  if (cat === "Inventory") return "bg-red-50";
  if (cat === "Event")     return "bg-green-50";
  return "bg-blue-50";
}

function categoryPill(cat: NotificationCategory) {
  if (cat === "Order")     return "bg-orange-100 text-orange-700";
  if (cat === "Inventory") return "bg-red-100 text-red-700";
  if (cat === "Event")     return "bg-green-100 text-green-700";
  return "bg-blue-100 text-blue-700";
}

export default function NotificationsPage() {
  const { notifs, unreadCount, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<Notification | null>(null);

  const filtered = notifs.filter((n) => {
    if (filter === "All")    return true;
    if (filter === "Unread") return !n.read;
    return n.category === filter;
  });

  function handleClick(n: Notification) {
    markRead(n.id);
    setSelected(n);
  }

  function filterCount(f: Filter) {
    if (f === "All")    return notifs.length;
    if (f === "Unread") return unreadCount;
    return notifs.filter((n) => n.category === f).length;
  }

  return (
    <DashboardLayout title="Notifications">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{notifs.length} total notifications</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <CheckCheck size={15} /> Mark All Read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                filter === f
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f}
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${filter === f ? "bg-primary-400" : "bg-gray-100 text-gray-500"}`}>
                {filterCount(f)}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
              <Bell size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No notifications here.</p>
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  n.read
                    ? "bg-white border-gray-100 hover:bg-gray-50"
                    : "bg-primary-50/40 border-primary-100 hover:bg-primary-50"
                }`}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${categoryBg(n.category)} shrink-0 mt-0.5`}>
                  {categoryIcon(n.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${n.read ? "text-gray-600" : "text-gray-900"}`}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {!n.read && <Circle size={8} className="text-primary-500 fill-primary-500" />}
                      <span className="text-xs text-gray-400 whitespace-nowrap">{formatDateTime(n.date)}</span>
                    </div>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${n.read ? "text-gray-400" : "text-gray-500"}`}>
                    {n.message}
                  </p>
                  <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryPill(n.category)}`}>
                    {n.category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail popup */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title ?? ""} size="sm">
        {selected && (
          <div className="space-y-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${categoryBg(selected.category)}`}>
              {categoryIcon(selected.category)}
            </div>
            <div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryPill(selected.category)}`}>
                {selected.category}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
            <p className="text-xs text-gray-400">{formatDateTime(selected.date)}</p>
            <button
              onClick={() => setSelected(null)}
              className="w-full py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
