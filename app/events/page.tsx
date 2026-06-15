"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { useData } from "@/lib/data-context";
import { useToast } from "@/lib/toast-context";
import { CateringEvent, EventStatus } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Search, Plus, Eye, Pencil, CalendarRange, Users, X } from "lucide-react";

const STATUSES: EventStatus[] = ["Upcoming", "In Progress", "Completed", "Cancelled"];
const PACKAGES = ["Corporate Lunch", "Premium Corporate", "Wedding Banquet", "Gala Dinner", "School Canteen Pack", "Casual BBQ", "Festival Catering", "Conference Pack", "Sports Event Pack", "Cocktail Evening"];
const PER_PAGE = 8;
const blankForm = { client: "", venue: "", date: "", headcount: "", dietary: "", package: "Corporate Lunch", notes: "", branch: "" };

export default function EventsPage() {
  const { cateringEvents, addEvent, updateEvent } = useData();
  const { toast } = useToast();

  const [statusFilter, setStatusFilter] = useState<EventStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [viewEvent, setViewEvent] = useState<CateringEvent | null>(null);
  const [editEvent, setEditEvent] = useState<CateringEvent | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const [addForm, setAddForm] = useState({ ...blankForm });
  const [editForm, setEditForm] = useState({ client: "", venue: "", date: "", headcount: "", dietary: "", package: "", notes: "", branch: "", status: "Upcoming" as EventStatus });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return cateringEvents.filter(ev =>
      (statusFilter === "All" || ev.status === statusFilter) &&
      (!q || ev.client.toLowerCase().includes(q) || ev.venue.toLowerCase().includes(q) || ev.reference.toLowerCase().includes(q))
    );
  }, [cateringEvents, statusFilter, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const counts = ["All", ...STATUSES].reduce((a, s) => ({ ...a, [s]: s === "All" ? cateringEvents.length : cateringEvents.filter(e => e.status === s).length }), {} as Record<string, number>);

  function openEdit(ev: CateringEvent) {
    setEditEvent(ev);
    setEditForm({ client: ev.client, venue: ev.venue, date: ev.date, headcount: String(ev.headcount), dietary: ev.dietary, package: ev.package, notes: ev.specialRequests ?? "", branch: ev.branch, status: ev.status });
  }

  function saveEdit() {
    if (!editEvent) return;
    updateEvent(editEvent.id, { client: editForm.client, venue: editForm.venue, date: editForm.date, headcount: Number(editForm.headcount), dietary: editForm.dietary, package: editForm.package, specialRequests: editForm.notes, branch: editForm.branch, status: editForm.status });
    setEditEvent(null);
    toast("Event updated");
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    addEvent({ client: addForm.client, venue: addForm.venue, date: addForm.date, headcount: Number(addForm.headcount), dietary: addForm.dietary, package: addForm.package, specialRequests: addForm.notes, branch: addForm.branch });
    setAddOpen(false);
    setAddForm({ ...blankForm });
    toast("Catering event created");
  }

  const FormFields = ({ form, setForm }: { form: typeof addForm; setForm: (f: typeof addForm) => void }) => (
    <>
      <div className="grid grid-cols-2 gap-3">
        {([["Client Name", "client", "e.g. Deloitte Australia"], ["Venue", "venue", "e.g. Sydney Convention Centre"], ["Branch", "branch", "e.g. Sydney CBD"], ["Headcount", "headcount", "e.g. 150", "number"]] as const).map(([label, key, placeholder, type]) => (
          <div key={key}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
            <input required type={type ?? "text"} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
        ))}
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Event Date</label>
          <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Package</label>
          <select value={form.package} onChange={e => setForm({ ...form, package: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
            {PACKAGES.map(p => <option key={p}>{p}</option>)}
          </select></div>
      </div>
      <div><label className="block text-xs font-medium text-gray-700 mb-1">Dietary Requirements</label>
        <input value={form.dietary} onChange={e => setForm({ ...form, dietary: e.target.value })} placeholder="e.g. GF, H, V options required" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
      <div><label className="block text-xs font-medium text-gray-700 mb-1">Special Requests</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Any special setup, timing or menu notes…" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" /></div>
    </>
  );

  return (
    <DashboardLayout title="Events">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div><h2 className="text-xl font-bold text-gray-900">Catering Events</h2><p className="text-sm text-gray-500 mt-0.5">{filtered.length} records</p></div>
          <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-sm">
            <Plus size={16} /> Add Event
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["All", ...STATUSES] as const).map(s => (
            <button key={s} onClick={() => { setStatusFilter(s as EventStatus | "All"); setPage(1); }}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${statusFilter === s ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              {s} <span className={`text-xs rounded-full px-1.5 py-0.5 ${statusFilter === s ? "bg-primary-400" : "bg-gray-100 text-gray-500"}`}>{counts[s]}</span>
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by client, venue, reference…"
            className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-300" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={13} /></button>}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-200">
                {["Reference", "Client", "Venue", "Date", "Guests", "Dietary", "Package", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-16 text-gray-400 text-sm">No events found.</td></tr>
                ) : paginated.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary-600">{ev.reference}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{ev.client}</td>
                    <td className="px-4 py-3"><p className="text-gray-700 text-xs leading-tight">{ev.venue}</p><p className="text-gray-400 text-[10px]">{ev.branch}</p></td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(ev.date)}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1 text-gray-600"><Users size={12} />{ev.headcount}</div></td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[120px]"><span className="line-clamp-2">{ev.dietary}</span></td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 font-medium">{ev.package}</span></td>
                    <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setViewEvent(ev)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Eye size={14} /></button>
                        <button onClick={() => openEdit(ev)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Pencil size={14} /></button>
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

      {/* View */}
      <Modal open={!!viewEvent} onClose={() => setViewEvent(null)} title={`${viewEvent?.reference} — ${viewEvent?.client}`} size="lg">
        {viewEvent && (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50"><CalendarRange size={22} className="text-primary-600" /></div>
              <div><p className="text-base font-bold text-gray-900">{viewEvent.client}</p><p className="text-sm text-gray-500">{viewEvent.venue}</p>
                <div className="flex gap-2 mt-1"><StatusBadge status={viewEvent.status} /><span className="text-xs px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 font-medium">{viewEvent.package}</span></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[["Date", formatDate(viewEvent.date)], ["Headcount", `${viewEvent.headcount} guests`], ["Branch", viewEvent.branch], ["Dietary", viewEvent.dietary]].map(([l, v]) => (
                <div key={l}><p className="text-xs text-gray-400 uppercase tracking-wide">{l}</p><p className="text-sm font-medium text-gray-800 mt-1">{v}</p></div>
              ))}
            </div>
            <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Assigned Staff</p>
              <div className="flex gap-2 flex-wrap">
                {viewEvent.assignedStaff.map(s => (
                  <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">{s[0]}</span>{s}
                  </span>
                ))}
              </div>
            </div>
            {viewEvent.specialRequests && <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Special Requests</p><p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 rounded-lg p-3">{viewEvent.specialRequests}</p></div>}
            <button onClick={() => { openEdit(viewEvent); setViewEvent(null); }} className="w-full py-2.5 text-sm font-semibold bg-primary-50 text-primary-700 border border-primary-200 rounded-xl hover:bg-primary-100 transition-colors">
              Edit This Event
            </button>
          </div>
        )}
      </Modal>

      {/* Edit */}
      <Modal open={!!editEvent} onClose={() => setEditEvent(null)} title={`Edit: ${editEvent?.client}`} size="lg">
        {editEvent && (
          <div className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <div className="flex gap-2 flex-wrap">
                {STATUSES.map(s => (
                  <button key={s} type="button" onClick={() => setEditForm({ ...editForm, status: s })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${editForm.status === s ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>{s}</button>
                ))}
              </div>
            </div>
            <FormFields form={editForm as typeof addForm} setForm={f => setEditForm({ ...editForm, ...f })} />
            <div className="flex gap-3 pt-1">
              <button onClick={() => setEditEvent(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Catering Event" size="lg">
        <form onSubmit={submitAdd} className="space-y-4">
          <FormFields form={addForm} setForm={setAddForm} />
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setAddOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600">Create Event</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
