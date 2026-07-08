import type { Bill, Subscription } from '../../../types/billing';
import type { Transaction } from '../../../types/transactions';

type PremiumMobileDashboardProps = {
  income: number;
  expense: number;
  totalAvailableBalance: number;
  transactions: Transaction[];
  bills: Bill[];
  subscriptions: Subscription[];
  onOpenTransactions: () => void;
  onOpenBills: () => void;
  onQuickAddTransaction: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat('ro-RO', {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatShortDate(value: string) {
  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

function getTransactionIcon(category: string) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes('salariu')) return 'S';
  if (normalizedCategory.includes('cumparaturi')) return 'C';
  if (normalizedCategory.includes('utilitati')) return 'U';
  if (normalizedCategory.includes('transport')) return 'T';
  if (normalizedCategory.includes('abonament')) return 'A';
  if (normalizedCategory.includes('transfer')) return '↔';

  return category.slice(0, 1).toUpperCase();
}

function getWeekBars(income: number, expense: number) {
  const maxValue = Math.max(income, expense, 1);

  return [
    {
      day: 'L',
      incomeHeight: Math.max(22, Math.round((income / maxValue) * 86)),
      expenseHeight: Math.max(16, Math.round((expense / maxValue) * 58)),
    },
    {
      day: 'M',
      incomeHeight: Math.max(22, Math.round(((income * 0.72) / maxValue) * 86)),
      expenseHeight: Math.max(
        16,
        Math.round(((expense * 0.9) / maxValue) * 58)
      ),
    },
    {
      day: 'M',
      incomeHeight: Math.max(22, Math.round(((income * 0.56) / maxValue) * 86)),
      expenseHeight: Math.max(
        16,
        Math.round(((expense * 0.65) / maxValue) * 58)
      ),
    },
    {
      day: 'J',
      incomeHeight: Math.max(22, Math.round(((income * 0.42) / maxValue) * 86)),
      expenseHeight: Math.max(
        16,
        Math.round(((expense * 0.5) / maxValue) * 58)
      ),
    },
    {
      day: 'V',
      incomeHeight: Math.max(22, Math.round(((income * 0.86) / maxValue) * 86)),
      expenseHeight: Math.max(
        16,
        Math.round(((expense * 0.8) / maxValue) * 58)
      ),
    },
    {
      day: 'S',
      incomeHeight: Math.max(22, Math.round(((income * 0.66) / maxValue) * 86)),
      expenseHeight: Math.max(
        16,
        Math.round(((expense * 0.7) / maxValue) * 58)
      ),
    },
    {
      day: 'D',
      incomeHeight: 22,
      expenseHeight: 16,
    },
  ];
}

export function PremiumMobileDashboard({
  income,
  expense,
  totalAvailableBalance,
  transactions,
  bills,
  subscriptions,
  onOpenTransactions,
  onOpenBills,
  onQuickAddTransaction,
}: PremiumMobileDashboardProps) {
  const safeToSpend = Math.max(totalAvailableBalance - expense * 0.25, 0);
  const mainAccountBalance = Math.max(totalAvailableBalance * 0.62, 0);
  const recentTransactions = transactions.slice(0, 5);
  const weekBars = getWeekBars(income, expense);

  const unpaidBills = bills.filter((bill) => bill.status !== 'platita');
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === 'activ'
  );

  const upcomingTotal = [
    ...unpaidBills.map((bill) => bill.amount),
    ...activeSubscriptions.map((subscription) => subscription.amount),
  ].reduce((total, amount) => total + amount, 0);

  const upcomingCount = unpaidBills.length + activeSubscriptions.length;

  return (
    <section className="min-h-screen bg-slate-200 px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex items-center justify-between rounded-[2rem] bg-white/70 px-5 py-4 shadow-xl shadow-slate-300/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-emerald-300 shadow-lg shadow-slate-400/60">
              N
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-900">
                Nexlogic
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                Money
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg shadow-lg shadow-slate-300/70"
              aria-label="Notificari"
            >
              !
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-emerald-600" />
            </button>

            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-300/70"
              aria-label="Profil"
            >
              NM
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.7fr_1.25fr_0.7fr] lg:items-center">
              <article className="order-2 rounded-[1.7rem] bg-slate-800 p-5 text-white shadow-xl shadow-slate-400/40 lg:order-1">
                <p className="text-sm text-white/70">Safe to Spend</p>

                <p className="mt-5 text-3xl font-semibold tracking-tight">
                  {formatCompactCurrency(safeToSpend)}
                </p>

                <p className="mt-1 text-sm text-white/70">
                  RON dupa cheltuieli
                </p>

                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-lg font-black text-white">
                  💳
                </div>
              </article>

              <article className="order-1 relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-500/50 lg:order-2 lg:min-h-[290px] lg:p-8">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[5rem] bg-orange-400/20" />
                <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-emerald-800/80 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-300">Sold disponibil</p>

                      <p className="mt-6 text-5xl font-semibold leading-none tracking-tight sm:text-6xl">
                        {formatCompactCurrency(totalAvailableBalance)}
                      </p>

                      <p className="mt-2 text-xl text-slate-300">RON</p>
                    </div>

                    <span className="text-xl text-slate-300">◉</span>
                  </div>

                  <div className="mt-6 w-fit rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-300">
                    ↑ +12% fata de saptamana trecuta
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-slate-400">Venituri</p>

                      <p className="mt-2 text-xl font-bold text-emerald-300">
                        {formatCurrency(income)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-slate-400">Cheltuieli</p>

                      <p className="mt-2 text-xl font-bold text-rose-300">
                        {formatCurrency(expense)}
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="order-3 rounded-[1.7rem] bg-white p-5 text-slate-950 shadow-xl shadow-slate-300/70">
                <p className="text-sm text-slate-500">Cont principal</p>

                <p className="mt-5 text-3xl font-semibold tracking-tight">
                  {formatCompactCurrency(mainAccountBalance)}
                </p>

                <p className="mt-1 text-sm text-slate-500">RON sold estimat</p>

                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-800 text-lg font-black text-white">
                  🏦
                </div>
              </article>
            </div>

            <div className="flex items-center justify-center gap-2 lg:hidden">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>

            <button
              type="button"
              onClick={onQuickAddTransaction}
              className="flex w-full items-center justify-between rounded-[1.7rem] bg-emerald-800 px-5 py-5 text-left text-white shadow-xl shadow-emerald-900/25 transition hover:bg-emerald-900"
            >
              <span className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 text-3xl">
                  +
                </span>

                <span>
                  <span className="block text-xl font-semibold">
                    Adauga tranzactie
                  </span>

                  <span className="mt-1 block text-sm text-emerald-100">
                    Inregistreaza rapid o cheltuiala sau un venit
                  </span>
                </span>
              </span>

              <span className="text-3xl">›</span>
            </button>

            <article className="rounded-[1.7rem] bg-white p-5 shadow-xl shadow-slate-300/60">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-950">
                  Saptamana asta
                </h2>

                <p className="text-sm font-semibold text-emerald-900">
                  6 – 12 mai
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[0.8fr_1.2fr_0.8fr] md:items-end">
                <div>
                  <p className="text-sm text-slate-600">Venituri</p>

                  <p className="mt-2 text-2xl font-semibold text-emerald-700">
                    {formatCurrency(income)}
                  </p>

                  <p className="mt-2 w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    ↑ 12%
                  </p>
                </div>

                <div className="flex h-32 items-end justify-center gap-3 rounded-[1.5rem] bg-slate-100 px-4 py-4">
                  {weekBars.map((bar) => (
                    <div
                      key={bar.day}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="flex h-24 items-end gap-1">
                        <div
                          className="w-2.5 rounded-full bg-emerald-700"
                          style={{ height: `${bar.incomeHeight}px` }}
                        />
                        <div
                          className="w-2.5 rounded-full bg-rose-400"
                          style={{ height: `${bar.expenseHeight}px` }}
                        />
                      </div>

                      <span className="text-xs text-slate-500">{bar.day}</span>
                    </div>
                  ))}
                </div>

                <div className="md:text-right">
                  <p className="text-sm text-slate-600">Cheltuieli</p>

                  <p className="mt-2 text-2xl font-semibold text-rose-500">
                    {formatCurrency(expense)}
                  </p>

                  <p className="mt-2 w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 md:ml-auto">
                    ↓ -8%
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="flex flex-col gap-6">
            <article className="rounded-[1.7rem] bg-white p-5 shadow-xl shadow-slate-300/60">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Tranzactii recente
                  </h2>

                  <p className="text-sm text-slate-500">
                    Ultimele miscari din demo
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenTransactions}
                  className="text-sm font-semibold text-emerald-900"
                >
                  Vezi toate ›
                </button>
              </div>

              <div className="space-y-4">
                {recentTransactions.map((transaction) => {
                  const isIncome = transaction.type === 'venit';

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-black text-white">
                          {getTransactionIcon(transaction.category)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-slate-950">
                            {transaction.description}
                          </p>

                          <p className="truncate text-sm text-slate-500">
                            {transaction.category}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={
                            isIncome
                              ? 'text-base font-semibold text-emerald-700'
                              : 'text-base font-semibold text-rose-500'
                          }
                        >
                          {isIncome ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>

                        <p className="text-xs text-slate-500">
                          {formatShortDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="flex items-center justify-between gap-4 rounded-[1.7rem] bg-white p-5 shadow-xl shadow-slate-300/60">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xl text-white">
                  📅
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Facturi apropiate
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    Ai {upcomingCount} plati in valoare totala de{' '}
                    {formatCurrency(upcomingTotal)}
                  </p>

                  <p className="text-sm text-slate-500">
                    Scad in urmatoarele zile
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenBills}
                className="rounded-full border border-emerald-800 px-4 py-2 text-sm font-semibold text-emerald-900"
              >
                Vezi
              </button>
            </article>
          </div>
        </div>

        <nav className="sticky bottom-4 z-20 grid grid-cols-5 items-center rounded-[2rem] bg-white px-3 py-3 shadow-2xl shadow-slate-400/60 lg:hidden">
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-xs font-semibold text-emerald-800"
          >
            <span className="text-xl">⌂</span>
            Dashboard
          </button>

          <button
            type="button"
            onClick={onOpenTransactions}
            className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-500"
          >
            <span className="text-xl">≡</span>
            Tranzactii
          </button>

          <button
            type="button"
            onClick={onQuickAddTransaction}
            className="-mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-800 text-4xl font-light text-white shadow-xl shadow-emerald-900/30"
          >
            +
          </button>

          <button
            type="button"
            onClick={onOpenBills}
            className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-500"
          >
            <span className="text-xl">◔</span>
            Planificare
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-500"
          >
            <span className="text-xl">▣</span>
            Conturi
          </button>
        </nav>
      </div>
    </section>
  );
}
