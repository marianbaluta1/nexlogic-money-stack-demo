const transactions = [
  { type: "income", amount: 3000, label: "Salary" },
  { type: "income", amount: 500, label: "Freelance" },
  { type: "expense", amount: 700, label: "Rent" },
  { type: "expense", amount: 300, label: "Food" },
  { type: "expense", amount: 200, label: "Bills" },
];

export function getTransactionsData() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    transactions,
    income,
    expense,
    balance: income - expense,
  };
}