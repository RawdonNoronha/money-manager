"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { createAccount, getAccounts } from "@/lib/firestore";
import type { Account } from "@/lib/types";

const currencyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

function formatMoney(amount: number): string {
  return currencyFormatter.format(amount);
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadAccounts(): Promise<void> {
    try {
      const loadedAccounts = await getAccounts();
      setAccounts(loadedAccounts);
    } catch {
      setErrorMessage("Unable to load accounts.");
    }
  }

  useEffect(() => {
    getAccounts()
      .then((loadedAccounts) => setAccounts(loadedAccounts))
      .catch(() => setErrorMessage("Unable to load accounts."));
  }, []);

  async function handleSaveAccount(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const accountName = String(formData.get("name"));
    const accountType = String(formData.get("type"));
    const openingBalance = Number(formData.get("balance"));

    try {
      await createAccount({
        name: accountName,
        type: accountType,
        balance: openingBalance,
        currency: "EUR",
      });

      setIsFormOpen(false);
      await loadAccounts();
    } catch {
      setErrorMessage("Could not save account.");
    }
  }

  return (
    <div>
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Accounts</h1>
          <p className="mt-1 text-sm text-[var(--subtle)]">
            Balances are stored alongside your account references.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="h-10 rounded-xl bg-[#295b55] px-4 text-sm font-semibold text-white"
        >
          Add account
        </button>
      </div>

      {errorMessage && <p className="mb-4 text-sm text-[#9f4038]">{errorMessage}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div key={account.id} className="surface p-5">
              <p className="font-semibold">{account.name}</p>
              <p className="mt-1 text-xs text-[var(--subtle)]">{account.type}</p>
              <p className="mt-5 text-xl font-bold">{formatMoney(account.balance)}</p>
            </div>
          ))
        ) : (
          <div className="surface p-8 text-sm text-[var(--subtle)]">
            No accounts yet. Add a bank, cash, savings, or credit account.
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <form
            onSubmit={handleSaveAccount}
            className="w-full max-w-md rounded-3xl bg-[var(--surface)] p-6"
          >
            <h2 className="mb-5 text-xl font-bold">Add account</h2>
            <div className="grid gap-4">
              <label>
                <span className="field-label">Name</span>
                <input name="name" required className="field-input" />
              </label>
              <label>
                <span className="field-label">Type</span>
                <select name="type" className="field-input">
                  <option>Bank Account</option>
                  <option>Cash</option>
                  <option>Savings</option>
                  <option>Credit Card</option>
                </select>
              </label>
              <label>
                <span className="field-label">Opening balance</span>
                <input
                  name="balance"
                  type="number"
                  step="0.01"
                  defaultValue="0"
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
                Create account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
