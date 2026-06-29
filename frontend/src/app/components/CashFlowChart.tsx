"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type ChartData = {
  name: string;
  amount: number;
}

export default function CashFlowChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return <div className="text-slate-500">No chart data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => \`₦\${value / 1000}k\`}
        />
        <Tooltip 
          cursor={{ fill: '#ffffff10' }}
          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
        />
        <Bar 
          dataKey="amount" 
          fill="#f59e0b" // amber-500
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
