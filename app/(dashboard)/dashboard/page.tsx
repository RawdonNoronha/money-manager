"use client";

import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAccounts, getBudgets, getCategories, getTransactions } from "@/lib/firestore";
import type { Account, Budget, Category, Transaction } from "@/lib/types";

const currencyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

function formatMoney(amount: number): string {
  return currencyFormatter.format(amount);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-IE", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="surface p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Stat({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  icon: typeof Wallet;
  tone: string;
}) {
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-[var(--subtle)]">{title}</p>
          <p className="mt-2 text-[25px] font-bold">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex h-full min-h-24 flex-col items-center justify-center text-center text-sm text-[var(--subtle)]">
      <strong className="text-[var(--ink)]">{text}</strong>
      <span className="mt-1">Add your first transaction to start tracking your finances.</span>
    </div>
  );
}

function getTotalAmount(transactions: Transaction[], type: Transaction["type"]): number {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

function getCategorySpending(
  categories: Category[],
  transactions: Transaction[],
) {
  return categories
    .map((category) => {
      const amount = transactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.categoryId === category.id,
        )
        .reduce((total, transaction) => total + transaction.amount, 0);

      return {
        categoryId: category.id,
        name: category.name,
        value: amount,
        color: category.color,
      };
    })
    .filter((category) => category.value > 0);
}

function getMonthlyTotals(transactions: Transaction[]) {
  const months = Array.from(
    new Set(transactions.map((transaction) => transaction.date.slice(0, 7))),
  )
    .sort()
    .slice(-6);

  return months.map((month) => {
    const monthTransactions = transactions.filter((transaction) =>
      transaction.date.startsWith(month),
    );

    return {
      month: new Intl.DateTimeFormat("en", { month: "short" }).format(
        new Date(`${month}-01T00:00:00`),
      ),
      income: getTotalAmount(monthTransactions, "income"),
      expenses: getTotalAmount(monthTransactions, "expense"),
    };
  });
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboardData(): Promise<void> {
      try {
        const [loadedTransactions, loadedCategories, loadedAccounts, loadedBudgets] =
          await Promise.all([
            getTransactions(),
            getCategories(),
            getAccounts(),
            getBudgets(),
          ]);

        setTransactions(loadedTransactions);
        setCategories(loadedCategories);
        setAccounts(loadedAccounts);
        setBudgets(loadedBudgets);
      } catch (reason: unknown) {
        const message = reason instanceof Error
          ? reason.message
          : "Unable to load dashboard data.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-5">
        <div className="h-24 animate-pulse rounded-2xl bg-[var(--muted)]" />
        <div className="h-72 animate-pulse rounded-2xl bg-[var(--muted)]" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="surface p-8">
        <h1 className="text-xl font-bold">Could not load dashboard</h1>
        <p className="mt-2 text-sm text-[var(--subtle)]">{errorMessage}</p>
      </div>
    );
  }

  const income = getTotalAmount(transactions, "income");
  const expenses = getTotalAmount(transactions, "expense");
  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0,
  );
  const categorySpending = getCategorySpending(categories, transactions);
  const spendingByCategoryId = new Map(
    categorySpending.map((category) => [category.categoryId, category.value]),
  );
  const monthlyTotals = getMonthlyTotals(transactions);
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const accountById = new Map(accounts.map((account) => [account.id, account]));

  return (
    <>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-sm text-[var(--subtle)]">Your financial overview</p>
          <h1 className="text-[28px] font-bold sm:text-[32px]">Good morning, Jamie</h1>
          <p className="mt-1 text-sm text-[var(--subtle)]">Your numbers, grounded in Firestore.</p>
        </div>
        <Link
          href="/transactions"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#295b55] px-4 text-sm font-semibold text-white"
        >
          <Plus size={17} />
          Add transaction
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total balance" value={formatMoney(totalBalance)} icon={Wallet} tone="bg-[#e4f2ed] text-[#295b55]" />
        <Stat title="Monthly income" value={formatMoney(income)} icon={ArrowDownLeft} tone="bg-[#fff0dd] text-[#bb762d]" />
        <Stat title="Monthly expenses" value={formatMoney(expenses)} icon={ArrowUpRight} tone="bg-[#fae8e4] text-[#c05c51]" />
        <Stat title="Savings" value={formatMoney(income - expenses)} icon={Sparkles} tone="bg-[#eeebfa] text-[#7767aa]" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <Panel title="Income vs expenses">
          <div className="h-[260px]">
            {monthlyTotals.length > 0 ? (
              <ResponsiveContainer>
                <AreaChart data={monthlyTotals}>
                  <CartesianGrid stroke="var(--grid)" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `€${value}`} />
                  <Tooltip formatter={(value) => formatMoney(Number(value))} />
                  <Area dataKey="income" stroke="#295b55" fill="#e4f2ed" />
                  <Area dataKey="expenses" stroke="#e79a4d" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="No transactions yet" />
            )}
          </div>
        </Panel>

        <Panel title="Spending by category">
          <div className="flex min-h-[190px] items-center gap-5">
            {categorySpending.length > 0 ? (
              <>
                <div className="h-[190px] w-1/2">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={categorySpending} dataKey="value" innerRadius={52} outerRadius={78}>
                        {categorySpending.map((category) => (
                          <Cell key={category.name} fill={category.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatMoney(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid flex-1 gap-2 text-xs">
                  {categorySpending.map((category) => (
                    <div key={category.name} className="flex justify-between">
                      <span>{category.name}</span>
                      <strong>{formatMoney(category.value)}</strong>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState text="No expense data yet" />
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.25fr]">
        <Panel
          title="Budget overview"
          action={<Link href="/budgets" className="text-xs font-semibold text-[#2b8069]">View all</Link>}
        >
          {budgets.length > 0 ? (
            <div className="grid gap-5">
              {budgets.map((budget) => {
                const spentAmount = spendingByCategoryId.get(budget.categoryId) ?? 0;
                const budgetPercent = budget.amount > 0
                  ? Math.min(100, Math.round((spentAmount / budget.amount) * 100))
                  : 0;

                return (
                  <div key={budget.id}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-semibold">{categoryById.get(budget.categoryId)?.name ?? "Unknown category"}</span>
                      <span className="text-xs text-[var(--subtle)]">{formatMoney(spentAmount)} / {formatMoney(budget.amount)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--muted)]">
                      <div className="h-full rounded-full bg-[#295b55]" style={{ width: `${budgetPercent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState text="No budgets yet" />
          )}
        </Panel>

        <Panel
          title="Recent transactions"
          action={<Link href="/transactions" className="text-xs font-semibold text-[#2b8069]">View all transactions</Link>}
        >
          {transactions.length > 0 ? (
            <div className="divide-y divide-[var(--line)]">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-3 py-3 first:pt-0">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--muted)] text-[var(--subtle)]">
                    <TrendingUp size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{transaction.description || "Transaction"}</p>
                    <p className="text-xs text-[var(--subtle)]">{categoryById.get(transaction.categoryId)?.name ?? "Uncategorized"} · {accountById.get(transaction.accountId)?.name ?? "Unknown account"} · {formatDate(transaction.date)}</p>
                  </div>
                  <strong className={transaction.type === "income" ? "text-[#2b8069]" : ""}>
                    {transaction.type === "income" ? "+" : "-"}{formatMoney(transaction.amount)}
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="No transactions yet" />
          )}
        </Panel>
      </div>
    </>
  );
}
