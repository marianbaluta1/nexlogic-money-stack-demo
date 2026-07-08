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

  if (normalizedCategory.includes('salariu')) {
    return 'S';
  }

  if (normalizedCategory.includes('cumparaturi')) {
    return 'C';
  }

  if (normalizedCategory.includes('transport')) {
    return 'T';
  }

  if (normalizedCategory.includes('utilitati')) {
    return 'U';
  }

  if (normalizedCategory.includes('abonament')) {
    return 'A';
  }

  return category.slice(0, 1).toUpperCase();
}

function getWeekBars(income: number, expense: number) {
  const maxValue = Math.max(income, expense, 1);

  return [
    {
      label: 'Venituri',
      value: income,
      height: Math.max(22, Math.round((income / maxValue) * 92)),
      colorClass: 'bg-emerald-400',
    },
    {
      label: 'Cheltuieli',
      value: expense,
      height: Math.max(22, Math.round((expense / maxValue) * 92)),
      colorClass: 'bg-rose-400',
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
  const recentTransactions = transactions.slice(0, 4);
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

  const firstUpcomingBill = unpaidBills[0];
  const firstUpcomingSubscription = activeSubscriptions[0];

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-5 rounded-[2rem] border border-white/10 bg-slate-100 p-4 text-slate-950 shadow-2xl shadow-black/30 md:max-w-5xl md:p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Nexlogic
          </p>

          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            Money
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg shadow-lg shadow-slate-300/60"
            aria-label="Notificari"
          >
            •
          </button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-400/60"
            aria-label="Profil"
          >
            NM
          </button>
        </div>
      </header>

      <div className="relative overflow-hidden rounded-[2rem] py-4">
        <div className="absolute left-0 top-8 hidden h-40 w-44 rotate-[-8deg] rounded-[1.75rem] bg-emerald-700/90 p-5 text-white shadow-xl shadow-emerald-900/20 md:block">
          <p className="text-xs text-emerald-100">Safe to Spend</p>

          <p className="mt-3 text-xl font-black">
            {formatCurrency(safeToSpend)}
          </p>

          <p className="mt-10 text-xs text-emerald-100">dupa cheltuieli</p>
        </div>

        <div className="absolute right-0 top-8 hidden h-40 w-44 rotate-[8deg] rounded-[1.75rem] bg-white p-5 text-slate-950 shadow-xl shadow-slate-300/70 md:block">
          <p className="text-xs text-slate-500">Cont principal</p>

          <p className="mt-3 text-xl font-black">
            {formatCurrency(mainAccountBalance)}
          </p>

          <p className="mt-10 text-xs text-slate-500">sold estimat demo</p>
        </div>

        <div className="relative z-10 mx-auto max-w-sm rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/40">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Sold disponibil</p>

            <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              +12% saptamana
            </div>
          </div>

          <p className="mt-5 text-4xl font-black tracking-tight">
            {formatCurrency(totalAvailableBalance)}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Include conturi, carduri si tranzactii demo.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs text-slate-400">Venituri</p>

              <p className="mt-2 text-lg font-bold text-emerald-300">
                {formatCurrency(income)}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs text-slate-400">Cheltuieli</p>

              <p className="mt-2 text-lg font-bold text-rose-300">
                {formatCurrency(expense)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onQuickAddTransaction}
        className="flex w-full items-center gap-4 rounded-[1.75rem] bg-emerald-700 p-5 text-left text-white shadow-xl shadow-emerald-800/20 transition hover:bg-emerald-800"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-black text-emerald-700">
          +
        </span>

        <span>
          <span className="block text-base font-black">Adauga tranzactie</span>

          <span className="mt-1 block text-sm text-emerald-100">
            Inregistreaza rapid o cheltuiala sau un venit.
          </span>
        </span>
      </button>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[1.75rem] bg-white p-5 shadow-xl shadow-slate-300/60">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                Tranzactii recente
              </h3>

              <p className="text-sm text-slate-500">
                Ultimele miscari din demo.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenTransactions}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Vezi toate
            </button>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((transaction) => {
              const isIncome = transaction.type === 'venit';

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-700">
                      {getTransactionIcon(transaction.category)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {transaction.description}
                      </p>

                      <p className="text-xs text-slate-500">
                        {transaction.category} •{' '}
                        {formatShortDate(transaction.date)}
                      </p>
                    </div>
                  </div>

                  <p
                    className={
                      isIncome
                        ? 'shrink-0 text-sm font-black text-emerald-600'
                        : 'shrink-0 text-sm font-black text-rose-500'
                    }
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </article>

        <div className="grid grid-cols-1 gap-5">
          <article className="rounded-[1.75rem] bg-white p-5 shadow-xl shadow-slate-300/60">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-950">
                  Saptamana asta
                </h3>

                <p className="text-sm text-slate-500">Venituri vs cheltuieli</p>
              </div>

              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Demo
              </div>
            </div>

            <div className="mt-5 flex h-32 items-end justify-center gap-5 rounded-[1.25rem] bg-slate-100 px-5 py-4">
              {weekBars.map((bar) => (
                <div
                  key={bar.label}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`w-10 rounded-full ${bar.colorClass}`}
                    style={{ height: `${bar.height}px` }}
                    title={`${bar.label}: ${formatCurrency(bar.value)}`}
                  />

                  <p className="text-xs font-bold text-slate-500">
                    {bar.label.slice(0, 3)}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black">Facturi apropiate</h3>

                <p className="mt-2 text-sm leading-5 text-slate-400">
                  {upcomingCount > 0
                    ? `${upcomingCount} plati urmarite, total ${formatCurrency(
                        upcomingTotal
                      )}.`
                    : 'Nu exista plati apropiate in demo.'}
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-lg font-black text-emerald-300">
                !
              </div>
            </div>

            {firstUpcomingBill && (
              <div className="mt-4 rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-slate-400">Factura urmatoare</p>

                <p className="mt-1 text-sm font-bold">
                  {firstUpcomingBill.provider} •{' '}
                  {formatCurrency(firstUpcomingBill.amount)}
                </p>
              </div>
            )}

            {!firstUpcomingBill && firstUpcomingSubscription && (
              <div className="mt-4 rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-slate-400">Abonament urmator</p>

                <p className="mt-1 text-sm font-bold">
                  {firstUpcomingSubscription.name} •{' '}
                  {formatCurrency(firstUpcomingSubscription.amount)}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onOpenBills}
              className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-200"
            >
              Vezi facturi
            </button>
          </article>
        </div>
      </div>

      <nav className="grid grid-cols-5 items-center rounded-[1.75rem] bg-white p-2 shadow-xl shadow-slate-300/60 lg:hidden">
        <button
          type="button"
          className="rounded-2xl px-2 py-3 text-xs font-black text-emerald-700"
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={onOpenTransactions}
          className="rounded-2xl px-2 py-3 text-xs font-bold text-slate-500"
        >
          Tranzactii
        </button>

        <button
          type="button"
          onClick={onQuickAddTransaction}
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-xl font-black text-white shadow-lg shadow-emerald-800/30"
        >
          +
        </button>

        <button
          type="button"
          onClick={onOpenBills}
          className="rounded-2xl px-2 py-3 text-xs font-bold text-slate-500"
        >
          Planificare
        </button>

        <button
          type="button"
          className="rounded-2xl px-2 py-3 text-xs font-bold text-slate-500"
        >
          Conturi
        </button>
      </nav>
    </section>
  );
}
