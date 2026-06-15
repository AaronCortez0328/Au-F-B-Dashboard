"use client";

import { DataProvider } from "@/lib/data-context";
import { NotificationsProvider } from "@/lib/notifications-context";
import { ToastProvider } from "@/lib/toast-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <NotificationsProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </NotificationsProvider>
    </DataProvider>
  );
}
