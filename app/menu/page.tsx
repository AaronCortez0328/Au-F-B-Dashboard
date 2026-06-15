"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { useData } from "@/lib/data-context";
import { useToast } from "@/lib/toast-context";
import { MenuItem, MenuStatus } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Search, Plus, Eye, Pencil, LayoutGrid, List, X, ToggleLeft, ToggleRight } from "lucide-react";

const CATEGORIES = ["All", "Appetizers", "Mains", "Desserts", "Beverages", "Platters"];
const DIETARY_TAGS = ["GF", "V", "VE", "DF", "H"];
const STATUSES: MenuStatus[] = ["Available", "Unavailable", "Seasonal"];
const PER_PAGE = 12;

const blankForm = { name: "", category: "Mains", price: "", description: "", dietary: [] as string[], status: "Available" as MenuStatus };

export default function MenuPage() {
  const { menuItems, addMenuItem, updateMenuItem } = useData();
  const { toast } = useToast();

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);

  const [viewItem, setViewItem] = useState<MenuItem | null>(null);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const [addForm, setAddForm] = useState({ ...blankForm });
  const [editForm, setEditForm] = useState({ name: "", category: "Mains", price: "", description: "", dietary: [] as string[], status: "Available" as MenuStatus });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return menuItems.filter(m => (category === "All" || m.category === category) && (!q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)));
  }, [menuItems, category, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function toggleDietary(tag: string, form: typeof editForm, setForm: (f: typeof editForm) => void) {
    setForm({ ...form, dietary: form.dietary.includes(tag) ? form.dietary.filter(t => t !== tag) : [...form.dietary, tag] });
  }

  function openEdit(m: MenuItem) {
    setEditItem(m);
    setEditForm({ name: m.name, category: m.category, price: String(m.price), description: m.description, dietary: [...m.dietary], status: m.status });
  }

  function saveEdit() {
    if (!editItem) return;
    updateMenuItem(editItem.id, { name: editForm.name, category: editForm.category, price: Number(editForm.price), description: editForm.description, dietary: editForm.dietary, status: editForm.status });
    setEditItem(null);
    toast("Menu item updated");
  }

  function toggleAvailability(m: MenuItem) {
    const next: MenuStatus = m.status === "Available" ? "Unavailable" : "Available";
    updateMenuItem(m.id, { status: next });
    toast(`"${m.name}" marked as ${next}`, "info");
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    addMenuItem({ name: addForm.name, category: addForm.category, price: Number(addForm.price), description: addForm.description, dietary: addForm.dietary, status: addForm.status });
    setAddOpen(false);
    setAddForm({ ...blankForm });
    toast("Menu item added");
  }

  const emoji = (cat: string) => ({ Beverages: "🥤", Desserts: "🍰", Appetizers: "🥗", Platters: "🍽️" }[cat] ?? "🍴");

  return (
    <DashboardLayout title="Menu">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div><h2 className="text-xl font-bold text-gray-900">Menu &amp; Catalog</h2><p className="text-sm text-gray-500 mt-0.5">{filtered.length} items</p></div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setView("list")} className={`px-3 py-2 transition-colors ${view === "list" ? "bg-primary-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}><List size={15} /></button>
              <button onClick={() => setView("grid")} className={`px-3 py-2 transition-colors ${view === "grid" ? "bg-primary-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}><LayoutGrid size={15} /></button>
            </div>
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-sm">
              <Plus size={16} /> Add Item
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => { setCategory(c); setPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${category === c ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                {c}{c !== "All" && <span className="ml-1.5 text-xs opacity-70">({menuItems.filter(m => m.category === c).length})</span>}
              </button>
            ))}
          </div>
          <div className="relative ml-auto min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search items…"
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-300" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={13} /></button>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {view === "list" ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {["Item", "Category", "Price (AUD)", "Dietary", "Orders / Month", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-16 text-gray-400 text-sm">No items found.</td></tr>
                    ) : paginated.map(m => (
                      <tr key={m.id} className={`transition-colors ${m.status === "Unavailable" ? "opacity-60" : "hover:bg-gray-50"}`}>
                        <td className="px-4 py-3"><p className="font-medium text-gray-800">{m.name}</p><p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{m.description}</p></td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{m.category}</span></td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{formatCurrency(m.price)}</td>
                        <td className="px-4 py-3"><div className="flex gap-1 flex-wrap">{m.dietary.map(d => <span key={d} className="text-[10px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-700 font-medium">{d}</span>)}</div></td>
                        <td className="px-4 py-3 text-gray-600">{m.ordersThisMonth}</td>
                        <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <button onClick={() => setViewItem(m)} title="View" className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Eye size={14} /></button>
                            <button onClick={() => openEdit(m)} title="Edit" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => toggleAvailability(m)} title={m.status === "Available" ? "Mark Unavailable" : "Mark Available"} className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                              {m.status === "Available" ? <ToggleRight size={16} className="text-green-500" /> : <ToggleLeft size={16} className="text-gray-400" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} perPage={PER_PAGE} />
            </>
          ) : (
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginated.map(m => (
                <div key={m.id} className={`border border-gray-100 rounded-xl p-4 hover:border-primary-200 hover:shadow-sm transition-all cursor-pointer ${m.status === "Unavailable" ? "opacity-60" : ""}`} onClick={() => setViewItem(m)}>
                  <div className="w-full h-24 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg mb-3 flex items-center justify-center text-3xl">{emoji(m.category)}</div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">{m.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{m.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-primary-600">{formatCurrency(m.price)}</p>
                    <StatusBadge status={m.status} size="sm" />
                  </div>
                  {m.dietary.length > 0 && <div className="flex gap-1 flex-wrap mt-2">{m.dietary.map(d => <span key={d} className="text-[9px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-700 font-medium">{d}</span>)}</div>}
                  <button onClick={e => { e.stopPropagation(); toggleAvailability(m); }} className="mt-2 w-full text-[10px] font-medium text-gray-500 hover:text-primary-600 transition-colors text-center">
                    {m.status === "Available" ? "Mark Unavailable" : "Mark Available"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.name ?? ""} size="md">
        {viewItem && (
          <div className="space-y-4">
            <div className="w-full h-32 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl flex items-center justify-center text-5xl">{emoji(viewItem.category)}</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[["Category", viewItem.category], ["Price", formatCurrency(viewItem.price)], ["Orders This Month", String(viewItem.ordersThisMonth)]].map(([l, v]) => (
                <div key={l}><p className="text-xs text-gray-400 uppercase tracking-wide">{l}</p><p className="font-medium text-gray-800 mt-1">{v}</p></div>
              ))}
              <div><p className="text-xs text-gray-400 uppercase tracking-wide">Status</p><div className="mt-1"><StatusBadge status={viewItem.status} /></div></div>
            </div>
            <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Description</p><p className="text-sm text-gray-700">{viewItem.description}</p></div>
            {viewItem.dietary.length > 0 && <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Dietary Tags</p><div className="flex gap-2">{viewItem.dietary.map(d => <span key={d} className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">{d}</span>)}</div></div>}
            <button onClick={() => { toggleAvailability(viewItem); setViewItem(null); }} className={`w-full py-2.5 text-sm font-semibold rounded-xl transition-colors ${viewItem.status === "Available" ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100" : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"}`}>
              {viewItem.status === "Available" ? "Mark as Unavailable" : "Mark as Available"}
            </button>
          </div>
        )}
      </Modal>

      {/* Edit */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title={`Edit: ${editItem?.name}`} size="md">
        {editItem && (
          <div className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Item Name</label>
              <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Price (AUD)</label>
                <input type="number" min="0" step="0.01" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value as MenuStatus })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select></div>
            </div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-2">Dietary Tags</label>
              <div className="flex gap-2 flex-wrap">
                {DIETARY_TAGS.map(tag => (
                  <button type="button" key={tag} onClick={() => toggleDietary(tag, editForm, setEditForm)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${editForm.dietary.includes(tag) ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>{tag}</button>
                ))}
              </div></div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setEditItem(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Menu Item" size="md">
        <form onSubmit={submitAdd} className="space-y-4">
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Item Name</label>
            <input required value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g. Barramundi & Chips" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select value={addForm.category} onChange={e => setAddForm({ ...addForm, category: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Price (AUD)</label>
              <input required type="number" min="0" step="0.01" value={addForm.price} onChange={e => setAddForm({ ...addForm, price: e.target.value })} placeholder="0.00" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
          </div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea value={addForm.description} onChange={e => setAddForm({ ...addForm, description: e.target.value })} rows={3} placeholder="Describe the dish…" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-2">Dietary Tags</label>
            <div className="flex gap-2 flex-wrap">
              {DIETARY_TAGS.map(tag => (
                <button type="button" key={tag} onClick={() => toggleDietary(tag, addForm as typeof editForm, f => setAddForm({ ...addForm, dietary: f.dietary }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${addForm.dietary.includes(tag) ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>{tag}</button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">GF=Gluten Free · V=Vegetarian · VE=Vegan · DF=Dairy Free · H=Halal</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setAddOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600">Add to Menu</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
