import React from "react";

import { DEMO_ACCOUNTS } from "../../../data/demoAccounts";
import type { Transaction } from "../../../types/transactions";
import { AccountCard } from "./AccountCard";

type AccountsGridProps = {
  transactions: Transaction[];
};

export const AccountsGrid: React.FC<AccountsGridProps> = ({ transactions }) => {
  const accountsWithCurrentBalance = DEMO_ACCOUNTS.map((account) => {
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

  const totalBalance = accountsWithCurrentBalance.reduce(
    (total, account) => total + account.currentBalance,
    0
  );

  const formattedTotalBalance = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 0,
  }).format(totalBalance);

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h2 className="text-xl font-semibold text-slate-200">
            Conturile mele
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Solduri calculate din sold initial demo plus tranzactiile adaugate.
          </p>
        </div>

        <div className="w-fit rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-300/80">
            Total disponibil calculat
          </p>

          <p className="mt-1 text-lg font-bold text-emerald-300">
            {formattedTotalBalance}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {accountsWithCurrentBalance.map((account) => (
          <AccountCard
            key={account.id}
            name={account.name}
            type={account.type}
            balance={account.currentBalance}
            bank={account.bank}
          />
        ))}
      </div>
    </section>
  );
};