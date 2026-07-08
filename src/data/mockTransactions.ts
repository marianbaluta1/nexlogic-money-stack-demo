import type { Transaction } from "../types/transactions";

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    accountId: "client-1-bt",
    amount: 2500,
    description: "Salariu",
    date: "2026-07-01",
    category: "Venit",
    type: "venit",
  },
  {
    id: "t2",
    accountId: "client-1-raiffeisen",
    amount: 150,
    description: "Mega Image",
    date: "2026-07-02",
    category: "Cumparaturi",
    type: "cheltuiala",
  },
  {
    id: "t3",
    accountId: "client-1-revolut",
    amount: 45,
    description: "Bolt",
    date: "2026-07-03",
    category: "Transport",
    type: "cheltuiala",
  },
  {
    id: "t4",
    accountId: "client-2-bt",
    amount: 220,
    description: "Petrom",
    date: "2026-07-04",
    category: "Carburant",
    type: "cheltuiala",
  },
  {
    id: "t5",
    accountId: "cash-casa",
    amount: 80,
    description: "Piata",
    date: "2026-07-05",
    category: "Mancare",
    type: "cheltuiala",
  },
];