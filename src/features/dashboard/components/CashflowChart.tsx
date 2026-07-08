import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import type { Transaction } from "../../transactions/types";

type Props = {
  transactions: Transaction[];
};

export function CashflowChart({ transactions }: Props) {
  const data = transactions.reduce<any[]>((acc, t) => {
    const last = acc[acc.length - 1];

    if (!last || last.name !== t.label) {
      acc.push({
        name: t.label,
        income: t.type === "income" ? t.amount : 0,
        expense: t.type === "expense" ? t.amount : 0,
      });
    } else {
      if (t.type === "income") last.income += t.amount;
      if (t.type === "expense") last.expense += t.amount;
    }

    return acc;
  }, []);

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />

          <Tooltip />

          {/* INCOME */}
          <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`i-${index}`} />
            ))}
          </Bar>

          {/* EXPENSE */}
          <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`e-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}