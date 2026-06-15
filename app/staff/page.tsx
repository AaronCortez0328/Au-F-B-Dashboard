"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { useData } from "@/lib/data-context";
import { useToast } from "@/lib/toast-context";
import { StaffMember, StaffStatus } from "@/lib/data";
import { Search, Plus, Eye, Pencil, X } from "lucide-react";

const ROLES = ["All Roles", "Head Chef", "Sous Chef", "Chef", "Catering Coordinator", "Driver", "Server", "Admin"];
const STATUSES: StaffStatus[] = ["On Duty", "Off Duty", "On Leave"];
const PER_PAGE = 10;
const blankForm = { name: "", role: "Chef", branch: "", shift: "", phone: "", email: "" };

export default function StaffPage() {
  const { staffMembers, addStaffMember, updateStaffMember } = useData();
  const { toast } = useToast();

  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState<StaffStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [viewStaff, setViewStaff] = useState<StaffMember | null>(null);
  const [editStaff, setEditStaff] = useState<StaffMember | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const [addForm, setAddForm] = useState({ ...blankForm });
  const [editForm, setEditForm] = useState({ name: "", role: "", branch: "", shift: "", phone: "", email: "", status: "On Duty" as StaffStatus, assignedEvent: "" });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return staffMembers.filter(s =>
      (roleFilter === "All Roles" || s.role === roleFilter) &&
      (statusFilter === "All" || s.status === statusFilter) &&
      (!q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.branch.toLowerCase().includes(q))
    );
  }, [staffMembers, roleFilter, statusFilter, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const onDuty = staffMembers.filter(s => s.status === "On Duty").length;
  const offDuty = staffMembers.filter(s => s.status === "Off Duty").length;
  const onLeave = staffMembers.filter(s => s.status === "On Leave").length;

  function openEdit(s: StaffMember) {
    setEditStaff(s);
    setEditForm({ name: s.name, role: s.role, branch: s.branch, shift: s.shift, phone: s.phone, email: s.email, status: s.status, assignedEvent: s.assignedEvent ?? "" });
  }

  function saveEdit() {
    if (!editStaff) return;
    updateStaffMember(editStaff.id, { name: editForm.name, role: editForm.role, branch: editForm.branch, shift: editForm.shift, phone: editForm.phone, email: editForm.email, status: editForm.status, assignedEvent: editForm.assignedEvent || undefined });
    setEditStaff(null);
    toast(`"${editForm.name}" updated`);
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    addStaffMember(addForm);
    setAddOpen(false);
    setAddForm({ ...blankForm });
    toast("Staff member added");
  }

  function quickStatus(s: StaffMember, status: StaffStatus) {
    updateStaffMember(s.id, { status });
    toast(`${s.name} marked as ${status}`);
  }

  return (
    <DashboardLayout title="Staff">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div><h2 className="text-xl font-bold text-gray-900">Staff</h2><p className="text-sm text-gray-500 mt-0.5">{filtered.length} members</p></div>
          <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-sm">
            <Plus size={16} /> Add Staff
          </button>
        </div>

        <div className="flex gap-3 flex-wrap">
          {[{ label: "On Duty", count: onDuty, color: "bg-green-50 text-green-700 border-green-200" }, { label: "Off Duty", count: offDuty, color: "bg-gray-50 text-gray-700 border-gray-200" }, { label: "On Leave", count: onLeave, color: "bg-yellow-50 text-yellow-700 border-yellow-200" }, { label: "Total", count: staffMembers.length, color: "bg-primary-50 text-primary-700 border-primary-200" }].map(({ label, count, color }) => (
            <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${color}`}>
              <span className="font-bold text-base">{count}</span> {label}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search staff…"
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-300" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={13} /></button>}
          </div>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-300">
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={() => { setStatusFilter("All"); setPage(1); }} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${statusFilter === "All" ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>All</button>
            {STATUSES.map(s => (
              <button key={s} onClick={() => { setStatusFilter(statusFilter === s ? "All" : s); setPage(1); }} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${statusFilter === s ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-200">
                {["Staff", "Role", "Branch", "Shift", "Status", "Assigned Event", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-16 text-gray-400 text-sm">No staff found.</td></tr>
                ) : paginated.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold flex items-center justify-center shrink-0">{s.name.charAt(0)}</div>
                        <div><p className="font-medium text-gray-800">{s.name}</p><p className="text-[11px] text-gray-400">{s.id}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">{s.role}</span></td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{s.branch}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">{s.shift}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">{s.assignedEvent ? <span className="text-xs px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 font-medium">{s.assignedEvent}</span> : <span className="text-gray-400 text-xs">—</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setViewStaff(s)} title="View" className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Eye size={14} /></button>
                        <button onClick={() => openEdit(s)} title="Edit" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Pencil size={14} /></button>
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
      <Modal open={!!viewStaff} onClose={() => setViewStaff(null)} title="Staff Details" size="md">
        {viewStaff && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-500 text-white text-2xl font-bold flex items-center justify-center">{viewStaff.name.charAt(0)}</div>
              <div>
                <p className="text-base font-bold text-gray-900">{viewStaff.name}</p>
                <p className="text-sm text-gray-500">{viewStaff.role} · {viewStaff.branch}</p>
                <div className="mt-1"><StatusBadge status={viewStaff.status} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[{ label: "Staff ID", value: viewStaff.id }, { label: "Shift", value: viewStaff.shift }, { label: "Phone", value: viewStaff.phone }, { label: "Email", value: viewStaff.email }, { label: "Assigned Event", value: viewStaff.assignedEvent ?? "None" }].map(({ label, value }) => (
                <div key={label}><p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p><p className="font-medium text-gray-800 mt-1 break-all">{value}</p></div>
              ))}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Quick Status Update</p>
              <div className="flex gap-2">
                {STATUSES.map(st => (
                  <button key={st} onClick={() => { quickStatus(viewStaff, st); setViewStaff(null); }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${viewStaff.status === st ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>{st}</button>
                ))}
              </div>
            </div>
            <button onClick={() => { openEdit(viewStaff); setViewStaff(null); }} className="w-full py-2.5 text-sm font-semibold bg-primary-50 text-primary-700 border border-primary-200 rounded-xl hover:bg-primary-100 transition-colors">
              Edit Staff Member
            </button>
          </div>
        )}
      </Modal>

      {/* Edit */}
      <Modal open={!!editStaff} onClose={() => setEditStaff(null)} title={`Edit: ${editStaff?.name}`} size="md">
        {editStaff && (
          <div className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <div className="flex gap-2">
                {STATUSES.map(s => (
                  <button key={s} type="button" onClick={() => setEditForm({ ...editForm, status: s })}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${editForm.status === s ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([["Full Name", "name"], ["Branch", "branch"], ["Phone", "phone"], ["Email", "email"], ["Shift", "shift"], ["Assigned Event", "assignedEvent"]] as const).map(([label, key]) => (
                <div key={key}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input value={editForm[key]} onChange={e => setEditForm({ ...editForm, [key]: e.target.value })} placeholder={label} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
              ))}
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                  {ROLES.filter(r => r !== "All Roles").map(r => <option key={r}>{r}</option>)}
                </select></div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setEditStaff(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Staff Member" size="md">
        <form onSubmit={submitAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {([["Full Name", "name", "e.g. Emma Parker"], ["Branch", "branch", "e.g. Sydney CBD"], ["Phone", "phone", "04XX XXX XXX"], ["Email", "email", "name@outbacktableco.com.au"], ["Shift", "shift", "e.g. 06:00–14:00"]] as const).map(([label, key, placeholder]) => (
              <div key={key}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                <input required value={addForm[key]} onChange={e => setAddForm({ ...addForm, [key]: e.target.value })} placeholder={placeholder} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
            ))}
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
              <select value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                {ROLES.filter(r => r !== "All Roles").map(r => <option key={r}>{r}</option>)}
              </select></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600">Add Staff</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
