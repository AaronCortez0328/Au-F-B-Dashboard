"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { useData, StarredOrder } from "@/lib/data-context";
import { useToast } from "@/lib/toast-context";
import { OrderStatus, OrderType } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import LiveBadge from "@/components/ui/LiveBadge";
import { useGHL } from "@/lib/hooks/use-ghl";
import { Search, Eye, Pencil, ArrowLeftRight, Star, Plus, X } from "lucide-react";

const STATUSES: OrderStatus[] = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
const TYPES: OrderType[] = ["Dine-In", "Catering", "Takeaway", "Online"];
const PER_PAGE = 10;

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  "Pending": "Confirmed",
  "Confirmed": "Preparing",
  "Preparing": "Out for Delivery",
  "Out for Delivery": "Delivered",
  "Delivered": null,
  "Cancelled": null,
};

export default function OrdersPage() {
  const { orders: localOrders, addOrder, updateOrder } = useData();
  const { toast } = useToast();
  const { data: ghlOrders, loading: ghlLoading, error: ghlError, lastUpdated, refetch } = useGHL<any[]>("/api/ghl/opportunities");

  // GHL opportunities are the source of truth; locally added orders are appended
  const orders: StarredOrder[] = useMemo(() => {
    const ghl = (ghlOrders ?? []).map((o: any) => ({ ...o, items: o.items ?? [], starred: o.starred ?? false } as StarredOrder));
    const localOnly = localOrders.filter(o => !(o as any).source);
    return [...ghl, ...localOnly];
  }, [ghlOrders, localOrders]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<OrderType | "All">("All");
  const [page, setPage] = useState(1);

  const [viewOrder, setViewOrder] = useState<StarredOrder | null>(null);
  const [editOrder, setEditOrder] = useState<StarredOrder | null>(null);
  const [convertOrder, setConvertOrder] = useState<StarredOrder | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const [addForm, setAddForm] = useState({ customer: "", venue: "", branch: "", type: "Catering" as OrderType, notes: "" });
  const [editForm, setEditForm] = useState({ status: "" as OrderStatus, notes: "", venue: "", customer: "" });
  const [convertType, setConvertType] = useState<OrderType>("Catering");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(o => {
      const matchSearch = !q || o.reference.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.venue.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      const matchType = typeFilter === "All" || o.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [orders, search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const statusCounts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {} as Record<string, number>);

  function openEdit(o: StarredOrder) {
    setEditOrder(o);
    setEditForm({ status: o.status, notes: o.notes ?? "", venue: o.venue, customer: o.customer });
  }

  function saveEdit() {
    if (!editOrder) return;
    updateOrder(editOrder.id, { status: editForm.status as OrderStatus, notes: editForm.notes, venue: editForm.venue, customer: editForm.customer });
    setEditOrder(null);
    toast("Order updated successfully");
  }

  function saveConvert() {
    if (!convertOrder) return;
    updateOrder(convertOrder.id, { type: convertType });
    setConvertOrder(null);
    toast(`Order converted to ${convertType}`);
  }

  function toggleStar(o: StarredOrder) {
    updateOrder(o.id, { starred: !o.starred });
    toast(o.starred ? "Removed from starred" : "Order starred", "info");
  }

  function advanceStatus(o: StarredOrder) {
    const next = STATUS_FLOW[o.status];
    if (!next) return;
    updateOrder(o.id, { status: next });
    toast(`Status updated to "${next}"`);
    if (viewOrder?.id === o.id) setViewOrder({ ...o, status: next });
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    addOrder({ customer: addForm.customer, venue: addForm.venue, branch: addForm.branch, type: addForm.type, notes: addForm.notes, status: "Pending" });
    setAddOpen(false);
    setAddForm({ customer: "", venue: "", branch: "", type: "Catering", notes: "" });
    toast("New order created");
  }

  return (
    <DashboardLayout title="Orders">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Orders &amp; Opportunities</h2>
            <p className="text-sm text-gray-500 mt-0.5">{filtered.length} total records</p>
          </div>
          <div className="flex items-center gap-3">
            <LiveBadge lastUpdated={lastUpdated} loading={ghlLoading} error={ghlError} onRefresh={refetch} />
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-sm">
              <Plus size={16} /> Add Order
            </button>
          </div>
        </div>

        {/* Status KPI row */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatusFilter(s === statusFilter ? "All" : s); setPage(1); }}
              className={`rounded-xl border p-3 text-center transition-all ${statusFilter === s ? "border-primary-400 bg-primary-50 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300"}`}>
              <p className="text-lg font-bold text-gray-900">{statusCounts[s]}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{s}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by reference, customer, venue…"
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" />
              {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={13} /></button>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["All", ...STATUSES] as const).map(s => (
                <button key={s} onClick={() => { setStatusFilter(s as OrderStatus | "All"); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${(statusFilter === s || (s === "All" && statusFilter === "All")) ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["All", ...TYPES] as const).map(t => (
                <button key={t} onClick={() => { setTypeFilter(t as OrderType | "All"); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${(typeFilter === t || (t === "All" && typeFilter === "All")) ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Reference", "Customer", "Venue / Branch", "Date", "Type", "Total (AUD)", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-16 text-gray-400 text-sm">No orders found.</td></tr>
                ) : paginated.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary-600 flex items-center gap-1">
                      {o.starred && <Star size={12} className="text-yellow-500 fill-yellow-400" />}
                      {o.reference}
                    </td>
                    <td className="px-4 py-3 text-gray-800">{o.customer}</td>
                    <td className="px-4 py-3"><p className="text-gray-800">{o.venue}</p><p className="text-xs text-gray-400">{o.branch}</p></td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(o.date)}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{o.type}</span></td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{formatCurrency(o.total)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                      {(o as any).stageName && <p className="text-[10px] text-gray-400 mt-0.5">{(o as any).stageName}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setViewOrder(o)} title="View details" className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Eye size={14} /></button>
                        <button onClick={() => openEdit(o)} title="Edit order" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => { setConvertOrder(o); setConvertType(o.type); }} title="Convert type" className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"><ArrowLeftRight size={14} /></button>
                        <button onClick={() => toggleStar(o)} title={o.starred ? "Unstar" : "Star"} className={`p-1.5 rounded-lg transition-colors ${o.starred ? "text-yellow-500 bg-yellow-50" : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"}`}>
                          <Star size={14} className={o.starred ? "fill-yellow-400" : ""} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} perPage={PER_PAGE} />
        </div>
      </div>

      {/* ── View Modal ── */}
      <Modal open={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order ${viewOrder?.reference}`} size="lg">
        {viewOrder && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[["Customer", viewOrder.customer], ["Venue", viewOrder.venue], ["Branch", viewOrder.branch], ["Date", formatDate(viewOrder.date)], ["Type", viewOrder.type]].map(([l, v]) => (
                <div key={l}><p className="text-xs text-gray-400 uppercase tracking-wide">{l}</p><p className="font-medium text-gray-800 mt-1">{v}</p></div>
              ))}
              <div><p className="text-xs text-gray-400 uppercase tracking-wide">Status</p><div className="mt-1"><StatusBadge status={viewOrder.status} /></div></div>
            </div>
            {viewOrder.items.length > 0 ? (
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    {["Item", "Qty", "Unit Price", "Subtotal"].map(h => <th key={h} className={`px-4 py-2 text-xs text-gray-500 ${h !== "Item" ? "text-right" : "text-left"}`}>{h}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {viewOrder.items.map((item, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2.5 text-gray-800">{item.name}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600">{item.qty}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-2.5 text-right font-medium text-gray-800">{formatCurrency(item.qty * item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot><tr className="bg-primary-50 border-t border-primary-100">
                    <td colSpan={3} className="px-4 py-2.5 text-sm font-semibold text-gray-700">Total</td>
                    <td className="px-4 py-2.5 text-right text-sm font-bold text-primary-700">{formatCurrency(viewOrder.total)}</td>
                  </tr></tfoot>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-sm text-gray-500">Pipeline value</span>
                <span className="font-bold text-primary-700">{formatCurrency(viewOrder.total)}</span>
              </div>
            )}
            {viewOrder.notes && <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Notes</p><p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 rounded-lg p-3">{viewOrder.notes}</p></div>}
            {/* Advance status */}
            {STATUS_FLOW[viewOrder.status] && (
              <button onClick={() => advanceStatus(viewOrder)}
                className="w-full py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
                Mark as {STATUS_FLOW[viewOrder.status]} →
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal open={!!editOrder} onClose={() => setEditOrder(null)} title={`Edit Order ${editOrder?.reference}`} size="md">
        {editOrder && (
          <div className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Customer Name</label>
              <input value={editForm.customer} onChange={e => setEditForm({ ...editForm, customer: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Venue</label>
              <input value={editForm.venue} onChange={e => setEditForm({ ...editForm, venue: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value as OrderStatus })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" /></div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setEditOrder(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Convert Modal ── */}
      <Modal open={!!convertOrder} onClose={() => setConvertOrder(null)} title="Convert Order Type" size="sm">
        {convertOrder && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Change order <strong>{convertOrder.reference}</strong> from <strong>{convertOrder.type}</strong> to:</p>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(t => (
                <button key={t} onClick={() => setConvertType(t)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${convertType === t ? "bg-primary-500 text-white border-primary-500" : "bg-white border-gray-200 text-gray-700 hover:border-primary-300"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setConvertOrder(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={saveConvert} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600">Convert</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Add Modal ── */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Order" size="md">
        <form onSubmit={submitAdd} className="space-y-4">
          {([["Customer Name", "customer", "e.g. Lachlan Morrison"], ["Venue", "venue", "e.g. Sydney Convention Centre"], ["Branch", "branch", "e.g. Sydney CBD"]] as const).map(([label, key, placeholder]) => (
            <div key={key}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <input required value={addForm[key]} onChange={e => setAddForm({ ...addForm, [key]: e.target.value })} placeholder={placeholder}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          ))}
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Order Type</label>
            <select value={addForm.type} onChange={e => setAddForm({ ...addForm, type: e.target.value as OrderType })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea value={addForm.notes} onChange={e => setAddForm({ ...addForm, notes: e.target.value })} rows={3} placeholder="Dietary requirements, special requests…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" /></div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setAddOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600">Create Order</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
