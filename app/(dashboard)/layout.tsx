"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, CreditCard, FileText, Home, LayoutDashboard, Menu, Moon, MoreHorizontal, Settings, Tag, TrendingUp, Wallet, X } from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

const navItems = [["Dashboard", "/dashboard", LayoutDashboard], ["Transactions", "/transactions", FileText], ["Budgets", "/budgets", Wallet], ["Categories", "/categories", Tag], ["Accounts", "/accounts", CreditCard], ["Reports", "/reports", TrendingUp]] as const;
const titles: Record<string, string> = { "/dashboard": "Dashboard", "/transactions": "Transactions", "/budgets": "Budgets", "/categories": "Categories", "/accounts": "Accounts", "/reports": "Reports", "/settings": "Settings" };
const bottomItems: [string, string, LucideIcon][] = [["Home", "/dashboard", Home], ["Transactions", "/transactions", FileText], ["Budgets", "/budgets", Wallet], ["Reports", "/reports", TrendingUp], ["More", "/settings", MoreHorizontal]];

function Logo() { return <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#295b55] text-white"><Wallet size={18} /></div><span className="text-[15px] font-bold tracking-tight">Money Manager</span></div>; }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const title = titles[pathname] ?? "Dashboard";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return <div className={dark ? "dark" : ""}><div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}><div className="mb-9 flex items-center justify-between"><Logo /><button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-[var(--subtle)] lg:hidden" aria-label="Close navigation"><X size={18} /></button></div><nav className="grid gap-1">{navItems.map(([label, href, Icon]) => <Link key={href} href={href} onClick={() => setSidebarOpen(false)} className={`nav-item ${isActive(href) ? "nav-active" : ""}`}><Icon size={18} />{label}</Link>)}</nav><div className="mt-auto grid gap-1"><Link href="/settings" onClick={() => setSidebarOpen(false)} className={`nav-item ${isActive("/settings") ? "nav-active" : ""}`}><Settings size={18} />Settings</Link><div className="mt-4 flex items-center gap-3 border-t border-[var(--line)] pt-5"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#e4c1a8] text-xs font-bold text-[#774f38]">JD</div><div className="min-w-0"><p className="truncate text-sm font-bold">Jamie Davis</p><p className="truncate text-xs text-[var(--subtle)]">jamie@email.com</p></div><MoreHorizontal size={17} className="ml-auto text-[var(--subtle)]" /></div></div></aside>
    {sidebarOpen && <button aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/25 lg:hidden" />}<main className="main-content"><header className="topbar"><button onClick={() => setSidebarOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-[var(--subtle)] lg:hidden"><Menu size={21} /></button><div className="hidden items-center gap-2 text-sm text-[var(--subtle)] md:flex"><span>Workspace</span><span>/</span><span className="font-semibold text-[var(--ink)]">{title}</span></div><div className="ml-auto flex items-center gap-2"><button aria-label="Toggle theme" onClick={() => setDark(!dark)} className="icon-button"><Moon size={18} /></button><button aria-label="Notifications" className="icon-button relative"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d96b5e]" /></button><div className="ml-1 hidden h-8 w-px bg-[var(--line)] sm:block" /><div className="hidden items-center gap-2 sm:flex"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#e4c1a8] text-[11px] font-bold text-[#774f38]">JD</div><ChevronDown size={14} className="text-[var(--subtle)]" /></div></div></header><div className="page-wrap">{children}</div></main>
    <nav className="bottom-nav">{bottomItems.map(([label, href, Icon]) => <Link key={href} href={href} className={isActive(href) ? "bottom-active" : ""}><Icon size={19} /><span>{label}</span></Link>)}</nav>
  </div></div>;
}