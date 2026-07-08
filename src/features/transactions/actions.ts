import { transactions } from "./data";
import type { Transaction } from "./types";

export function addTransaction(transaction: Transaction) {
  transactions.push(transaction);
}