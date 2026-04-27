"use client";

import { Key, Plus, Copy, Trash2, ShieldAlert, CheckCircle2, History } from "lucide-react";

const keys = [
  { name: "Production Widget", key: "tk_live_xxxx...3d1e", type: "Widget", created: "Jan 15, 2024", lastUsed: "2 min ago", status: "Active" },
  { name: "Staging Widget", key: "tk_test_xxxx...8f2a", type: "Widget", created: "Feb 3, 2024", lastUsed: "3 days ago", status: "Active" },
  { name: "Internal API", key: "tk_api_xxxx...9c4b", type: "Full API", created: "Mar 10, 2024", lastUsed: "Never", status: "Active" },
];

export default function ApiKeysPage() {
  return (
    <div className="max-w-5xl space-y-8 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">API Keys</h1>
          <p className="text-on-surface-variant mt-2">Manage your authentication tokens for the chat widget and REST API.</p>
        </div>
        <button className="primary-gradient text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary-container/20">
          <Plus size={18} />
          Create New Key
        </button>
      </div>

      {/* Security Warning */}
      <div className="p-6 glass-panel rounded-2xl border-primary/20 bg-primary/5 flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-widest">Secret Key Security</h4>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            API keys carry full administrative privileges. Never share them in client-side code (except for Widget Keys). 
            If a key is compromised, revoke it immediately.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Active Keys</h3>
        <div className="bg-surface-card border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/2">
              <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5">
                <th className="px-6 py-4">Key Name</th>
                <th className="px-6 py-4">Token</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Last Used</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {keys.map((k) => (
                <tr key={k.key} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-on-surface-variant">
                        <Key size={16} />
                      </div>
                      <span className="font-medium text-white">{k.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[10px] font-mono text-on-surface-variant bg-background-deep px-2 py-1 rounded border border-white/5">
                      {k.key}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      k.type === "Widget" ? "bg-secondary/10 text-secondary border border-secondary/20" : "bg-primary/10 text-primary border border-primary/20"
                    }`}>
                      {k.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                    {k.lastUsed}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-white transition-colors" title="Copy Key">
                        <Copy size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-error transition-colors" title="Revoke Key">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revoked Keys Section */}
      <div className="space-y-4">
        <button className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hover:text-white transition-all">
          <History size={14} />
          Show Revoked Keys (0)
        </button>
      </div>
    </div>
  );
}
