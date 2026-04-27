import { UsageChart } from "@/components/analytics/UsageChart";
import { TopQuestionsTable } from "@/components/analytics/TopQuestionsTable";
import { Zap, FileText, MessageSquare, Cpu, CheckCircle2, Clock } from "lucide-react";

const stats = [
  { label: "Total Queries", value: "12,847", change: "+12.5%", icon: Zap, color: "text-primary" },
  { label: "Documents", value: "34", sub: "5 processing", icon: FileText, color: "text-success" },
  { label: "Conversations", value: "892", change: "+8.3%", icon: MessageSquare, color: "text-secondary" },
  { label: "Token Usage", value: "67%", sub: "67,240 / 100k", icon: Cpu, color: "text-warning" },
];

export default function TenantDashboardPage() {
  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, Jeff</h1>
        <p className="text-on-surface-variant mt-2">Here is what's happening with your knowledge base today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="p-6 glass-panel rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-white/5 ${s.color}`}>
                <s.icon size={20} />
              </div>
              {s.change && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-success/10 text-success uppercase">
                  {s.change}
                </span>
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{s.value}</h3>
              {s.sub && <p className="text-[10px] text-on-surface-variant mt-1">{s.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-8 p-8 glass-panel rounded-2xl space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Query Volume</h3>
          <UsageChart />
        </div>

        {/* Top Questions */}
        <div className="lg:col-span-4 p-8 glass-panel rounded-2xl space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Top Questions</h3>
          <TopQuestionsTable />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Conversations */}
        <div className="lg:col-span-8 p-8 glass-panel rounded-2xl space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Recent Conversations</h3>
          <div className="overflow-hidden border border-white/5 rounded-xl bg-white/2">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-on-surface-variant font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3">Session</th>
                  <th className="px-4 py-3">Last Message</th>
                  <th className="px-4 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: "#92A1", msg: "Integration error on...", time: "2m ago" },
                  { id: "#91C4", msg: "Pricing details for...", time: "15m ago" },
                  { id: "#88F2", msg: "How to add more...", time: "1h ago" },
                ].map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-all cursor-pointer">
                    <td className="px-4 py-3 font-mono text-primary">{c.id}</td>
                    <td className="px-4 py-3 text-white truncate max-w-[200px]">{c.msg}</td>
                    <td className="px-4 py-3 text-right text-on-surface-variant flex items-center justify-end gap-1">
                      <Clock size={10} /> {c.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Status */}
        <div className="lg:col-span-4 p-8 glass-panel rounded-2xl space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">System Status</h3>
          <div className="space-y-4">
            {[
              "API Server",
              "RAG Engine",
              "Vector Database",
              "LLM Provider"
            ].map((node) => (
              <div key={node} className="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5">
                <span className="text-xs font-medium text-white">{node}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-success uppercase">Operational</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_#10b981]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
