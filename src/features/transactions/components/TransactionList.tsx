import type { Transaction } from "../../../types/transactions";

type TransactionListProps = {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
};

const ACCOUNT_LABELS: Record<string, string> = {
  "client-1-raiffeisen": "Client 1 Raiffeisen",
  "client-1-bt": "Client 1 Banca Transilvania",
  "client-1-revolut": "Client 1 Revolut",
  "client-2-raiffeisen": "Client 2 Raiffeisen",
  "client-2-bt": "Client 2 Banca Transilvania",
  "client-2-revolut": "Client 2 Revolut",
  "cash-casa": "Cash casa",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getTransactionTypeLabel(type: Transaction["type"]) {
  return type === "venit" ? "Venit" : "Cheltuiala";
}

function getTransactionTypeColor(type: Transaction["type"]) {
  return type === "venit" ? "text-emerald-400" : "text-red-400";
}

function getTransactionSign(type: Transaction["type"]) {
  return type === "venit" ? "+" : "-";
}

function getAccountLabel(accountId: string) {
  return ACCOUNT_LABELS[accountId] ?? "Cont necunoscut";
}

export function TransactionList({
  transactions,
  onDelete,
  onEdit,
}: TransactionListProps) {
  const latestTransactions = transactions.slice(0, 8);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Tranzactii recente
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Ultimele miscari inregistrate in dashboard.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {latestTransactions.length} active
        </div>
      </div>

      {latestTransactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
          Nu exista tranzactii inregistrate.
        </div>
      ) : (
        <div className="space-y-3">
          {latestTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      transaction.type === "venit"
                        ? "bg-emerald-400"
                        : "bg-red-400"
                    }`}
                  />

                  <p className="truncate font-medium text-slate-100">
                    {transaction.description}
                  </p>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  {getTransactionTypeLabel(transaction.type)} •{" "}
                  {transaction.category} • {transaction.date}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Cont: {getAccountLabel(transaction.accountId)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="text-right">
                  <p
                    className={`font-semibold ${getTransactionTypeColor(
                      transaction.type
                    )}`}
                  >
                    {getTransactionSign(transaction.type)}
                    {formatMoney(transaction.amount)} RON
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {onEdit ? (
                    <button
                      type="button"
                      onClick={() => onEdit(transaction)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300"
                    >
                      Editeaza
                    </button>
                  ) : null}

                  {onDelete ? (
                    <button
                      type="button"
                      onClick={() => onDelete(transaction.id)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                    >
                      Sterge
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}