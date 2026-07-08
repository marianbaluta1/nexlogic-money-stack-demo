import type { FormEvent } from "react";
import { useState } from "react";

import { DEMO_ACCOUNTS, getDemoAccountLabel } from "../../../data/demoAccounts";
import type {
  Bill,
  BillStatus,
  Subscription,
  SubscriptionStatus,
} from "../../../types/billing";

type BillingOverviewProps = {
  bills: Bill[];
  subscriptions: Subscription[];
  onAddBill: (bill: Bill) => void;
  onPayBill: (bill: Bill) => void;
  onPaySubscription: (subscription: Subscription) => void;
};

type BillFormState = {
  provider: string;
  category: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  paymentAccountId: string;
  reminderEnabled: boolean;
  reminderDaysBefore: string;
  notes: string;
};

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getInitialBillFormState(): BillFormState {
  return {
    provider: "",
    category: "Facturi",
    amount: "",
    issueDate: getTodayDate(),
    dueDate: getTodayDate(),
    paymentAccountId: "client-1-bt",
    reminderEnabled: true,
    reminderDaysBefore: "2",
    notes: "",
  };
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getBillStatusLabel(status: BillStatus) {
  if (status === "platita") {
    return "Platita";
  }

  if (status === "restanta") {
    return "Restanta";
  }

  return "In asteptare";
}

function getBillStatusClass(status: BillStatus) {
  if (status === "platita") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "restanta") {
    return "border-red-400/20 bg-red-500/10 text-red-300";
  }

  return "border-amber-400/20 bg-amber-500/10 text-amber-300";
}

function getSubscriptionStatusLabel(status: SubscriptionStatus) {
  return status === "activ" ? "Activ" : "Inactiv";
}

function getSubscriptionStatusClass(status: SubscriptionStatus) {
  return status === "activ"
    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
    : "border-slate-400/20 bg-slate-500/10 text-slate-300";
}

function BillForm({ onAddBill }: { onAddBill: (bill: Bill) => void }) {
  const [billForm, setBillForm] = useState<BillFormState>(
    getInitialBillFormState
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const amount = Number(billForm.amount);
    const reminderDaysBefore = Number(billForm.reminderDaysBefore);

    if (
      billForm.provider.trim().length === 0 ||
      billForm.category.trim().length === 0 ||
      Number.isNaN(amount) ||
      amount <= 0 ||
      billForm.issueDate.trim().length === 0 ||
      billForm.dueDate.trim().length === 0 ||
      billForm.paymentAccountId.trim().length === 0
    ) {
      return;
    }

    const now = new Date().toISOString();

    const newBill: Bill = {
      id: `bill-custom-${Date.now()}`,
      provider: billForm.provider.trim(),
      category: billForm.category.trim(),
      amount,
      issueDate: billForm.issueDate,
      dueDate: billForm.dueDate,
      status: "in_asteptare",
      paymentAccountId: billForm.paymentAccountId,
      reminder: {
        enabled: billForm.reminderEnabled,
        daysBefore:
          Number.isNaN(reminderDaysBefore) || reminderDaysBefore < 0
            ? 0
            : reminderDaysBefore,
      },
      notes: billForm.notes.trim(),
      createdAt: now,
      updatedAt: now,
    };

    onAddBill(newBill);
    setBillForm(getInitialBillFormState());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">
          Adauga factura noua
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Factura este adaugata in asteptare. Cand o marchezi platita, se
          creeaza automat cheltuiala si scade soldul contului ales.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Provider</span>
          <input
            value={billForm.provider}
            onChange={(event) =>
              setBillForm((currentForm) => ({
                ...currentForm,
                provider: event.target.value,
              }))
            }
            placeholder="Ex: Electrica, Digi, Telefon"
            className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:bg-white/[0.06]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Categorie</span>
          <input
            value={billForm.category}
            onChange={(event) =>
              setBillForm((currentForm) => ({
                ...currentForm,
                category: event.target.value,
              }))
            }
            placeholder="Ex: Electricitate, Internet, Telefon"
            className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:bg-white/[0.06]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Suma RON</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={billForm.amount}
            onChange={(event) =>
              setBillForm((currentForm) => ({
                ...currentForm,
                amount: event.target.value,
              }))
            }
            placeholder="Ex: 180"
            className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:bg-white/[0.06]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Cont de plata
          </span>
          <select
            value={billForm.paymentAccountId}
            onChange={(event) =>
              setBillForm((currentForm) => ({
                ...currentForm,
                paymentAccountId: event.target.value,
              }))
            }
            className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/50 focus:bg-white/[0.06]"
          >
            {DEMO_ACCOUNTS.map((account) => (
              <option
                key={account.id}
                value={account.id}
                className="bg-slate-950 text-slate-100"
              >
                {account.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Data emiterii
          </span>
          <input
            type="date"
            value={billForm.issueDate}
            onChange={(event) =>
              setBillForm((currentForm) => ({
                ...currentForm,
                issueDate: event.target.value,
              }))
            }
            className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/50 focus:bg-white/[0.06]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Data scadentei
          </span>
          <input
            type="date"
            value={billForm.dueDate}
            onChange={(event) =>
              setBillForm((currentForm) => ({
                ...currentForm,
                dueDate: event.target.value,
              }))
            }
            className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/50 focus:bg-white/[0.06]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Reminder cu zile inainte
          </span>
          <input
            type="number"
            min="0"
            value={billForm.reminderDaysBefore}
            onChange={(event) =>
              setBillForm((currentForm) => ({
                ...currentForm,
                reminderDaysBefore: event.target.value,
              }))
            }
            className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/50 focus:bg-white/[0.06]"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <input
            type="checkbox"
            checked={billForm.reminderEnabled}
            onChange={(event) =>
              setBillForm((currentForm) => ({
                ...currentForm,
                reminderEnabled: event.target.checked,
              }))
            }
            className="h-4 w-4"
          />
          <span className="text-sm font-medium text-slate-300">
            Reminder activ
          </span>
        </label>

        <label className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-300">Note</span>
          <textarea
            value={billForm.notes}
            onChange={(event) =>
              setBillForm((currentForm) => ({
                ...currentForm,
                notes: event.target.value,
              }))
            }
            placeholder="Optional"
            rows={3}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:bg-white/[0.06]"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:border-emerald-300/50 hover:bg-emerald-500/20"
      >
        Adauga factura
      </button>
    </form>
  );
}

function BillCard({
  bill,
  onPayBill,
}: {
  bill: Bill;
  onPayBill: (bill: Bill) => void;
}) {
  const isPaid = bill.status === "platita";

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
            Factura
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {bill.provider}
          </h3>

          <p className="mt-1 text-sm text-slate-400">{bill.category}</p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBillStatusClass(
            bill.status
          )}`}
        >
          {getBillStatusLabel(bill.status)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs text-slate-500">Suma</p>
          <p className="mt-1 font-semibold text-slate-100">
            {formatMoney(bill.amount)} RON
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs text-slate-500">Scadenta</p>
          <p className="mt-1 font-semibold text-slate-100">{bill.dueDate}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:col-span-2">
          <p className="text-xs text-slate-500">Cont plata</p>
          <p className="mt-1 font-semibold text-slate-100">
            {bill.paymentAccountId
              ? getDemoAccountLabel(bill.paymentAccountId)
              : "Neales"}
          </p>
        </div>
      </div>

      {bill.reminder.enabled ? (
        <p className="mt-4 text-xs text-amber-300">
          Reminder activ cu {bill.reminder.daysBefore} zile inainte de scadenta.
        </p>
      ) : (
        <p className="mt-4 text-xs text-slate-500">Reminder inactiv.</p>
      )}

      <div className="mt-5">
        {isPaid ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Factura este platita
            {bill.paymentDate ? ` din ${bill.paymentDate}` : ""}.
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onPayBill(bill)}
            disabled={!bill.paymentAccountId}
            className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:border-emerald-300/50 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Marcheaza platita
          </button>
        )}
      </div>
    </article>
  );
}

function SubscriptionCard({
  subscription,
  onPaySubscription,
}: {
  subscription: Subscription;
  onPaySubscription: (subscription: Subscription) => void;
}) {
  const isActive = subscription.status === "activ";

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
            Abonament
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {subscription.name}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {subscription.category} •{" "}
            {subscription.frequency === "lunar" ? "Lunar" : "Anual"}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSubscriptionStatusClass(
            subscription.status
          )}`}
        >
          {getSubscriptionStatusLabel(subscription.status)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs text-slate-500">Suma</p>
          <p className="mt-1 font-semibold text-slate-100">
            {formatMoney(subscription.amount)} RON
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs text-slate-500">Reinnoire</p>
          <p className="mt-1 font-semibold text-slate-100">
            {subscription.renewalDate}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:col-span-2">
          <p className="text-xs text-slate-500">Cont plata</p>
          <p className="mt-1 font-semibold text-slate-100">
            {subscription.paymentAccountId
              ? getDemoAccountLabel(subscription.paymentAccountId)
              : "Neales"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Plata automata:{" "}
        <span className="font-semibold text-slate-200">
          {subscription.automaticPayment ? "Da, urmarita manual" : "Nu"}
        </span>
      </p>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => onPaySubscription(subscription)}
          disabled={!isActive || !subscription.paymentAccountId}
          className="w-full rounded-2xl border border-blue-400/30 bg-blue-500/15 px-4 py-3 text-sm font-semibold text-blue-300 transition hover:border-blue-300/50 hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Inregistreaza plata abonament
        </button>

        <p className="mt-3 text-xs text-slate-500">
          La plata, aplicatia creeaza o cheltuiala si muta data urmatoarei
          reinnoiri.
        </p>
      </div>
    </article>
  );
}

export function BillingOverview({
  bills,
  subscriptions,
  onAddBill,
  onPayBill,
  onPaySubscription,
}: BillingOverviewProps) {
  const unpaidBillsTotal = bills
    .filter((bill) => bill.status !== "platita")
    .reduce((total, bill) => total + bill.amount, 0);

  const activeSubscriptionsTotal = subscriptions
    .filter((subscription) => subscription.status === "activ")
    .reduce((total, subscription) => total + subscription.amount, 0);

  return (
    <section className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-sm text-slate-400">Facturi active</p>
          <p className="mt-3 text-3xl font-bold text-white">{bills.length}</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-sm text-slate-400">Total facturi neplatite</p>
          <p className="mt-3 text-3xl font-bold text-amber-300">
            {formatMoney(unpaidBillsTotal)} RON
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-sm text-slate-400">Cost abonamente active</p>
          <p className="mt-3 text-3xl font-bold text-blue-300">
            {formatMoney(activeSubscriptionsTotal)} RON
          </p>
        </div>
      </div>

      <BillForm onAddBill={onAddBill} />

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-xl">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-white">Facturi</h2>
          <p className="mt-1 text-sm text-slate-400">
            Facturi demo si facturi adaugate manual, cu status, scadenta,
            reminder si cont de plata.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {bills.map((bill) => (
            <BillCard key={bill.id} bill={bill} onPayBill={onPayBill} />
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-xl">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-white">Abonamente</h2>
          <p className="mt-1 text-sm text-slate-400">
            Abonamente demo cu data de reinnoire, cont de plata si reminder.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onPaySubscription={onPaySubscription}
            />
          ))}
        </div>
      </div>
    </section>
  );
}