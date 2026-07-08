export type AccountType =
  | "Cont curent"
  | "Economii"
  | "Card debit"
  | "Card digital"
  | "Card credit"
  | "Cash"
  | "Curent"
  | "Debit"
  | "Credit";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  bank: string;
  currency: string;
}