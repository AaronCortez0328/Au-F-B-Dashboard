"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  orders as init_orders, menuItems as init_menu,
  cateringEvents as init_events, inventoryItems as init_inv,
  staffMembers as init_staff,
  Order, MenuItem, CateringEvent, InventoryItem, StaffMember,
  OrderStatus, OrderType, MenuStatus, EventStatus, InventoryStatus, StaffStatus,
} from "./data";

export type StarredOrder = Order & { starred: boolean };

function calcInvStatus(inStock: number, minLevel: number): InventoryStatus {
  if (inStock === 0) return "Out";
  if (inStock < minLevel) return "Critical";
  if (inStock < minLevel * 1.5) return "Low";
  return "OK";
}

function newRef(prefix: string) {
  return `${prefix}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
}

interface DataCtx {
  orders: StarredOrder[];
  addOrder: (o: Partial<StarredOrder>) => void;
  updateOrder: (id: string, updates: Partial<StarredOrder>) => void;

  menuItems: MenuItem[];
  addMenuItem: (m: Partial<MenuItem>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;

  cateringEvents: CateringEvent[];
  addEvent: (e: Partial<CateringEvent>) => void;
  updateEvent: (id: string, updates: Partial<CateringEvent>) => void;

  inventoryItems: InventoryItem[];
  addInventoryItem: (i: Partial<InventoryItem>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  reorderItem: (id: string) => void;
  bulkReorder: () => void;

  staffMembers: StaffMember[];
  addStaffMember: (s: Partial<StaffMember>) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;
}

const DataContext = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<StarredOrder[]>(
    init_orders.map(o => ({ ...o, starred: false }))
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>(init_menu);
  const [cateringEvents, setCateringEvents] = useState<CateringEvent[]>(init_events);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(init_inv);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(init_staff);

  /* ── Orders ── */
  function addOrder(o: Partial<StarredOrder>) {
    const today = new Date().toISOString().split("T")[0];
    setOrders(prev => [{
      id: `o${Date.now()}`,
      reference: newRef("SP"),
      customer: o.customer ?? "",
      venue: o.venue ?? "",
      branch: o.branch ?? "",
      date: today,
      items: o.items ?? [],
      total: o.total ?? 0,
      status: (o.status ?? "Pending") as OrderStatus,
      type: (o.type ?? "Catering") as OrderType,
      notes: o.notes,
      starred: false,
    }, ...prev]);
  }
  function updateOrder(id: string, updates: Partial<StarredOrder>) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  }

  /* ── Menu ── */
  function addMenuItem(m: Partial<MenuItem>) {
    setMenuItems(prev => [{
      id: `m${Date.now()}`,
      name: m.name ?? "",
      category: m.category ?? "Mains",
      price: Number(m.price ?? 0),
      status: (m.status ?? "Available") as MenuStatus,
      ordersThisMonth: 0,
      description: m.description ?? "",
      dietary: m.dietary ?? [],
    }, ...prev]);
  }
  function updateMenuItem(id: string, updates: Partial<MenuItem>) {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }

  /* ── Events ── */
  function addEvent(e: Partial<CateringEvent>) {
    setCateringEvents(prev => [{
      id: `ev${Date.now()}`,
      reference: newRef("EV"),
      client: e.client ?? "",
      venue: e.venue ?? "",
      date: e.date ?? "",
      headcount: Number(e.headcount ?? 0),
      dietary: e.dietary ?? "",
      package: e.package ?? "Corporate Lunch",
      status: (e.status ?? "Upcoming") as EventStatus,
      assignedStaff: e.assignedStaff ?? [],
      specialRequests: e.specialRequests,
      branch: e.branch ?? "",
    }, ...prev]);
  }
  function updateEvent(id: string, updates: Partial<CateringEvent>) {
    setCateringEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }

  /* ── Inventory ── */
  function addInventoryItem(i: Partial<InventoryItem>) {
    const inStock = Number(i.inStock ?? 0);
    const minLevel = Number(i.minLevel ?? 0);
    setInventoryItems(prev => [{
      id: `inv${Date.now()}`,
      name: i.name ?? "",
      category: i.category ?? "Proteins",
      unit: i.unit ?? "kg",
      inStock,
      minLevel,
      status: calcInvStatus(inStock, minLevel),
      supplier: i.supplier ?? "",
      lastUpdated: new Date().toISOString().split("T")[0],
    }, ...prev]);
  }
  function updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
    setInventoryItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const merged = { ...i, ...updates, lastUpdated: new Date().toISOString().split("T")[0] };
      merged.status = calcInvStatus(merged.inStock, merged.minLevel);
      return merged;
    }));
  }
  function reorderItem(id: string) {
    setInventoryItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newStock = Math.ceil(i.minLevel * 3);
      return { ...i, inStock: newStock, status: "OK" as InventoryStatus, lastUpdated: new Date().toISOString().split("T")[0] };
    }));
  }
  function bulkReorder() {
    setInventoryItems(prev => prev.map(i => {
      if (i.status === "OK") return i;
      const newStock = Math.ceil(i.minLevel * 3);
      return { ...i, inStock: newStock, status: "OK" as InventoryStatus, lastUpdated: new Date().toISOString().split("T")[0] };
    }));
  }

  /* ── Staff ── */
  function addStaffMember(s: Partial<StaffMember>) {
    const count = staffMembers.length + 1;
    setStaffMembers(prev => [{
      id: `s${count}`,
      name: s.name ?? "",
      role: s.role ?? "Chef",
      branch: s.branch ?? "",
      shift: s.shift ?? "",
      status: (s.status ?? "On Duty") as StaffStatus,
      assignedEvent: s.assignedEvent,
      phone: s.phone ?? "",
      email: s.email ?? "",
    }, ...prev]);
  }
  function updateStaffMember(id: string, updates: Partial<StaffMember>) {
    setStaffMembers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }

  return (
    <DataContext.Provider value={{
      orders, addOrder, updateOrder,
      menuItems, addMenuItem, updateMenuItem,
      cateringEvents, addEvent, updateEvent,
      inventoryItems, addInventoryItem, updateInventoryItem, reorderItem, bulkReorder,
      staffMembers, addStaffMember, updateStaffMember,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
}
