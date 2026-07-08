import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import type { Transaction } from "../../types/transactions";

type Props = {
  transactions: Transaction[];
};

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      name: string;
    };
  }>;
};

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1220] px-3 py-2 text-sm text-white backdrop-blur-xl">
      <div className="mb-1 text-white/60">{payload[0].payload.name}</div>
      <div>Valoare: {payload[0].value} RON</div>
    </div>
  );
}

export function CashflowChart({ transactions }: Props) {
  const income = transactions
    .filter((transaction) => transaction.type === "venit")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === "cheltuiala")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const data = [
    { name: "Venituri", value: income },
    { name: "Cheltuieli", value: expense },
  ];

  return (
    <div className="h-[320px] w-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={40} barGap={10}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />

          <XAxis
            dataKey="name"
            stroke="rgba(255,255,255,0.4)"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="rgba(255,255,255,0.4)"
            tickLine={false}
            axisLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

          <Bar
            dataKey="value"
            radius={[10, 10, 10, 10]}
            fill="rgba(59,130,246,0.85)"
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}