"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { notifications as initial, Notification } from "./data";

interface NotificationsContextValue {
  notifs: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifs, setNotifs] = useState<Notification[]>(initial);

  const unreadCount = notifs.filter((n) => !n.read).length;

  function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <NotificationsContext.Provider value={{ notifs, unreadCount, markRead, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
}
