"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export type ExpenseCategoryData = {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

export default function ExpenseBreakdown({ data }: { data: ExpenseCategoryData[] }) {
  if (!data || data.length === 0) {
    return <div className="text-slate-500 h-full flex items-center justify-center">No expense data available.</div>;
  }

  // Assign colors if not provided
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
          itemStyle={{ color: '#fff' }}
          formatter={(value: number) => `₦${value.toLocaleString()}`}
        />
        <Legend 
          layout="vertical" 
          verticalAlign="bottom" 
          align="center"
          iconType="circle"
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
