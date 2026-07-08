import { useEffect, useMemo, useState } from 'react';

import { Sidebar } from './components/ui/Sidebar';
import { getTotalAvailableBalance } from './data/demoAccounts';
import { MOCK_BILLS, MOCK_SUBSCRIPTIONS } from './data/mockBilling';
import { MOCK_TRANSACTIONS } from './data/mockTransactions';
import { AccountsGrid } from './features/accounts/components/AccountsGrid';
import { BillingOverview } from './features/billing/components/BillingOverview';
import { PremiumMobileDashboard } from './features/dashboard/components/PremiumMobileDashboard';
import { TransactionForm } from './features/transactions/components/TransactionForm';
import { TransactionList } from './features/transactions/components/TransactionList';
import type { Bill, Subscription } from './types/billing';
import type { Transaction } from './types/transactions';

const TRANSACTIONS_STORAGE_KEY = 'nexlogic-money-transactions';
const BILLS_STORAGE_KEY = 'nexlogic-money-bills';
const SUBSCRIPTIONS_STORAGE_KEY = 'nexlogic-money-subscriptions';

type TransactionFilter = 'toate' | 'venit' | 'cheltuiala';

type AppTab =
  | 'dashboard'
  | 'tranzactii'
  | 'conturi'
  | 'bugete'
  | 'facturi'
  | 'rapoarte'
  | 'obiective'
  | 'setari';

function loadTransactionsFromStorage() {
  try {
    const savedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);

    if (!savedTransactions) {
      return MOCK_TRANSACTIONS;
    }

    const parsedTransactions = JSON.parse(savedTransactions);

    if (!Array.isArray(parsedTransactions)) {
      return MOCK_TRANSACTIONS;
    }

    return parsedTransactions as Transaction[];
  } catch {
    return MOCK_TRANSACTIONS;
  }
}

function loadBillsFromStorage() {
  try {
    const savedBills = localStorage.getItem(BILLS_STORAGE_KEY);

    if (!savedBills) {
      return MOCK_BILLS;
    }

    const parsedBills = JSON.parse(savedBills);

    if (!Array.isArray(parsedBills)) {
      return MOCK_BILLS;
    }

    return parsedBills as Bill[];
  } catch {
    return MOCK_BILLS;
  }
}

function loadSubscriptionsFromStorage() {
  try {
    const savedSubscriptions = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);

    if (!savedSubscriptions) {
      return MOCK_SUBSCRIPTIONS;
    }

    const parsedSubscriptions = JSON.parse(savedSubscriptions);

    if (!Array.isArray(parsedSubscriptions)) {
      return MOCK_SUBSCRIPTIONS;
    }

    return parsedSubscriptions as Subscription[];
  } catch {
    return MOCK_SUBSCRIPTIONS;
  }
}

function saveTransactionsToStorage(transactions: Transaction[]) {
  localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
}

function saveBillsToStorage(bills: Bill[]) {
  localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(bills));
}

function saveSubscriptionsToStorage(subscriptions: Subscription[]) {
  localStorage.setItem(
    SUBSCRIPTIONS_STORAGE_KEY,
    JSON.stringify(subscriptions)
  );
}

function getNextRenewalDate(
  renewalDate: string,
  frequency: Subscription['frequency']
) {
  const date = new Date(`${renewalDate}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return renewalDate;
  }

  if (frequency === 'lunar') {
    date.setMonth(date.getMonth() + 1);
  } else {
    date.setFullYear(date.getFullYear() + 1);
  }

  return date.toISOString().slice(0, 10);
}

function getFilterButtonClass(
  currentFilter: TransactionFilter,
  buttonFilter: TransactionFilter
) {
  const isActive = currentFilter === buttonFilter;

  return isActive
    ? 'rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 shadow-lg shadow-emerald-500/10'
    : 'rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-slate-200';
}

function getTabButtonClass(activeTab: AppTab, buttonTab: AppTab) {
  const isActive = activeTab === buttonTab;

  return isActive
    ? 'rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-300 shadow-lg shadow-emerald-500/10'
    : 'rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-slate-200';
}

function getPageTitle(activeTab: AppTab) {
  if (activeTab === 'tranzactii') return 'Tranzactii personale';
  if (activeTab === 'conturi') return 'Conturi si carduri';
  if (activeTab === 'bugete') return 'Bugete lunare';
  if (activeTab === 'facturi') return 'Facturi si abonamente';
  if (activeTab === 'rapoarte') return 'Rapoarte financiare';
  if (activeTab === 'obiective') return 'Obiective financiare';
  if (activeTab === 'setari') return 'Setari si backup';
  return 'Dashboard premium mobile';
}

function getPageDescription(activeTab: AppTab) {
  if (activeTab === 'tranzactii') {
    return 'Zona separata pentru adaugare, editare, stergere, filtrare si cautare tranzactii.';
  }

  if (activeTab === 'conturi') {
    return 'Zona dedicata pentru solduri separate, conturi, carduri si disponibil total.';
  }

  if (activeTab === 'bugete') {
    return 'Modul pregatit pentru limite lunare, bugete pe categorii si suma ramasa disponibila.';
  }

  if (activeTab === 'facturi') {
    return 'Zona demo pentru facturi, scadente, abonamente si plati urmarite manual.';
  }

  if (activeTab === 'rapoarte') {
    return 'Modul pregatit pentru analiza lunara, categorii, evolutie si comparatii.';
  }

  if (activeTab === 'obiective') {
    return 'Modul pregatit pentru economii, tinte financiare si progres.';
  }

  if (activeTab === 'setari') {
    return 'Modul pregatit pentru backup, export, import si siguranta datelor demo.';
  }

  return 'Dashboard premium mobile.';
}

function WorkInProgressPanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
            Modul in lucru
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">{title}</h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-200 shadow-lg shadow-emerald-500/10">
          Pregatit pentru Sprint urmator
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
          >
            <div className="mb-4 h-10 w-10 rounded-2xl border border-white/10 bg-white/5" />

            <p className="text-sm font-semibold text-slate-200">{item}</p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Acest bloc va fi conectat la date reale/demo intr-un sprint
              dedicat.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(
    loadTransactionsFromStorage
  );

  const [bills, setBills] = useState<Bill[]>(loadBillsFromStorage);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    loadSubscriptionsFromStorage
  );

  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );

  const [transactionFilter, setTransactionFilter] =
    useState<TransactionFilter>('toate');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  useEffect(() => {
    saveTransactionsToStorage(transactions);
  }, [transactions]);

  useEffect(() => {
    saveBillsToStorage(bills);
  }, [bills]);

  useEffect(() => {
    saveSubscriptionsToStorage(subscriptions);
  }, [subscriptions]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesType =
        transactionFilter === 'toate' || transaction.type === transactionFilter;

      const matchesSearch =
        normalizedSearchQuery.length === 0 ||
        transaction.description.toLowerCase().includes(normalizedSearchQuery) ||
        transaction.category.toLowerCase().includes(normalizedSearchQuery);

      return matchesType && matchesSearch;
    });
  }, [transactions, transactionFilter, searchQuery]);

  const stats = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'venit')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expense = transactions
      .filter((transaction) => transaction.type === 'cheltuiala')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const totalAvailableBalance = getTotalAvailableBalance(transactions);

    return {
      income,
      expense,
      totalAvailableBalance,
    };
  }, [transactions]);

  const ratio = stats.income > 0 ? stats.expense / stats.income : 0;

  const health =
    stats.income === 0
      ? { label: 'No data', color: 'text-gray-400' }
      : ratio < 0.5
      ? { label: 'Strong', color: 'text-emerald-400' }
      : ratio < 0.8
      ? { label: 'Stable', color: 'text-blue-400' }
      : { label: 'Risk', color: 'text-red-400' };

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      ...transactionData,
    };

    setTransactions((currentTransactions) => [
      newTransaction,
      ...currentTransactions,
    ]);

    setTransactionFilter('toate');
    setSearchQuery('');
    setActiveTab('tranzactii');
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setActiveTab('tranzactii');
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );

    setEditTransaction(null);
    setActiveTab('tranzactii');
  };

  const handleCancelEdit = () => {
    setEditTransaction(null);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) => transaction.id !== transactionId
      )
    );

    if (editTransaction?.id === transactionId) {
      setEditTransaction(null);
    }
  };

  const handleAddBill = (bill: Bill) => {
    setBills((currentBills) => [bill, ...currentBills]);
    setActiveTab('facturi');
  };

  const handlePayBill = (bill: Bill) => {
    if (bill.status === 'platita' || !bill.paymentAccountId) {
      return;
    }

    const now = new Date();
    const paymentDate = now.toISOString().slice(0, 10);
    const updatedAt = now.toISOString();

    const billPaymentTransaction: Transaction = {
      id: `bill-${bill.id}-${Date.now()}`,
      accountId: bill.paymentAccountId,
      amount: bill.amount,
      description: `Factura ${bill.provider}`,
      date: paymentDate,
      category: bill.category,
      type: 'cheltuiala',
    };

    setBills((currentBills) =>
      currentBills.map((currentBill) =>
        currentBill.id === bill.id
          ? {
              ...currentBill,
              status: 'platita',
              paymentDate,
              updatedAt,
            }
          : currentBill
      )
    );

    setTransactions((currentTransactions) => [
      billPaymentTransaction,
      ...currentTransactions,
    ]);

    setTransactionFilter('toate');
    setSearchQuery('');
    setActiveTab('facturi');
  };

  const handlePaySubscription = (subscription: Subscription) => {
    if (subscription.status !== 'activ' || !subscription.paymentAccountId) {
      return;
    }

    const now = new Date();
    const paymentDate = now.toISOString().slice(0, 10);
    const updatedAt = now.toISOString();
    const nextRenewalDate = getNextRenewalDate(
      subscription.renewalDate,
      subscription.frequency
    );

    const subscriptionPaymentTransaction: Transaction = {
      id: `subscription-${subscription.id}-${Date.now()}`,
      accountId: subscription.paymentAccountId,
      amount: subscription.amount,
      description: `Abonament ${subscription.name}`,
      date: paymentDate,
      category: subscription.category,
      type: 'cheltuiala',
    };

    setSubscriptions((currentSubscriptions) =>
      currentSubscriptions.map((currentSubscription) =>
        currentSubscription.id === subscription.id
          ? {
              ...currentSubscription,
              renewalDate: nextRenewalDate,
              updatedAt,
            }
          : currentSubscription
      )
    );

    setTransactions((currentTransactions) => [
      subscriptionPaymentTransaction,
      ...currentTransactions,
    ]);

    setTransactionFilter('toate');
    setSearchQuery('');
    setActiveTab('facturi');
  };

  const handleResetTransactions = () => {
    setTransactions(MOCK_TRANSACTIONS);
    setBills(MOCK_BILLS);
    setSubscriptions(MOCK_SUBSCRIPTIONS);
    setEditTransaction(null);
    setTransactionFilter('toate');
    setSearchQuery('');
    setActiveTab('dashboard');
    localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
    localStorage.removeItem(BILLS_STORAGE_KEY);
    localStorage.removeItem(SUBSCRIPTIONS_STORAGE_KEY);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleQuickAddTransaction = () => {
    setEditTransaction(null);
    setActiveTab('tranzactii');
  };

  if (activeTab === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-200">
        <PremiumMobileDashboard
          income={stats.income}
          expense={stats.expense}
          totalAvailableBalance={stats.totalAvailableBalance}
          transactions={transactions}
          bills={bills}
          subscriptions={subscriptions}
          onOpenTransactions={() => setActiveTab('tranzactii')}
          onOpenBills={() => setActiveTab('facturi')}
          onQuickAddTransaction={handleQuickAddTransaction}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0B1220] text-white">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
          <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-emerald-400/80">
                  Nexlogic Money
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  {getPageTitle(activeTab)}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  {getPageDescription(activeTab)}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div
                  className={`w-fit rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold ${health.color}`}
                >
                  Status: {health.label}
                </div>

                <button
                  type="button"
                  onClick={handleResetTransactions}
                  className="w-fit rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-300 transition hover:border-red-400/40 hover:text-red-300"
                >
                  Reset demo
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={getTabButtonClass(activeTab, 'dashboard')}
              >
                Dashboard
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tranzactii')}
                className={getTabButtonClass(activeTab, 'tranzactii')}
              >
                Tranzactii
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('conturi')}
                className={getTabButtonClass(activeTab, 'conturi')}
              >
                Conturi
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bugete')}
                className={getTabButtonClass(activeTab, 'bugete')}
              >
                Bugete
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('facturi')}
                className={getTabButtonClass(activeTab, 'facturi')}
              >
                Facturi
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rapoarte')}
                className={getTabButtonClass(activeTab, 'rapoarte')}
              >
                Rapoarte
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('obiective')}
                className={getTabButtonClass(activeTab, 'obiective')}
              >
                Obiective
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('setari')}
                className={getTabButtonClass(activeTab, 'setari')}
              >
                Setari
              </button>
            </div>
          </section>

          {activeTab === 'tranzactii' && (
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <TransactionForm
                onAdd={handleAddTransaction}
                editTransaction={editTransaction}
                onUpdate={handleUpdateTransaction}
                onCancelEdit={handleCancelEdit}
              />

              <div className="flex flex-col gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-xl">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Filtru tranzactii
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        Afiseaza rapid toate tranzactiile, doar veniturile, doar
                        cheltuielile sau cauta dupa descriere si categorie.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setTransactionFilter('toate')}
                        className={getFilterButtonClass(
                          transactionFilter,
                          'toate'
                        )}
                      >
                        Toate
                      </button>

                      <button
                        type="button"
                        onClick={() => setTransactionFilter('venit')}
                        className={getFilterButtonClass(
                          transactionFilter,
                          'venit'
                        )}
                      >
                        Venituri
                      </button>

                      <button
                        type="button"
                        onClick={() => setTransactionFilter('cheltuiala')}
                        className={getFilterButtonClass(
                          transactionFilter,
                          'cheltuiala'
                        )}
                      >
                        Cheltuieli
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Cauta dupa descriere sau categorie..."
                      className="min-h-11 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:bg-white/[0.06]"
                    />

                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-slate-200"
                    >
                      Curata cautarea
                    </button>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
                    Afisate:{' '}
                    <span className="font-semibold text-slate-200">
                      {filteredTransactions.length}
                    </span>{' '}
                    din{' '}
                    <span className="font-semibold text-slate-200">
                      {transactions.length}
                    </span>{' '}
                    tranzactii
                  </div>
                </div>

                <TransactionList
                  transactions={filteredTransactions}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              </div>
            </section>
          )}

          {activeTab === 'conturi' && (
            <section>
              <AccountsGrid transactions={transactions} />
            </section>
          )}

          {activeTab === 'bugete' && (
            <WorkInProgressPanel
              title="Bugete lunare"
              description="Aici vom construi zona pentru buget lunar, limite pe categorii si avertizare cand o categorie se apropie de limita."
              items={[
                'Buget total lunar',
                'Limite pe categorii',
                'Cheltuit vs ramas',
              ]}
            />
          )}

          {activeTab === 'facturi' && (
            <BillingOverview
              bills={bills}
              subscriptions={subscriptions}
              onAddBill={handleAddBill}
              onPayBill={handlePayBill}
              onPaySubscription={handlePaySubscription}
            />
          )}

          {activeTab === 'rapoarte' && (
            <WorkInProgressPanel
              title="Rapoarte financiare"
              description="Aici vom construi rapoarte lunare pentru venituri, cheltuieli, categorii si evolutia cashflow-ului."
              items={[
                'Raport lunar',
                'Cheltuieli pe categorii',
                'Evolutie venituri si cheltuieli',
              ]}
            />
          )}

          {activeTab === 'obiective' && (
            <WorkInProgressPanel
              title="Obiective financiare"
              description="Aici vom construi tinte de economisire, progres vizual si calcule simple pentru obiective personale."
              items={[
                'Fond de urgenta',
                'Economii pentru planuri',
                'Progres obiectiv',
              ]}
            />
          )}

          {activeTab === 'setari' && (
            <WorkInProgressPanel
              title="Setari si backup"
              description="Aici vom construi zona pentru reset demo, export/import date si siguranta informatiilor salvate local."
              items={['Export date', 'Import date', 'Reset si siguranta demo']}
            />
          )}
        </div>
      </main>
    </div>
  );
}
