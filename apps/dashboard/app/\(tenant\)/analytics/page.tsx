import { UsageChart } from "@/components/analytics/UsageChart";
import { TopQuestionsTable } from "@/components/analytics/TopQuestionsTable";
import { MessageSquare, Clock, Zap, DollarSign, ArrowUpRight, TrendingUp } from "lucide-react";

const metrics = [
  { label: "Total Queries", value: "12,847", change: "+12.5%", trend: "up", icon: MessageSquare, color: "text-primary" },
  { label: "Avg. Latency", value: "1.3s", change: "-8%", trend: "down", icon: Zap, color: "text-warning" },
  { label: "Resolution Rate", value: "89%", change: "+5.2%", trend: "up", icon: TrendingUp, color: "text-success" },
  { label: "Token Cost", value: "$47.23", change: "+15%", trend: "up", icon: DollarSign, color: "text-secondary" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Usage Analytics</h1>
        <p className="text-on-surface-variant mt-2">
          Monitor your AI assistant performance and platform usage.
        </p>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-6 glass-panel rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-white/5 ${metric.color}`}>
                <metric.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                metric.trend === "up" ? "bg-success/10 text-success" : "bg-error/10 text-error"
              }`}>
                {metric.change}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{metric.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metric.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 p-6 glass-panel rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Query Volume</h3>
            <div className="flex gap-2">
              {["7D", "30D", "90D"].map((tab) => (
                <button key={tab} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  tab === "30D" ? "bg-primary text-white" : "text-on-surface-variant hover:text-white"
                }`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <UsageChart />
        </div>

        {/* Top Questions */}
        <div className="p-6 glass-panel rounded-2xl space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Top Questions</h3>
          <TopQuestionsTable />
          <button className="w-full py-2.5 rounded-lg border border-white/5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hover:bg-white/5 transition-all">
            View Knowledge Gaps
          </button>
        </div>
      </div>
    </div>
  );
}
