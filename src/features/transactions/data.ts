import type { Transaction } from "./types";

export const transactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 3000,
    label: "Salariu",
  },
  {
    id: "2",
    type: "income",
    amount: 500,
    label: "Proiecte freelance",
  },
  {
    id: "3",
    type: "expense",
    amount: 700,
    label: "Chirie",
  },
  {
    id: "4",
    type: "expense",
    amount: 300,
    label: "Mâncare",
  },
  {
    id: "5",
    type: "expense",
    amount: 200,
    label: "Facturi",
  },
];