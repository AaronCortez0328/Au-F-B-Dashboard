"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { useData } from "@/lib/data-context";
import { useToast } from "@/lib/toast-context";
import { InventoryItem } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Search, Plus, Pencil, AlertTriangle, RefreshCw, X } from "lucide-react";

const CATEGORIES = ["All", "Proteins", "Produce", "Dairy", "Dry Goods", "Beverages", "Packaging"];
const UNITS = ["kg", "L", "each", "bottle", "can", "bag", "box", "pack", "carton", "bunch", "roll", "jug", "case"];
const PER_PAGE = 12;

export default function InventoryPage() {
  const { inventoryItems, addInventoryItem, updateInventoryItem, reorderItem, bulkReorder } = useData();
  const { toast } = useToast();

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const [editForm, setEditForm] = useState({ inStock: "", minLevel: "", supplier: "" });
  const [addForm, setAddForm] = useState({ name: "", category: "Proteins", unit: "kg", inStock: "", minLevel: "", supplier: "" });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return inventoryItems.filter(i => (category === "All" || i.category === category) && (!q || i.name.toLowerCase().includes(q) || i.supplier.toLowerCase().includes(q)));
  }, [inventoryItems, category, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const criticalItems = inventoryItems.filter(i => i.status === "Critical" || i.status === "Out");

  function openEdit(item: InventoryItem) {
    setEditItem(item);
    setEditForm({ inStock: String(item.inStock), minLevel: String(item.minLevel), supplier: item.supplier });
  }

  function saveEdit() {
    if (!editItem) return;
    updateInventoryItem(editItem.id, { inStock: Number(editForm.inStock), minLevel: Number(editForm.minLevel), supplier: editForm.supplier });
    setEditItem(null);
    toast(`"${editItem.name}" updated`);
  }

  function handleReorder(item: InventoryItem) {
    reorderItem(item.id);
    toast(`Reorder placed for "${item.name}" — restocked to ${item.minLevel * 3} ${item.unit}`);
  }

  function handleBulkReorder() {
    bulkReorder();
    toast(`Bulk reorder placed for ${criticalItems.length} item${criticalItems.length > 1 ? "s" : ""}`);
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    addInventoryItem({ ...addForm, inStock: Number(addForm.inStock), minLevel: Number(addForm.minLevel) });
    setAddOpen(false);
    setAddForm({ name: "", category: "Proteins", unit: "kg", inStock: "", minLevel: "", supplier: "" });
    toast("Inventory item added");
  }

  function rowBg(status: string) {
    if (status === "Critical" || status === "Out") return "bg-red-50 hover:bg-red-100";
    if (status === "Low") return "bg-yellow-50 hover:bg-yellow-100";
    return "hover:bg-gray-50";
  }

  return (
    <DashboardLayout title="Inventory">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div><h2 className="text-xl font-bold text-gray-900">Inventory</h2><p className="text-sm text-gray-500 mt-0.5">{filtered.length} items</p></div>
          <div className="flex gap-2">
            <button onClick={handleBulkReorder} disabled={criticalItems.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <RefreshCw size={15} /> Bulk Reorder{criticalItems.length > 0 && ` (${criticalItems.length})`}
            </button>
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-sm">
              <Plus size={16} /> Add Item
            </button>
          </div>
        </div>

        {criticalItems.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">{criticalItems.length} item{criticalItems.length > 1 ? "s" : ""} need immediate attention</p>
              <p className="text-xs text-red-600 mt-0.5">{criticalItems.map(i => i.name).join(" · ")}</p>
            </div>
            <button onClick={handleBulkReorder} className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shrink-0">
              Reorder All
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => { setCategory(c); setPage(1); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-xl border transition-colors ${category === c ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>{c}</button>
            ))}
          </div>
          <div className="relative ml-auto min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search items or supplier…"
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-300" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={13} /></button>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-200">
                {["Item", "Category", "Unit", "In Stock", "Min Level", "Status", "Supplier", "Last Updated", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-16 text-gray-400 text-sm">No items found.</td></tr>
                ) : paginated.map(item => (
                  <tr key={item.id} className={`transition-colors ${rowBg(item.status)}`}>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{item.category}</span></td>
                    <td className="px-4 py-3 text-gray-600">{item.unit}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: item.status === "Critical" || item.status === "Out" ? "#dc2626" : item.status === "Low" ? "#b45309" : "#374151" }}>{item.inStock}</td>
                    <td className="px-4 py-3 text-gray-500">{item.minLevel}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{item.supplier}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(item.lastUpdated)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(item)} title="Edit" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Pencil size={14} /></button>
                        {item.status !== "OK" && (
                          <button onClick={() => handleReorder(item)} title="Reorder" className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"><RefreshCw size={14} /></button>
                        )}
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

      {/* Edit */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title={`Edit: ${editItem?.name}`} size="md">
        {editItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">In Stock ({editItem.unit})</label>
                <input type="number" min="0" value={editForm.inStock} onChange={e => setEditForm({ ...editForm, inStock: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Min Level ({editItem.unit})</label>
                <input type="number" min="0" value={editForm.minLevel} onChange={e => setEditForm({ ...editForm, minLevel: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            </div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Supplier</label>
              <input value={editForm.supplier} onChange={e => setEditForm({ ...editForm, supplier: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            <p className="text-xs text-gray-400">Status will be recalculated automatically based on stock level vs minimum.</p>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setEditItem(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Inventory Item" size="md">
        <form onSubmit={submitAdd} className="space-y-4">
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Item Name</label>
            <input required value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g. Chicken Thigh Fillets" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select value={addForm.category} onChange={e => setAddForm({ ...addForm, category: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
              <select value={addForm.unit} onChange={e => setAddForm({ ...addForm, unit: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">In Stock</label>
              <input required type="number" min="0" value={addForm.inStock} onChange={e => setAddForm({ ...addForm, inStock: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Min Level</label>
              <input required type="number" min="0" value={addForm.minLevel} onChange={e => setAddForm({ ...addForm, minLevel: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          </div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Supplier</label>
            <input required value={addForm.supplier} onChange={e => setAddForm({ ...addForm, supplier: e.target.value })} placeholder="e.g. Ingham's Poultry" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setAddOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600">Add Item</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
