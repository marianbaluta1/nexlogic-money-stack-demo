import type { Transaction } from "../types";

type Props = {
  transactions: Transaction[];
};

export function SummaryCard({ transactions }: Props) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  const savingsRate =
    income > 0 ? ((balance / income) * 100).toFixed(1) : "0";

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const status =
    balance >= 0 ? "Sănătos financiar" : "Atenție la cheltuieli";

  const statusColor = balance >= 0 ? "#22C55E" : "#F43F5E";

  return (
    <div style={styles.grid}>
      <div style={{ ...styles.card, borderColor: "#22C55E" }}>
        <p>Venituri</p>
        <h2 style={{ color: "#22C55E" }}>
          {formatMoney(income)} RON
        </h2>
      </div>

      <div style={{ ...styles.card, borderColor: "#F43F5E" }}>
        <p>Cheltuieli</p>
        <h2 style={{ color: "#F43F5E" }}>
          {formatMoney(expense)} RON
        </h2>
      </div>

      <div style={{ ...styles.card, borderColor: "#38BDF8" }}>
        <p>Sold</p>
        <h2 style={{ color: "#38BDF8" }}>
          {formatMoney(balance)} RON
        </h2>
      </div>

      <div style={{ ...styles.card, borderColor: statusColor }}>
        <p>Status financiar</p>
        <h3 style={{ color: statusColor }}>{status}</h3>
        <p style={{ opacity: 0.7 }}>
          Rată economisire: {savingsRate}%
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 15,
  },

  card: {
    padding: 16,
    borderRadius: 22,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(14px)",
  },
};