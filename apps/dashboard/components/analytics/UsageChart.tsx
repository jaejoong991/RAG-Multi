"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { date: "Apr 18", value: 400 },
  { date: "Apr 19", value: 300 },
  { date: "Apr 20", value: 500 },
  { date: "Apr 21", value: 450 },
  { date: "Apr 22", value: 600 },
  { date: "Apr 23", value: 550 },
  { date: "Apr 24", value: 800 },
];

export function UsageChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#958da1", fontSize: 10 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#958da1", fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
            itemStyle={{ color: "#eaddff" }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#7C3AED" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#usageGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
