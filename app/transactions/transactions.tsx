"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import {
  createTransaction,
  getAccounts,
  getCategories,
  getTransactions,
} from "@/lib/firestore";
import type { Account, Category, EntryType, Transaction } from "@/lib/types";

const currencyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

function formatMoney(amount: number): string {
  return currencyFormatter.format(amount);
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadTransactionData(): Promise<void> {
    try {
      const [loadedTransactions, loadedCategories, loadedAccounts] = await Promise.all([
        getTransactions(),
        getCategories(),
        getAccounts(),
      ]);

      setTransactions(loadedTransactions);
      setCategories(loadedCategories);
      setAccounts(loadedAccounts);
    } catch {
      setErrorMessage("Unable to load transactions.");
    }
  }

  useEffect(() => {
    Promise.all([getTransactions(), getCategories(), getAccounts()])
      .then(([loadedTransactions, loadedCategories, loadedAccounts]) => {
        setTransactions(loadedTransactions);
        setCategories(loadedCategories);
        setAccounts(loadedAccounts);
      })
      .catch(() => setErrorMessage("Unable to load transactions."));
  }, []);

  async function handleSaveTransaction(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      await createTransaction({
        type: String(formData.get("type")) as EntryType,
        amount: Number(formData.get("amount")),
        categoryId: String(formData.get("categoryId")),
        accountId: String(formData.get("accountId")),
        description: String(formData.get("description")),
        date: String(formData.get("date")),
        notes: String(formData.get("notes") ?? ""),
      });

      setIsFormOpen(false);
      await loadTransactionData();
    } catch {
      setErrorMessage("Could not save transaction.");
    }
  }

  return (
    <div>
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="mt-1 text-sm text-[var(--subtle)]">
            Every entry keeps only category and account references.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="h-10 rounded-xl bg-[#295b55] px-4 text-sm font-semibold text-white"
        >
          Add transaction
        </button>
      </div>

      {errorMessage && <p className="mb-4 text-sm text-[#9f4038]">{errorMessage}</p>}

      <div className="surface divide-y divide-[var(--line)]">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            const category = categories.find(
              (item) => item.id === transaction.categoryId,
            );
            const account = accounts.find(
              (item) => item.id === transaction.accountId,
            );
            const amountPrefix = transaction.type === "income" ? "+" : "-";
            const amountClassName =
              transaction.type === "income" ? "text-[#2b8069]" : "";

            return (
              <div key={transaction.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {transaction.description || "Transaction"}
                  </p>
                  <p className="text-xs text-[var(--subtle)]">
                    {category?.name ?? "Uncategorized"} · {account?.name ?? "Unknown account"} · {transaction.date}
                  </p>
                </div>
                <strong className={amountClassName}>
                  {amountPrefix}
                  {formatMoney(transaction.amount)}
                </strong>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-sm text-[var(--subtle)]">
            No transactions yet.
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <form
            onSubmit={handleSaveTransaction}
            className="w-full max-w-lg rounded-3xl bg-[var(--surface)] p-6"
          >
            <h2 className="mb-5 text-xl font-bold">Add transaction</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="field-label">Type</span>
                <select name="type" className="field-input">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </label>
              <label>
                <span className="field-label">Amount</span>
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="field-input"
                />
              </label>
              <label>
                <span className="field-label">Category</span>
                <select name="categoryId" required className="field-input">
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="field-label">Account</span>
                <select name="accountId" required className="field-input">
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="field-label">Date</span>
                <input name="date" type="date" required className="field-input" />
              </label>
              <label>
                <span className="field-label">Description</span>
                <input name="description" required className="field-input" />
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="h-10 flex-1 rounded-xl border border-[var(--line)]"
              >
                Cancel
              </button>
              <button className="h-10 flex-1 rounded-xl bg-[#295b55] text-sm font-semibold text-white">
                Save transaction
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
