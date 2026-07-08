export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  label: string;
};