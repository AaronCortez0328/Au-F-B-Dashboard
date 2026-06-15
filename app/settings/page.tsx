"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/lib/toast-context";
import { Settings, User, Bell, Globe, Lock, Palette, Database, Check } from "lucide-react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-primary-500" : "bg-gray-200"}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4.5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();

  const [notifs, setNotifs] = useState({ orderUpdates: true, lowStock: true, eventReminders: true, staffAlerts: false, weeklyReport: true, systemAlerts: true });
  const [display, setDisplay] = useState({ compactMode: false, showAvatars: true, animateCharts: true, colorCodedRows: true });
  const [regional, setRegional] = useState({ currency: "AUD", timezone: "Australia/Sydney", dateFormat: "DD/MM/YYYY", language: "en-AU" });
  const [profile, setProfile] = useState({ name: "Admin User", email: "admin@outbacktableco.com.au", role: "Operations Manager", branch: "All Branches" });
  const [activeSection, setActiveSection] = useState<string | null>(null);

  function save(section: string) {
    toast(`${section} settings saved`);
    setActiveSection(null);
  }

  const sections = [
    { id: "account", icon: User, label: "Account", desc: "Manage your profile and account preferences" },
    { id: "notifications", icon: Bell, label: "Notifications", desc: "Configure alert thresholds and notification channels" },
    { id: "regional", icon: Globe, label: "Regional", desc: "Currency, timezone and locale settings" },
    { id: "security", icon: Lock, label: "Security", desc: "Password, two-factor authentication and sessions" },
    { id: "appearance", icon: Palette, label: "Appearance", desc: "Theme, density and display preferences" },
    { id: "integrations", icon: Database, label: "Data & Integrations", desc: "API keys, webhooks and third-party integrations" },
  ];

  return (
    <DashboardLayout title="Settings">
      <div className="p-6 space-y-5">
        <div><h2 className="text-xl font-bold text-gray-900">Settings</h2><p className="text-sm text-gray-500 mt-0.5">Manage your Outback Table Co. dashboard configuration</p></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map(({ id, icon: Icon, label, desc }) => (
            <button key={id} onClick={() => setActiveSection(activeSection === id ? null : id)}
              className={`flex items-start gap-4 p-5 bg-white rounded-xl border transition-all text-left group ${activeSection === id ? "border-primary-400 shadow-md ring-1 ring-primary-200" : "border-gray-200 hover:border-primary-300 hover:shadow-sm"}`}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${activeSection === id ? "bg-primary-100" : "bg-primary-50 group-hover:bg-primary-100"}`}>
                <Icon size={18} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>
              </div>
              {activeSection === id && <Check size={14} className="text-primary-500 shrink-0 mt-1" />}
            </button>
          ))}
        </div>

        {/* Account Panel */}
        {activeSection === "account" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-3">Account Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              {([["Full Name", "name"], ["Email", "email"], ["Role", "role"], ["Default Branch", "branch"]] as const).map(([label, key]) => (
                <div key={key}><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input value={profile[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setActiveSection(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => save("Account")} className="px-4 py-2 text-sm font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600">Save Changes</button>
            </div>
          </div>
        )}

        {/* Notifications Panel */}
        {activeSection === "notifications" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-3">Notification Preferences</h3>
            <div className="space-y-3">
              {([["orderUpdates", "Order status updates", "Get notified when order statuses change"], ["lowStock", "Low stock alerts", "Alert when inventory falls below minimum levels"], ["eventReminders", "Event reminders", "Reminders for upcoming catering events"], ["staffAlerts", "Staff alerts", "Notifications for staff schedule changes"], ["weeklyReport", "Weekly summary report", "Weekly performance digest every Monday"], ["systemAlerts", "System alerts", "Critical system and security notifications"]] as const).map(([key, label, desc]) => (
                <div key={key} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div><p className="text-sm font-medium text-gray-800">{label}</p><p className="text-xs text-gray-400 mt-0.5">{desc}</p></div>
                  <Toggle checked={notifs[key]} onChange={v => setNotifs({ ...notifs, [key]: v })} />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setActiveSection(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => save("Notification")} className="px-4 py-2 text-sm font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600">Save Preferences</button>
            </div>
          </div>
        )}

        {/* Regional Panel */}
        {activeSection === "regional" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-3">Regional Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Currency</label>
                <select value={regional.currency} onChange={e => setRegional({ ...regional, currency: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                  {["AUD", "NZD", "USD", "GBP", "EUR"].map(c => <option key={c}>{c}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Timezone</label>
                <select value={regional.timezone} onChange={e => setRegional({ ...regional, timezone: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                  {["Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth", "Australia/Adelaide"].map(z => <option key={z}>{z}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Date Format</label>
                <select value={regional.dateFormat} onChange={e => setRegional({ ...regional, dateFormat: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                  {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map(f => <option key={f}>{f}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Language</label>
                <select value={regional.language} onChange={e => setRegional({ ...regional, language: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                  {["en-AU", "en-GB", "en-US"].map(l => <option key={l}>{l}</option>)}
                </select></div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setActiveSection(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => save("Regional")} className="px-4 py-2 text-sm font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600">Save Settings</button>
            </div>
          </div>
        )}

        {/* Appearance Panel */}
        {activeSection === "appearance" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-3">Appearance</h3>
            <div className="space-y-3">
              {([["compactMode", "Compact mode", "Reduce table row height and card padding"], ["showAvatars", "Show staff avatars", "Display initials avatar icons in staff tables"], ["animateCharts", "Animate charts", "Enable chart enter animations on page load"], ["colorCodedRows", "Colour-coded table rows", "Highlight critical/low inventory rows in colour"]] as const).map(([key, label, desc]) => (
                <div key={key} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div><p className="text-sm font-medium text-gray-800">{label}</p><p className="text-xs text-gray-400 mt-0.5">{desc}</p></div>
                  <Toggle checked={display[key]} onChange={v => setDisplay({ ...display, [key]: v })} />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setActiveSection(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => save("Appearance")} className="px-4 py-2 text-sm font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600">Save Preferences</button>
            </div>
          </div>
        )}

        {/* Security Panel */}
        {activeSection === "security" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-3">Security</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label><input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">New Password</label><input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" /></div>
              </div>
              <div className="flex items-center justify-between py-2.5 border-t border-gray-50">
                <div><p className="text-sm font-medium text-gray-800">Two-factor authentication</p><p className="text-xs text-gray-400 mt-0.5">Require a verification code on login</p></div>
                <Toggle checked={false} onChange={() => toast("2FA configuration requires backend integration")} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setActiveSection(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => save("Security")} className="px-4 py-2 text-sm font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600">Update Password</button>
            </div>
          </div>
        )}

        {/* Integrations Panel */}
        {activeSection === "integrations" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-3">Data & Integrations</h3>
            <div className="space-y-3">
              {[{ name: "Xero Accounting", desc: "Sync invoices and revenue data", connected: true }, { name: "Delivery Driver App", desc: "Live delivery status updates", connected: true }, { name: "Google Calendar", desc: "Sync catering events to calendar", connected: false }, { name: "Slack Notifications", desc: "Send alerts to Slack channels", connected: false }].map(item => (
                <div key={item.name} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div><p className="text-sm font-medium text-gray-800">{item.name}</p><p className="text-xs text-gray-400 mt-0.5">{item.desc}</p></div>
                  <button onClick={() => toast(`${item.connected ? "Disconnected from" : "Connected to"} ${item.name}`)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${item.connected ? "text-red-600 border-red-200 hover:bg-red-50" : "text-green-600 border-green-200 hover:bg-green-50"}`}>
                    {item.connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveSection(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        )}

        <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><Settings size={16} className="text-primary-600" /><p className="text-sm font-semibold text-primary-800">Demo Mode Active</p></div>
          <p className="text-xs text-primary-600">Settings changes are applied locally in this prototype. No data is persisted to a backend. Outback Table Co. operational data shown is anonymized.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
