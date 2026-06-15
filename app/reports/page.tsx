"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { orders, menuItems, inventoryItems, cateringEvents, staffMembers, trendData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Eye, Download, AlertTriangle, BarChart2 as BarChartIcon } from "lucide-react";

const REPORT_TYPES = ["Sales Summary", "Event Performance", "Inventory Report", "Staff Utilisation", "Menu Performance"];
const SCOPES = ["All Branches", "Sydney CBD", "Melbourne North", "Brisbane South", "Perth East", "Adelaide", "Gold Coast"];
const DATE_RANGES = ["This Month", "Last Month", "Last 3 Months", "This Year"];

function generateCSV(reportType: string, scope: string, range: string): string {
  const header = `Spandis Food & Catering Operations\nReport: ${reportType}\nScope: ${scope}\nDate Range: ${range}\nGenerated: ${new Date().toLocaleString("en-AU")}\n\n`;
  if (reportType === "Sales Summary") {
    const rows = orders.map((o) => `${o.reference},${o.customer},${o.venue},${o.date},${o.type},${o.status},${o.total}`).join("\n");
    return header + "Reference,Customer,Venue,Date,Type,Status,Total (AUD)\n" + rows;
  }
  if (reportType === "Menu Performance") {
    const rows = menuItems.map((m) => `${m.name},${m.category},${m.price},${m.ordersThisMonth},${m.status}`).join("\n");
    return header + "Item,Category,Price (AUD),Orders This Month,Status\n" + rows;
  }
  if (reportType === "Inventory Report") {
    const rows = inventoryItems.map((i) => `${i.name},${i.category},${i.unit},${i.inStock},${i.minLevel},${i.status},${i.supplier}`).join("\n");
    return header + "Item,Category,Unit,In Stock,Min Level,Status,Supplier\n" + rows;
  }
  if (reportType === "Event Performance") {
    const rows = cateringEvents.map((e) => `${e.reference},${e.client},${e.venue},${e.date},${e.headcount},${e.package},${e.status}`).join("\n");
    return header + "Reference,Client,Venue,Date,Headcount,Package,Status\n" + rows;
  }
  if (reportType === "Staff Utilisation") {
    const rows = staffMembers.map((s) => `${s.id},${s.name},${s.role},${s.branch},${s.shift},${s.status},${s.assignedEvent ?? ""}`).join("\n");
    return header + "ID,Name,Role,Branch,Shift,Status,Assigned Event\n" + rows;
  }
  return header;
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState("Sales Summary");
  const [scope, setScope] = useState("All Branches");
  const [range, setRange] = useState("This Month");
  const [previewing, setPreviewing] = useState(false);

  const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const avgOrderValue = totalRevenue / orders.filter(o => o.status !== "Cancelled").length;

  const topItems = [...menuItems].sort((a, b) => b.ordersThisMonth - a.ordersThisMonth).slice(0, 8)
    .map((m) => ({ name: m.name.length > 18 ? m.name.slice(0, 18) + "…" : m.name, orders: m.ordersThisMonth, revenue: m.ordersThisMonth * m.price }));

  const eventsByStatus = ["Upcoming", "In Progress", "Completed", "Cancelled"].map((s) => ({
    status: s,
    count: cateringEvents.filter((e) => e.status === s).length,
  }));

  const inventoryByStatus = ["OK", "Low", "Critical", "Out"].map((s) => ({
    status: s,
    count: inventoryItems.filter((i) => i.status === s).length,
  }));

  const staffByRole = staffMembers.reduce((acc, s) => {
    acc[s.role] = (acc[s.role] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const staffChartData = Object.entries(staffByRole).map(([role, count]) => ({ role: role.length > 14 ? role.slice(0, 14) + "…" : role, count }));

  function renderPreview() {
    if (reportType === "Sales Summary") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Orders", value: orders.length },
              { label: "Total Revenue", value: formatCurrency(totalRevenue) },
              { label: "Avg Order Value", value: formatCurrency(avgOrderValue) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-primary-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary-700">{value}</p>
                <p className="text-xs text-primary-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="border rounded-xl overflow-hidden">
            <p className="text-xs font-semibold text-gray-500 px-4 py-3 bg-gray-50 border-b">Revenue Trend</p>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Line type="monotone" dataKey="revenue" stroke="#2D6A4F" strokeWidth={2} dot={false} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }
    if (reportType === "Menu Performance") {
      return (
        <div className="border rounded-xl overflow-hidden">
          <p className="text-xs font-semibold text-gray-500 px-4 py-3 bg-gray-50 border-b">Top 8 Items by Orders</p>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topItems} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#2D6A4F" radius={[0, 4, 4, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
    if (reportType === "Inventory Report") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {inventoryByStatus.map(({ status, count }) => (
              <div key={status} className={`rounded-xl p-3 text-center border ${status === "OK" ? "bg-green-50 border-green-200" : status === "Low" ? "bg-yellow-50 border-yellow-200" : status === "Critical" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
                <p className="text-xl font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-500 mt-0.5">{status}</p>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 border-b"><th className="text-left px-3 py-2 text-gray-500">Item</th><th className="text-left px-3 py-2 text-gray-500">Category</th><th className="px-3 py-2 text-gray-500">Stock</th><th className="px-3 py-2 text-gray-500">Min</th><th className="px-3 py-2 text-gray-500">Status</th></tr></thead>
              <tbody className="divide-y">
                {inventoryItems.filter(i => i.status !== "OK").map((i) => (
                  <tr key={i.id} className={i.status === "Critical" || i.status === "Out" ? "bg-red-50" : "bg-yellow-50"}>
                    <td className="px-3 py-2 font-medium text-gray-800">{i.name}</td>
                    <td className="px-3 py-2 text-gray-600">{i.category}</td>
                    <td className="px-3 py-2 text-center text-gray-700">{i.inStock} {i.unit}</td>
                    <td className="px-3 py-2 text-center text-gray-500">{i.minLevel}</td>
                    <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${i.status === "Critical" || i.status === "Out" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{i.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (reportType === "Event Performance") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {eventsByStatus.map(({ status, count }) => (
              <div key={status} className="bg-primary-50 rounded-xl p-3 text-center border border-primary-100">
                <p className="text-xl font-bold text-primary-700">{count}</p>
                <p className="text-xs text-primary-500 mt-0.5">{status}</p>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 border-b">{["Ref", "Client", "Venue", "Date", "Guests", "Status"].map(h => <th key={h} className="text-left px-3 py-2 text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {cateringEvents.slice(0, 8).map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-primary-600 font-medium">{e.reference}</td>
                    <td className="px-3 py-2 text-gray-800">{e.client}</td>
                    <td className="px-3 py-2 text-gray-600 text-[11px]">{e.venue.split(",")[0]}</td>
                    <td className="px-3 py-2 text-gray-500">{e.date}</td>
                    <td className="px-3 py-2 text-center text-gray-700">{e.headcount}</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold">{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (reportType === "Staff Utilisation") {
      return (
        <div className="space-y-4">
          <div className="border rounded-xl overflow-hidden">
            <p className="text-xs font-semibold text-gray-500 px-4 py-3 bg-gray-50 border-b">Staff by Role</p>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={staffChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="role" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F4A261" radius={[4, 4, 0, 0]} name="Staff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "On Duty", value: staffMembers.filter(s => s.status === "On Duty").length, color: "bg-green-50 text-green-700" }, { label: "Off Duty", value: staffMembers.filter(s => s.status === "Off Duty").length, color: "bg-gray-50 text-gray-700" }, { label: "On Leave", value: staffMembers.filter(s => s.status === "On Leave").length, color: "bg-yellow-50 text-yellow-700" }].map(({ label, value, color }) => (
              <div key={label} className={`rounded-xl p-3 text-center ${color}`}>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <DashboardLayout title="Reports">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reports &amp; Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Generate and export operational reports</p>
        </div>

        {/* Config card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChartIcon size={18} className="text-primary-600" />
            <h3 className="text-sm font-semibold text-gray-800">Report Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Report Type</label>
              <select value={reportType} onChange={(e) => { setReportType(e.target.value); setPreviewing(false); }} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white">
                {REPORT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Scope</label>
              <select value={scope} onChange={(e) => setScope(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white">
                {SCOPES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Date Range</label>
              <select value={range} onChange={(e) => setRange(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white">
                {DATE_RANGES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors"
            >
              <Eye size={16} /> Preview Report
            </button>
            <button
              onClick={() => downloadCSV(generateCSV(reportType, scope, range), `spandis-${reportType.toLowerCase().replace(/\s+/g, "-")}-${range.toLowerCase().replace(/\s+/g, "-")}.csv`)}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Download size={16} /> Export CSV
            </button>
            <div className="flex items-center gap-1.5 text-xs text-yellow-600 ml-1">
              <AlertTriangle size={13} />
              PDF export requires future backend integration
            </div>
          </div>
        </div>

        {/* Preview */}
        {previewing && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">{reportType}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{scope} · {range}</p>
              </div>
              <button
                onClick={() => downloadCSV(generateCSV(reportType, scope, range), `spandis-${reportType.toLowerCase().replace(/\s+/g, "-")}.csv`)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
            {renderPreview()}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
