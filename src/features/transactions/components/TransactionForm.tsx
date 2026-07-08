import { useEffect, useState } from "react";

import type { Transaction } from "../../../types/transactions";

type TransactionFormData = Omit<Transaction, "id">;

type TransactionFormProps = {
  onAdd: (transaction: TransactionFormData) => void;
  editTransaction?: Transaction | null;
  onUpdate?: (transaction: Transaction) => void;
  onCancelEdit?: () => void;
};

const ACCOUNT_OPTIONS = [
  {
    id: "client-1-raiffeisen",
    label: "Client 1 Raiffeisen",
  },
  {
    id: "client-1-bt",
    label: "Client 1 Banca Transilvania",
  },
  {
    id: "client-1-revolut",
    label: "Client 1 Revolut",
  },
  {
    id: "client-2-raiffeisen",
    label: "Client 2 Raiffeisen",
  },
  {
    id: "client-2-bt",
    label: "Client 2 Banca Transilvania",
  },
  {
    id: "client-2-revolut",
    label: "Client 2 Revolut",
  },
  {
    id: "cash-casa",
    label: "Cash casa",
  },
];

const initialFormData: TransactionFormData = {
  accountId: "client-1-raiffeisen",
  amount: 0,
  description: "",
  date: new Date().toISOString().slice(0, 10),
  category: "",
  type: "cheltuiala",
};

export function TransactionForm({
  onAdd,
  editTransaction,
  onUpdate,
  onCancelEdit,
}: TransactionFormProps) {
  const [formData, setFormData] =
    useState<TransactionFormData>(initialFormData);

  const isEditing = Boolean(editTransaction);

  useEffect(() => {
    if (!editTransaction) {
      setFormData(initialFormData);
      return;
    }

    setFormData({
      accountId: editTransaction.accountId,
      amount: editTransaction.amount,
      description: editTransaction.description,
      date: editTransaction.date,
      category: editTransaction.category,
      type: editTransaction.type,
    });
  }, [editTransaction]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanDescription = formData.description.trim();
    const cleanCategory = formData.category.trim();

    if (!cleanDescription || !cleanCategory || formData.amount <= 0) {
      return;
    }

    if (isEditing && editTransaction && onUpdate) {
      onUpdate({
        id: editTransaction.id,
        ...formData,
        description: cleanDescription,
        category: cleanCategory,
        amount: Number(formData.amount),
      });

      return;
    }

    onAdd({
      ...formData,
      description: cleanDescription,
      category: cleanCategory,
      amount: Number(formData.amount),
    });

    setFormData(initialFormData);
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);

    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-5">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-400/80">
          {isEditing ? "Editare tranzactie" : "Tranzactie noua"}
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          {isEditing ? "Modifica tranzactia" : "Adauga tranzactie"}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {isEditing
            ? "Corecteaza suma, descrierea, categoria, tipul sau contul tranzactiei."
            : "Introdu rapid o intrare sau o cheltuiala noua si alege contul folosit."}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Descriere
          </label>

          <input
            value={formData.description}
            onChange={(event) =>
              setFormData((currentFormData) => ({
                ...currentFormData,
                description: event.target.value,
              }))
            }
            placeholder="Ex: Salariu, Netflix, Mega Image"
            className="min-h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:bg-white/[0.06]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Suma
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(event) =>
              setFormData((currentFormData) => ({
                ...currentFormData,
                amount: Number(event.target.value),
              }))
            }
            placeholder="Ex: 250"
            className="min-h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:bg-white/[0.06]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Tip
            </label>

            <select
              value={formData.type}
              onChange={(event) =>
                setFormData((currentFormData) => ({
                  ...currentFormData,
                  type: event.target.value as Transaction["type"],
                }))
              }
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/50 focus:bg-white/[0.06]"
            >
              <option value="venit">Venit</option>
              <option value="cheltuiala">Cheltuiala</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Categorie
            </label>

            <input
              value={formData.category}
              onChange={(event) =>
                setFormData((currentFormData) => ({
                  ...currentFormData,
                  category: event.target.value,
                }))
              }
              placeholder="Ex: Mancare, Transport, Salariu"
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:bg-white/[0.06]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Data
            </label>

            <input
              type="date"
              value={formData.date}
              onChange={(event) =>
                setFormData((currentFormData) => ({
                  ...currentFormData,
                  date: event.target.value,
                }))
              }
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/50 focus:bg-white/[0.06]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Cont
            </label>

            <select
              value={formData.accountId}
              onChange={(event) =>
                setFormData((currentFormData) => ({
                  ...currentFormData,
                  accountId: event.target.value,
                }))
              }
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/50 focus:bg-white/[0.06]"
            >
              {ACCOUNT_OPTIONS.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="min-h-11 flex-1 rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300 shadow-lg shadow-emerald-500/10 transition hover:border-emerald-300/60 hover:bg-emerald-500/20"
          >
            {isEditing ? "Salveaza modificarile" : "Adauga tranzactie"}
          </button>

          {isEditing ? (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="min-h-11 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
            >
              Anuleaza editarea
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}