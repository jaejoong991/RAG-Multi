"use client";

import { UsageChart } from "@/components/analytics/UsageChart";
import { DollarSign, Cpu, Calculator, Info, ArrowRight, Wallet, PieChart } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart as RePieChart, Pie, Cell } from "recharts";

const providerData = [
  { name: "OpenAI", value: 72, color: "#7C3AED" },
  { name: "Gemini", value: 18, color: "#10B981" },
  { name: "Anthropic", value: 8, color: "#3B82F6" },
  { name: "Ollama", value: 2, color: "#958da1" },
];

export default function CostMonitorPage() {
  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">LLM Cost Monitor</h1>
        <p className="text-on-surface-variant mt-2">Granular breakdown of model consumption and infrastructure spend.</p>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total LLM Cost", value: "$347.82", sub: "+18% vs last month", icon: Wallet, color: "text-primary" },
          { label: "Total Tokens", value: "4.2M", sub: "2.8M in / 1.4M out", icon: Cpu, color: "text-secondary" },
          { label: "Avg Cost / Query", value: "$0.0023", sub: "Optimized", icon: Calculator, color: "text-success" },
          { label: "Rev / Cost Ratio", value: "3.6x", sub: "Healthy margin", icon: PieChart, color: "text-warning" },
        ].map((stat) => (
          <div key={stat.label} className="p-6 glass-panel rounded-2xl space-y-4">
            <div className={`p-2 rounded-lg bg-white/5 w-fit ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              <p className="text-[10px] text-on-surface-variant font-medium mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost by Provider Donut */}
        <div className="p-8 glass-panel rounded-2xl space-y-8 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest self-start">Spend by Provider</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={providerData}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {providerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px" }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            {providerData.map((item) => (
              <div key={item.name} className="flex items-center gap-3 p-2 bg-white/2 rounded-lg border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest">{item.name}</p>
                  <p className="text-xs font-mono text-on-surface-variant">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Trend */}
        <div className="lg:col-span-2 p-8 glass-panel rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Cost Projection</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase bg-white/5 px-3 py-1 rounded-full">
              <Info size={12} className="text-primary" />
              Projected end-of-month: $412.00
            </div>
          </div>
          <UsageChart />
        </div>
      </div>

      {/* Cost Detail Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Model Consumption Log</h3>
        <div className="bg-surface-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Model</th>
                <th className="px-6 py-4 text-center">Requests</th>
                <th className="px-6 py-4 text-center">Tokens</th>
                <th className="px-6 py-4 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-on-surface-variant">
              {[
                { name: "Acme Corp", model: "gpt-4o", reqs: "1,240", tokens: "840k", cost: "$24.12" },
                { name: "TechStart", model: "claude-3-opus", reqs: "892", tokens: "1.2M", cost: "$47.20" },
                { name: "Nebula AI", model: "gemini-1.5-pro", reqs: "4,120", tokens: "3.4M", cost: "$12.80" },
                { name: "Fast-AI", model: "gpt-4-turbo", reqs: "560", tokens: "210k", cost: "$8.40" },
              ].map((row) => (
                <tr key={row.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{row.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono">
                      {row.model}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{row.reqs}</td>
                  <td className="px-6 py-4 text-center font-mono">{row.tokens}</td>
                  <td className="px-6 py-4 text-right font-bold text-white">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
