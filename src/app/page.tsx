import { useMemo } from "react";

import { CashflowChart } from "../components/charts/CashflowChart";
import { GlassCard } from "../components/ui/GlassCard";
import { Sidebar } from "../components/ui/Sidebar";
import { MOCK_TRANSACTIONS } from "../data/mockTransactions";

export default function Page() {
  const stats = useMemo(() => {
    const income = MOCK_TRANSACTIONS
      .filter((transaction) => transaction.type === "venit")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expense = MOCK_TRANSACTIONS
      .filter((transaction) => transaction.type === "cheltuiala")
      .reduce((total, transaction) => total + transaction.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, []);

  const health =
    stats.income > 0
      ? stats.expense / stats.income < 0.5
        ? { label: "Strong", color: "text-emerald-400" }
        : stats.expense / stats.income < 0.8
          ? { label: "Stable", color: "text-blue-400" }
          : { label: "Risk", color: "text-red-400" }
      : { label: "No data", color: "text-gray-400" };

  return (
    <div className="flex min-h-screen bg-[#0B1220] text-white">
      <Sidebar />

      <div className="flex-1 space-y-6 p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <GlassCard
            label="Venituri"
            value={stats.income}
            color="text-emerald-400"
          />

          <GlassCard
            label="Cheltuieli"
            value={stats.expense}
            color="text-red-400"
          />

          <GlassCard
            label="Sold"
            value={stats.balance}
            color="text-blue-400"
          />
        </div>

        <div
          className={`w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 ${health.color}`}
        >
          {health.label}
        </div>

        <CashflowChart transactions={MOCK_TRANSACTIONS} />
      </div>
    </div>
  );
}