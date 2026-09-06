"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { createBudget, getBudgets, getCategories, getTransactions } from "@/lib/firestore";
import type { Budget, Category, Transaction } from "@/lib/types";

const currencyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

function formatMoney(amount: number): string {
  return currencyFormatter.format(amount);
}

function calculateSpentAmount(budget: Budget, transactions: Transaction[]): number {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.categoryId === budget.categoryId,
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
}

function calculateBudgetPercent(spentAmount: number, budgetAmount: number): number {
  if (budgetAmount <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((spentAmount / budgetAmount) * 100));
}

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadBudgetData(): Promise<void> {
    try {
      const [loadedBudgets, loadedCategories, loadedTransactions] = await Promise.all([
        getBudgets(),
        getCategories(),
        getTransactions(),
      ]);

      setBudgets(loadedBudgets);
      setCategories(loadedCategories);
      setTransactions(loadedTransactions);
    } catch {
      setErrorMessage("Unable to load budgets.");
    }
  }

  useEffect(() => {
    Promise.all([getBudgets(), getCategories(), getTransactions()])
      .then(([loadedBudgets, loadedCategories, loadedTransactions]) => {
        setBudgets(loadedBudgets);
        setCategories(loadedCategories);
        setTransactions(loadedTransactions);
      })
      .catch(() => setErrorMessage("Unable to load budgets."));
  }, []);

  async function handleSaveBudget(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      await createBudget({
        categoryId: String(formData.get("categoryId")),
        amount: Number(formData.get("amount")),
      });

      setIsFormOpen(false);
      await loadBudgetData();
    } catch {
      setErrorMessage("Could not save budget.");
    }
  }

  return (
    <div>
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="mt-1 text-sm text-[var(--subtle)]">
            Spent amounts are calculated from expense transactions.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="h-10 rounded-xl bg-[#295b55] px-4 text-sm font-semibold text-white"
        >
          Add budget
        </button>
      </div>

      {errorMessage && <p className="mb-4 text-sm text-[#9f4038]">{errorMessage}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {budgets.length > 0 ? (
          budgets.map((budget) => {
            const spentAmount = calculateSpentAmount(budget, transactions);
            const budgetPercent = calculateBudgetPercent(spentAmount, budget.amount);
            const category = categories.find(
              (item) => item.id === budget.categoryId,
            );

            return (
              <div key={budget.id} className="surface p-5">
                <div className="flex justify-between">
                  <h2 className="font-semibold">{category?.name ?? "Unknown category"}</h2>
                  <strong>{budgetPercent}%</strong>
                </div>
                <p className="mt-2 text-sm text-[var(--subtle)]">
                  {formatMoney(spentAmount)} spent of {formatMoney(budget.amount)}
                </p>
                <div className="mt-4 h-2 rounded-full bg-[var(--muted)]">
                  <div
                    className="h-full rounded-full bg-[#295b55]"
                    style={{ width: `${budgetPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-right text-xs text-[var(--subtle)]">
                  Remaining {formatMoney(Math.max(0, budget.amount - spentAmount))}
                </p>
              </div>
            );
          })
        ) : (
          <div className="surface p-8 text-sm text-[var(--subtle)]">
            No budgets yet. Add a category budget to track progress.
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <form
            onSubmit={handleSaveBudget}
            className="w-full max-w-md rounded-3xl bg-[var(--surface)] p-6"
          >
            <h2 className="mb-5 text-xl font-bold">Add budget</h2>
            <div className="grid gap-4">
              <label>
                <span className="field-label">Category</span>
                <select name="categoryId" required className="field-input">
                  {categories
                    .filter((category) => category.type === "expense")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                <span className="field-label">Budget amount</span>
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="field-input"
                />
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
                Create budget
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
