"use client";

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export type Scenario = {
  name: string;
  projectedRevenue: number;
  projectedExpense: number;
  type: 'base' | 'upside' | 'downside';
}

type Props = {
  scenarios: Scenario[];
  currency?: string;
}

export default function ScenarioPlanning({ scenarios, currency = '₦' }: Props) {
  if (!scenarios || scenarios.length === 0) {
    return <div className="text-slate-500 py-4 text-center">No scenarios generated yet.</div>;
  }

  return (
    <div className="space-y-4">
      {scenarios.map((scenario) => {
        const netCashFlow = scenario.projectedRevenue - scenario.projectedExpense;
        const Icon = scenario.type === 'upside' ? ArrowUpRight : scenario.type === 'downside' ? ArrowDownRight : Minus;
        const colorClass = scenario.type === 'upside' ? 'text-emerald-400' : scenario.type === 'downside' ? 'text-rose-400' : 'text-slate-400';
        
        return (
          <div key={scenario.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5 ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{scenario.name}</p>
                <p className="text-xs text-slate-400">Net: {currency}{netCashFlow.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-amber-400">Rev: {currency}{scenario.projectedRevenue.toLocaleString()}</p>
              <p className="text-xs text-rose-400">Exp: {currency}{scenario.projectedExpense.toLocaleString()}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
