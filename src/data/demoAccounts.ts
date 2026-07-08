import type { Account } from "../types/accounts";
import type { Transaction } from "../types/transactions";

export type DemoAccountWithCurrentBalance = Account & {
  currentBalance: number;
};

export const DEMO_ACCOUNTS: Account[] = [
  {
    id: "client-1-raiffeisen",
    name: "Client 1 Raiffeisen",
    type: "Card debit",
    balance: 1250,
    bank: "Raiffeisen",
    currency: "RON",
  },
  {
    id: "client-1-bt",
    name: "Client 1 Banca Transilvania",
    type: "Card debit",
    balance: 2200,
    bank: "Banca Transilvania",
    currency: "RON",
  },
  {
    id: "client-1-revolut",
    name: "Client 1 Revolut",
    type: "Card digital",
    balance: 480,
    bank: "Revolut",
    currency: "RON",
  },
  {
    id: "client-2-raiffeisen",
    name: "Client 2 Raiffeisen",
    type: "Card debit",
    balance: 980,
    bank: "Raiffeisen",
    currency: "RON",
  },
  {
    id: "client-2-bt",
    name: "Client 2 Banca Transilvania",
    type: "Card debit",
    balance: 1750,
    bank: "Banca Transilvania",
    currency: "RON",
  },
  {
    id: "client-2-revolut",
    name: "Client 2 Revolut",
    type: "Card digital",
    balance: 620,
    bank: "Revolut",
    currency: "RON",
  },
  {
    id: "cash-casa",
    name: "Cash casa",
    type: "Cash",
    balance: 350,
    bank: "Numerar",
    currency: "RON",
  },
];

export function getDemoAccountLabel(accountId: string) {
  const account = DEMO_ACCOUNTS.find(
    (currentAccount) => currentAccount.id === accountId
  );

  return account?.name ?? "Cont necunoscut";
}

export function getDemoAccountsWithCurrentBalance(
  transactions: Transaction[]
): DemoAccountWithCurrentBalance[] {
  return DEMO_ACCOUNTS.map((account) => {
    const accountTransactions = transactions.filter(
      (transaction) => transaction.accountId === account.id
    );

    const transactionsBalance = accountTransactions.reduce(
      (total, transaction) => {
        if (transaction.type === "venit") {
          return total + transaction.amount;
        }

        return total - transaction.amount;
      },
      0
    );

    return {
      ...account,
      currentBalance: account.balance + transactionsBalance,
    };
  });
}

export function getTotalAvailableBalance(transactions: Transaction[]) {
  return getDemoAccountsWithCurrentBalance(transactions).reduce(
    (total, account) => total + account.currentBalance,
    0
  );
}