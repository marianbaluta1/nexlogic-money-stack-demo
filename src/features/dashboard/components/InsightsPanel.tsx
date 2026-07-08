import type { CSSProperties } from "react";

import type { Transaction } from "../../../types/transactions";

type Props = {
  transactions: Transaction[];
};

export function InsightsPanel({ transactions }: Props) {
  const income = transactions
    .filter((transaction) => transaction.type === "venit")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === "cheltuiala")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expense;

  const topExpense = transactions
    .filter((transaction) => transaction.type === "cheltuiala")
    .sort((first, second) => second.amount - first.amount)[0];

  const expenseRatio = income > 0 ? (expense / income) * 100 : 0;

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const status =
    balance < 0
      ? "Buget negativ"
      : expenseRatio > 80
        ? "Cheltuieli foarte mari"
        : expenseRatio > 50
          ? "Atenție la cheltuieli"
          : "Finanțe stabile";

  const advice =
    balance < 0
      ? "Cheltuiești mai mult decât câștigi. Redu costurile."
      : expenseRatio > 80
        ? "Economisești foarte puțin. Analizează cheltuielile."
        : topExpense
          ? `Cea mai mare cheltuială este: ${topExpense.description}`
          : "Ești pe un drum financiar bun.";

  return (
    <div style={styles.card}>
      <h3>Insights financiare</h3>

      <p style={styles.text}>
        <strong>Status:</strong> {status}
      </p>

      <p style={styles.text}>
        <strong>Venit total:</strong> {formatMoney(income)} RON
      </p>

      <p style={styles.text}>
        <strong>Cheltuieli:</strong> {formatMoney(expense)} RON
      </p>

      <p style={styles.text}>
        <strong>Sold:</strong> {formatMoney(balance)} RON
      </p>

      <p style={styles.text}>
        <strong>Raport cheltuieli:</strong> {expenseRatio.toFixed(1)}%
      </p>

      <div style={styles.advice}>{advice}</div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    marginTop: 20,
    padding: 18,
    borderRadius: 22,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(14px)",
    color: "#F8FAFC",
  },

  text: {
    opacity: 0.85,
    margin: "8px 0",
  },

  advice: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    background: "rgba(56,189,248,0.08)",
    border: "1px solid rgba(56,189,248,0.2)",
  },
};