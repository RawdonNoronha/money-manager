"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Car,
  ChevronDown,
  CircleHelp,
  CreditCard,
  FileText,
  Home as HomeIcon,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Moon,
  Plus,
  Search,
  Settings,
  Sparkles,
  Tag,
  TrendingUp,
  Utensils,
  Wallet,
  X,
  ShoppingCart,
} from "lucide-react";
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

type Transaction = {
  id: string;
  type: "expense" | "income";
  amount: number;
  category: string;
  description: string;
  account: string;
  date: string;
  icon: typeof ShoppingCart;
};

type Budget = { name: string; spent: number; total: number; color: string };

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Transactions", icon: FileText },
  { label: "Budgets", icon: Wallet },
  { label: "Categories", icon: Tag },
  { label: "Accounts", icon: CreditCard },
  { label: "Reports", icon: TrendingUp },
];

const chartData = [
  { month: "Apr", income: 2700, expenses: 1450 },
  { month: "May", income: 3100, expenses: 1680 },
  { month: "Jun", income: 2800, expenses: 1300 },
  { month: "Jul", income: 3250, expenses: 1760 },
  { month: "Aug", income: 2900, expenses: 1510 },
  { month: "Sep", income: 2800, expenses: 1350 },
];

const spendData = [
  { name: "Housing", value: 480, color: "#295b55" },
  { name: "Groceries", value: 320, color: "#e79a4d" },
  { name: "Shopping", value: 210, color: "#d96b5e" },
  { name: "Transport", value: 120, color: "#7b91b5" },
  { name: "Bills", value: 110, color: "#a99cce" },
  { name: "Other", value: 110, color: "#c9c4b8" },
];

const budgets: Budget[] = [
  { name: "Groceries", spent: 320, total: 500, color: "#e79a4d" },
  { name: "Transport", spent: 120, total: 200, color: "#7b91b5" },
  { name: "Entertainment", spent: 180, total: 250, color: "#a99cce" },
  { name: "Shopping", spent: 210, total: 300, color: "#d96b5e" },
];

const transactions: Transaction[] = [
  {
    id: "1",
    type: "expense",
    amount: 52.3,
    category: "Groceries",
    description: "Tesco",
    account: "Bank Account",
    date: "Today",
    icon: ShoppingCart,
  },
  {
    id: "2",
    type: "income",
    amount: 2400,
    category: "Salary",
    description: "Monthly Salary",
    account: "Bank Account",
    date: "Sep 1",
    icon: ArrowDownLeft,
  },
  {
    id: "3",
    type: "expense",
    amount: 35,
    category: "Transport",
    description: "Bus",
    account: "Bank Account",
    date: "Aug 31",
    icon: Car,
  },
  {
    id: "4",
    type: "expense",
    amount: 17.99,
    category: "Entertainment",
    description: "Netflix",
    account: "Credit Card",
    date: "Aug 30",
    icon: Sparkles,
  },
  {
    id: "5",
    type: "expense",
    amount: 42.5,
    category: "Food",
    description: "Restaurant",
    account: "Credit Card",
    date: "Aug 29",
    icon: Utensils,
  },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(
    amount,
  );

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#295b55] text-white">
        <Wallet size={18} />
      </div>
      <span className="text-[15px] font-bold tracking-tight">
        Money Manager
      </span>
    </div>
  );
}
function Button({
  children,
  className = "",
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#295b55] ${variant === "primary" ? "bg-[#295b55] text-white shadow-sm hover:bg-[#204942]" : variant === "secondary" ? "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--muted)]" : "text-[var(--subtle)] hover:bg-[var(--muted)] hover:text-[var(--ink)]"} ${className}`}
    >
      {children}
    </button>
  );
}
function StatCard({
  title,
  value,
  change,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  change: string;
  icon: typeof Wallet;
  tone: string;
}) {
  return (
    <div className="surface relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-[var(--subtle)]">
            {title}
          </p>
          <p className="mt-2 text-[25px] font-bold tracking-tight">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-5 flex items-center gap-1 text-xs font-semibold text-[#3a9172]">
        <TrendingUp size={13} />
        {change}
        <span className="font-normal text-[var(--subtle)]">vs last month</span>
      </p>
    </div>
  );
}
function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`surface p-5 ${className}`}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-bold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
function IncomeExpenseChart() {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 4, left: -22, bottom: 0 }}
        >
          <defs>
            <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#295b55" stopOpacity={0.16} />
              <stop offset="100%" stopColor="#295b55" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--subtle)", fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--subtle)", fontSize: 11 }}
            tickFormatter={(v) => `€${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              border: "1px solid var(--line)",
              borderRadius: 12,
              background: "var(--surface)",
              fontSize: 12,
            }}
            formatter={(v) => money(Number(v))}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#295b55"
            strokeWidth={2.5}
            fill="url(#incomeFill)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#e79a4d"
            strokeWidth={2.5}
            fill="none"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
function SpendingChart() {
  return (
    <div className="flex items-center gap-5">
      <div className="h-[190px] w-[52%] min-w-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={spendData}
              dataKey="value"
              innerRadius={58}
              outerRadius={83}
              paddingAngle={3}
              stroke="none"
            >
              {spendData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => money(Number(v))}
              contentStyle={{
                border: "1px solid var(--line)",
                borderRadius: 12,
                background: "var(--surface)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid flex-1 gap-2.5">
        {spendData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="flex items-center gap-2 text-[var(--subtle)]">
              <i
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <strong>{money(item.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
function BudgetProgress({ budget }: { budget: Budget }) {
  const percent = Math.round((budget.spent / budget.total) * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">{budget.name}</span>
        <span className="text-xs text-[var(--subtle)]">
          {money(budget.spent)}{" "}
          <span className="opacity-60">/ {money(budget.total)}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: budget.color }}
        />
      </div>
      <p className="mt-1.5 text-right text-[11px] font-semibold text-[var(--subtle)]">
        {percent}% used
      </p>
    </div>
  );
}

function TransactionList() {
  return (
    <div className="divide-y divide-[var(--line)]">
      {transactions.map((transaction) => {
        const Icon = transaction.icon;
        return (
          <div
            key={transaction.id}
            className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${transaction.type === "income" ? "bg-[#e4f2ed] text-[#2b8069] dark:bg-[#1e3d36]" : "bg-[var(--muted)] text-[var(--subtle)]"}`}
            >
              <Icon size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {transaction.description}
              </p>
              <p className="mt-0.5 text-xs text-[var(--subtle)]">
                {transaction.category}{" "}
                <span className="px-1 opacity-50">•</span> {transaction.date}
              </p>
            </div>
            <p
              className={`text-sm font-bold ${transaction.type === "income" ? "text-[#2b8069]" : ""}`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {money(transaction.amount)}
            </p>
            <button
              aria-label={`Edit ${transaction.description}`}
              className="ml-1 hidden rounded-lg p-2 text-[var(--subtle)] hover:bg-[var(--muted)] group-hover:block"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function AddTransactionDialog({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<"expense" | "income">("expense");
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-t-3xl bg-[var(--surface)] p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2b8069]">
              New transaction
            </p>
            <h2 className="mt-1 text-xl font-bold">Add transaction</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-2 text-[var(--subtle)] hover:bg-[var(--muted)]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-[var(--muted)] p-1">
          <button
            onClick={() => setType("expense")}
            className={`rounded-lg py-2 text-sm font-semibold ${type === "expense" ? "bg-[var(--surface)] shadow-sm" : "text-[var(--subtle)]"}`}
          >
            Expense
          </button>
          <button
            onClick={() => setType("income")}
            className={`rounded-lg py-2 text-sm font-semibold ${type === "income" ? "bg-[var(--surface)] shadow-sm" : "text-[var(--subtle)]"}`}
          >
            Income
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="field-label">Amount</span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-lg font-bold text-[var(--subtle)]">
                €
              </span>
              <input
                autoFocus
                className="field-input pl-8 text-lg font-bold"
                placeholder="0.00"
                type="number"
              />
            </div>
          </label>
          <label>
            <span className="field-label">Category</span>
            <select className="field-input">
              <option>Groceries</option>
              <option>Housing</option>
              <option>Transport</option>
              <option>Entertainment</option>
            </select>
          </label>
          <label>
            <span className="field-label">Account</span>
            <select className="field-input">
              <option>Bank Account</option>
              <option>Cash</option>
              <option>Credit Card</option>
            </select>
          </label>
          <label>
            <span className="field-label">Date</span>
            <input
              className="field-input"
              type="date"
              defaultValue="2026-09-05"
            />
          </label>
          <label>
            <span className="field-label">Description</span>
            <input className="field-input" placeholder="e.g. Tesco" />
          </label>
          <label className="sm:col-span-2">
            <span className="field-label">
              Notes{" "}
              <span className="font-normal text-[var(--subtle)]">
                (optional)
              </span>
            </span>
            <textarea
              className="field-input min-h-20 resize-none"
              placeholder="Add a note..."
            />
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Save transaction
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const navigate = (label: string) => {
    setActive(label);
    setSidebarOpen(false);
  };
  
  return (
    <div className={dark ? "dark" : ""}>
      <div className="app-shell">
        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="mb-9 flex items-center justify-between">
            <Logo />
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-[var(--subtle)] lg:hidden"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="grid gap-1">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => navigate(label)}
                className={`nav-item ${active === label ? "nav-active" : ""}`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
          <div className="mt-auto grid gap-1">
            <button
              onClick={() => navigate("Settings")}
              className={`nav-item ${active === "Settings" ? "nav-active" : ""}`}
            >
              <Settings size={18} />
              Settings
            </button>
            <div className="mt-4 flex items-center gap-3 border-t border-[var(--line)] pt-5">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e4c1a8] text-xs font-bold text-[#774f38]">
                JD
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">Jamie Davis</p>
                <p className="truncate text-xs text-[var(--subtle)]">
                  jamie@email.com
                </p>
              </div>
              <MoreHorizontal
                size={17}
                className="ml-auto text-[var(--subtle)]"
              />
            </div>
          </div>
        </aside>
        {sidebarOpen && (
          <button
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/25 lg:hidden"
          />
        )}
        <main className="main-content">
          <header className="topbar">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg p-2 text-[var(--subtle)] lg:hidden"
            >
              <Menu size={21} />
            </button>
            <div className="hidden items-center gap-2 text-sm text-[var(--subtle)] md:flex">
              <span>Workspace</span>
              <span>/</span>
              <span className="font-semibold text-[var(--ink)]">{active}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button aria-label="Search" className="icon-button">
                <Search size={18} />
              </button>
              <button
                aria-label="Toggle theme"
                onClick={() => setDark(!dark)}
                className="icon-button"
              >
                <Moon size={18} />
              </button>
              <button
                aria-label="Notifications"
                className="icon-button relative"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d96b5e]" />
              </button>
              <div className="ml-1 hidden h-8 w-px bg-[var(--line)] sm:block" />
              <div className="hidden items-center gap-2 sm:flex">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#e4c1a8] text-[11px] font-bold text-[#774f38]">
                  JD
                </div>
                <ChevronDown size={14} className="text-[var(--subtle)]" />
              </div>
            </div>
          </header>
          <div className="page-wrap">
            {active === "Dashboard" ? (
              <>
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="mb-1 text-sm font-medium text-[var(--subtle)]">
                      Saturday, September 5, 2026
                    </p>
                    <h1 className="text-[28px] font-bold tracking-tight sm:text-[32px]">
                      Good morning, Jamie <span className="wave">👋</span>
                    </h1>
                    <p className="mt-1 text-sm text-[var(--subtle)]">
                      Here&apos;s your financial overview.
                    </p>
                  </div>
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus size={17} />
                    Add transaction
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Total balance"
                    value="€2,450.00"
                    change="+8.2%"
                    icon={Wallet}
                    tone="bg-[#e4f2ed] text-[#295b55]"
                  />
                  <StatCard
                    title="Income"
                    value="€2,800.00"
                    change="+4.5%"
                    icon={ArrowDownLeft}
                    tone="bg-[#fff0dd] text-[#bb762d]"
                  />
                  <StatCard
                    title="Expenses"
                    value="€1,350.00"
                    change="-2.1%"
                    icon={ArrowUpRight}
                    tone="bg-[#fae8e4] text-[#c05c51]"
                  />
                  <StatCard
                    title="Savings"
                    value="€1,450.00"
                    change="+12.8%"
                    icon={Sparkles}
                    tone="bg-[#eeebfa] text-[#7767aa]"
                  />
                </div>
                <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
                  <Panel
                    title="Income vs expenses"
                    action={
                      <div className="flex gap-4 text-xs">
                        <span className="flex items-center gap-1.5">
                          <i className="h-2 w-2 rounded-full bg-[#295b55]" />
                          Income
                        </span>
                        <span className="flex items-center gap-1.5">
                          <i className="h-2 w-2 rounded-full bg-[#e79a4d]" />
                          Expenses
                        </span>
                      </div>
                    }
                  >
                    <IncomeExpenseChart />
                  </Panel>
                  <Panel
                    title="Spending by category"
                    action={
                      <button className="text-xs font-semibold text-[#2b8069]">
                        This month <ChevronDown size={13} className="inline" />
                      </button>
                    }
                  >
                    <SpendingChart />
                  </Panel>
                </div>
                <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.25fr]">
                  <Panel
                    title="Budget overview"
                    action={
                      <Button variant="ghost" className="h-8 px-2 text-xs">
                        View all budgets <ArrowUpRight size={13} />
                      </Button>
                    }
                  >
                    <div className="grid gap-5">
                      {budgets.map((budget) => (
                        <BudgetProgress key={budget.name} budget={budget} />
                      ))}
                    </div>
                  </Panel>
                  <Panel
                    title="Recent transactions"
                    action={
                      <Button
                        variant="ghost"
                        className="h-8 px-2 text-xs"
                        onClick={() => navigate("Transactions")}
                      >
                        View all <ArrowUpRight size={13} />
                      </Button>
                    }
                  >
                    <TransactionList />
                  </Panel>
                </div>
              </>
            ) : (
              <PlaceholderPage
                title={active}
                onAdd={
                  active === "Transactions" || active === "Budgets"
                    ? () => setDialogOpen(true)
                    : undefined
                }
                onBack={() => navigate("Dashboard")}
              />
            )}
          </div>
        </main>
        <nav className="bottom-nav">
          {[
            { label: "Home", icon: HomeIcon, target: "Dashboard" },
            { label: "Transactions", icon: FileText, target: "Transactions" },
            { label: "Budgets", icon: Wallet, target: "Budgets" },
            { label: "Reports", icon: TrendingUp, target: "Reports" },
            { label: "More", icon: MoreHorizontal, target: "Settings" },
          ].map(({ label, icon: Icon, target }) => (
            <button
              key={label}
              onClick={() => navigate(target)}
              className={
                active === target ||
                  (label === "Home" && active === "Dashboard")
                  ? "bottom-active"
                  : ""
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        {dialogOpen && (
          <AddTransactionDialog onClose={() => setDialogOpen(false)} />
        )}
      </div>
    </div>
  );
}
function PlaceholderPage({
  title,
  onAdd,
  onBack,
}: {
  title: string;
  onAdd?: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#e4f2ed] text-[#295b55]">
        <CircleHelp size={25} />
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-[var(--subtle)]">
        This workspace is ready for your {title.toLowerCase()} data. Your local
        finance view will live here.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" onClick={onBack}>
          Back to dashboard
        </Button>
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus size={16} />
            Add {title.slice(0, -1).toLowerCase()}
          </Button>
        )}
      </div>
    </div>
  );
}
