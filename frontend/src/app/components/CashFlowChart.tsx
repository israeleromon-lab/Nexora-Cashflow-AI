"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type ChartData = {
  name: string;
  amount: number;
}

type Props = {
  data: any[]
  currency?: string
}

export default function CashFlowChart({ data, currency = '₦' }: Props) {
  if (!data || data.length === 0) {
    return <div className="text-slate-500">No chart data available.</div>;
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8' }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8' }} 
            tickFormatter={(value) => `${currency}${value / 1000}k`}
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
