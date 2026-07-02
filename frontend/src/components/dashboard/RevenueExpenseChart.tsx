"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export type ChartData = {
  name: string;
  revenue: number;
  expenses: number;
}

type Props = {
  data: ChartData[];
  currency?: string;
}

export default function RevenueExpenseChart({ data, currency = '₦' }: Props) {
  if (!data || data.length === 0) {
    return <div className="text-slate-500 h-full flex items-center justify-center">No chart data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          width={60}
          tickFormatter={(value) => `${currency}${Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`}
        />
        <Tooltip 
          cursor={{ fill: '#ffffff05' }}
          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
        <Bar 
          dataKey="revenue" 
          name="Revenue"
          fill="#f59e0b" // amber-500
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
        <Bar 
          dataKey="expenses" 
          name="Expenses"
          fill="#10b981" // emerald-500
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
