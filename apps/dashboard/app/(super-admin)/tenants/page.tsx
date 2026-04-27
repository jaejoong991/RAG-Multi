"use client";

import { Building2, Plus, Search, MoreVertical, Globe, HardDrive, DollarSign, Activity } from "lucide-react";

const tenants = [
  { name: "Acme Corp", plan: "Pro", status: "Active", queries: "3,240", storage: "124MB", mrr: "$49", created: "Jan 15, 2024", logo: "AC" },
  { name: "TechStart Inc", plan: "Business", status: "Active", queries: "12,400", storage: "2.1GB", mrr: "$149", created: "Feb 3, 2024", logo: "TS" },
  { name: "LocalShop", plan: "Free", status: "Active", queries: "82", storage: "4MB", mrr: "$0", created: "Mar 20, 2024", logo: "LS" },
  { name: "OldCorp", plan: "Pro", status: "Suspended", queries: "0", storage: "56MB", mrr: "$0", created: "Dec 1, 2023", logo: "OC" },
];

export default function TenantsListPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Tenant Management</h1>
          <p className="text-on-surface-variant mt-2">Oversee all organizations on the platform.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-lg border border-white/5 text-sm font-bold text-on-surface-variant hover:bg-white/5 transition-all">Export CSV</button>
          <button className="primary-gradient text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary-container/20">
            <Plus size={18} />
            Create Tenant
          </button>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Tenants", value: "12", sub: "10 active", icon: Building2, color: "text-primary" },
          { label: "Total Revenue", value: "$1,247", sub: "+$198 this month", icon: DollarSign, color: "text-success" },
          { label: "Total Queries", value: "45,230", sub: "Last 30 days", icon: Activity, color: "text-secondary" },
          { label: "Total Storage", value: "4.2GB", sub: "Across all nodes", icon: HardDrive, color: "text-warning" },
        ].map((stat) => (
          <div key={stat.label} className="p-6 glass-panel rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              <p className="text-[10px] text-on-surface-variant font-medium mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
          <input 
            type="text" 
            placeholder="Search tenants, domains, IDs..." 
            className="w-full bg-surface-card border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <select className="bg-surface-card border border-white/10 rounded-lg p-2.5 text-xs font-bold text-white uppercase tracking-widest outline-none">
          <option>All Plans</option>
          <option>Pro</option>
          <option>Business</option>
          <option>Free</option>
        </select>
        <select className="bg-surface-card border border-white/10 rounded-lg p-2.5 text-xs font-bold text-white uppercase tracking-widest outline-none">
          <option>All Status</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Tenant Table */}
      <div className="bg-surface-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Organization</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Queries</th>
              <th className="px-6 py-4 text-center">MRR</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {tenants.map((t) => (
              <tr key={t.name} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
                      {t.logo}
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-primary transition-colors">{t.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">Created {t.created}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    t.plan === "Business" ? "bg-secondary/10 text-secondary" :
                    t.plan === "Pro" ? "bg-primary/10 text-primary" : "bg-white/5 text-on-surface-variant"
                  }`}>
                    {t.plan}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${t.status === "Active" ? "bg-success" : "bg-error"}`} />
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">{t.status}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-mono text-xs text-on-surface-variant">
                  {t.queries}
                </td>
                <td className="px-6 py-5 text-center font-bold text-white">
                  {t.mrr}
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-white transition-all">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
