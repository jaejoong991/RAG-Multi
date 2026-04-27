"use client";

import { UsageChart } from "@/components/analytics/UsageChart";
import { Users, Activity, BarChart3, TrendingUp, PieChart, ArrowUpRight, Zap } from "lucide-react";
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const pieData = [
  { name: "Enterprise", value: 3, color: "#7C3AED" },
  { name: "Business", value: 5, color: "#3B82F6" },
  { name: "Pro", value: 4, color: "#adc6ff" },
];

const barData = [
  { name: "Acme Corp", queries: 3240 },
  { name: "TechStart", queries: 12400 },
  { name: "Nebula AI", queries: 8900 },
  { name: "Fast-AI", queries: 4100 },
];

export default function PlatformAnalyticsPage() {
  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Platform Analytics</h1>
        <p className="text-on-surface-variant mt-2">Global system health and revenue performance metrics.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Active Tenants", value: "10", sub: "+2 this month", icon: Users, color: "text-primary" },
          { label: "Total Queries", value: "45,230", sub: "+22% volume", icon: Activity, color: "text-secondary" },
          { label: "Platform Uptime", value: "99.97%", sub: "Last 30 days", icon: Zap, color: "text-success" },
          { label: "Total MRR", value: "$1,247", sub: "+$198 growth", icon: TrendingUp, color: "text-primary" },
          { label: "Churn Rate", value: "0%", sub: "Stable", icon: PieChart, color: "text-success" },
        ].map((stat) => (
          <div key={stat.label} className="p-5 glass-panel rounded-xl space-y-3">
            <div className={`p-1.5 rounded-lg bg-white/5 w-fit ${stat.color}`}>
              <stat.icon size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">{stat.label}</p>
              <h3 className="text-xl font-bold text-white mt-1">{stat.value}</h3>
              <p className="text-[9px] text-on-surface-variant mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-8 p-8 glass-panel rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Revenue Growth</h3>
            <span className="text-[10px] font-bold text-success flex items-center gap-1 uppercase tracking-widest bg-success/10 px-2 py-1 rounded">
              <ArrowUpRight size={12} /> +18.4% MRR
            </span>
          </div>
          <UsageChart />
        </div>

        {/* Distribution Donut */}
        <div className="lg:col-span-4 p-8 glass-panel rounded-2xl space-y-8 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest self-start">Tier Distribution</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px" }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2 text-on-surface-variant">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="text-white">{item.value} Tenants</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Query Volume by Tenant */}
      <div className="p-8 glass-panel rounded-2xl space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Top Tenants by Volume</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#958da1", fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#958da1", fontSize: 10 }} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px" }} />
              <Bar dataKey="queries" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
