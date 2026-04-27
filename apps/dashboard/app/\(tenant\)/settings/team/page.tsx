"use client";

import { UserPlus, MoreVertical, ShieldCheck, User, Mail, Search } from "lucide-react";

const members = [
  { name: "Jeff Gunawan", email: "jeff@acme.com", role: "Admin", status: "Active", joined: "Jan 15, 2024", avatar: "JG" },
  { name: "Sarah Miller", email: "sarah@acme.com", role: "Member", status: "Active", joined: "Feb 3, 2024", avatar: "SM" },
  { name: "David Chen", email: "david@acme.com", role: "Member", status: "Active", joined: "Mar 10, 2024", avatar: "DC" },
];

export default function TeamManagementPage() {
  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Team Management</h1>
          <p className="text-on-surface-variant mt-2">Manage your workspace collaborators and their access levels.</p>
        </div>
        <button className="primary-gradient text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary-container/20">
          <UserPlus size={18} />
          Invite Member
        </button>
      </div>

      {/* Pending Invites */}
      <div className="p-6 glass-panel rounded-2xl border-warning/20 bg-warning/5 space-y-4">
        <h3 className="text-[10px] font-bold text-warning uppercase tracking-widest flex items-center gap-2">
          <Mail size={12} />
          Pending Invitations (1)
        </h3>
        <div className="flex items-center justify-between p-3 bg-background-deep/50 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
              ?
            </div>
            <div>
              <p className="text-sm font-medium text-white">mark@competitor.com</p>
              <p className="text-[10px] text-on-surface-variant">Invited as Member · 2 days ago</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest px-3 py-1">Resend</button>
            <button className="text-[10px] font-bold text-error hover:underline uppercase tracking-widest px-3 py-1">Revoke</button>
          </div>
        </div>
      </div>

      {/* Active Members Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Active Members</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={14} />
            <input type="text" placeholder="Filter team..." className="bg-white/2 border border-white/5 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white outline-none focus:border-primary/50" />
          </div>
        </div>

        <div className="bg-surface-card border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/2">
              <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5">
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {members.map((member) => (
                <tr key={member.email} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-mono">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {member.role === "Admin" ? (
                        <ShieldCheck size={14} className="text-primary" />
                      ) : (
                        <User size={14} className="text-on-surface-variant" />
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        member.role === "Admin" ? "text-primary" : "text-on-surface-variant"
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success" />
                      <span className="text-xs text-on-surface-variant">{member.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant">
                    {member.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-on-surface-variant hover:text-white">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 glass-panel rounded-2xl border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck size={18} />
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Administrator</h4>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Full access to all system features including billing, API keys, and team management.
          </p>
        </div>
        <div className="p-6 glass-panel rounded-2xl border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <User size={18} />
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Member</h4>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Can manage documents, test in playgrounds, and view conversations. No access to settings or billing.
          </p>
        </div>
      </div>
    </div>
  );
}
