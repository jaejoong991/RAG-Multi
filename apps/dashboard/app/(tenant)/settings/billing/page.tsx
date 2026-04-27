"use client";

import { CreditCard, CheckCircle2, ArrowUpCircle, History, Download, Zap, Database, FileText } from "lucide-react";
import { PlanSelector } from "@/components/billing/PlanSelector";

const invoices = [
  { id: "INV-2024-0082", date: "Apr 12, 2024", amount: "$49.00", status: "Paid" },
  { id: "INV-2024-0075", date: "Mar 12, 2024", amount: "$49.00", status: "Paid" },
  { id: "INV-2024-0064", date: "Feb 12, 2024", amount: "$49.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="max-w-5xl space-y-12 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Billing & Subscription</h1>
        <p className="text-on-surface-variant">Manage your workspace plan, usage limits, and payment history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Summary */}
        <div className="lg:col-span-2 p-8 glass-panel rounded-2xl space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-primary/10 group-hover:text-primary/20 transition-colors">
            <ArrowUpCircle size={80} />
          </div>

          <div className="space-y-1 relative z-10">
            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">Active Subscription</span>
            <h2 className="text-3xl font-bold text-white mt-4">Pro Plan</h2>
            <p className="text-on-surface-variant text-sm">$49.00 billed monthly · Next renewal May 12, 2024</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
              { label: "Queries", value: "3,240 / 5,000", progress: 64, icon: Zap, color: "text-primary" },
              { label: "Vector Storage", value: "124MB / 500MB", progress: 25, icon: Database, color: "text-success" },
              { label: "Documents", value: "34 / 50", progress: 68, icon: FileText, color: "text-secondary" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-2 text-on-surface-variant"><stat.icon size={12} className={stat.color} /> {stat.label}</span>
                  <span className="text-white">{stat.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-current ${stat.color}`} style={{ width: `${stat.progress}%` }} />
                </div>
                <p className="text-[10px] font-mono text-on-surface-variant">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 relative z-10">
            <button className="primary-gradient text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all">Upgrade Plan</button>
            <button className="px-6 py-2.5 rounded-lg border border-white/5 text-on-surface-variant hover:text-white hover:bg-white/5 transition-all text-sm font-bold">Manage Billing</button>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="p-8 glass-panel rounded-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <CreditCard size={14} className="text-primary" />
              Payment Method
            </h3>
            <div className="p-4 bg-background-deep border border-white/10 rounded-xl flex items-center gap-4">
              <div className="w-10 h-6 bg-white/5 rounded flex items-center justify-center border border-white/10 font-bold text-[8px] text-on-surface-variant">VISA</div>
              <div>
                <p className="text-sm font-bold text-white">•••• 4242</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Exp 12/26</p>
              </div>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-lg border border-white/5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hover:text-white transition-all">Update Card</button>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Scale with your Intelligence</h2>
          <p className="text-on-surface-variant mt-2">Choose the tier that matches your processing requirements.</p>
        </div>
        <PlanSelector />
      </div>

      {/* Invoice History */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <History size={16} />
          Payment History
        </h3>
        <div className="bg-surface-card border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-white">{inv.id}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{inv.date}</td>
                  <td className="px-6 py-4 text-white font-bold">{inv.amount}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-on-surface-variant hover:text-primary">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
