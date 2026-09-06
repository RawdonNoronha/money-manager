"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bell,
    ChevronDown,
    CreditCard,
    FileText,
    Home,
    LayoutDashboard,
    Menu,
    Moon,
    MoreHorizontal,
    Settings,
    Tag,
    TrendingUp,
    Wallet,
    X,
} from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/firebase";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface NavigationItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Transactions", href: "/transactions", icon: FileText },
    { label: "Budgets", href: "/budgets", icon: Wallet },
    { label: "Categories", href: "/categories", icon: Tag },
    { label: "Accounts", href: "/accounts", icon: CreditCard },
    { label: "Reports", href: "/reports", icon: TrendingUp },
];

const mobileNavigationItems: NavigationItem[] = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Transactions", href: "/transactions", icon: FileText },
    { label: "Budgets", href: "/budgets", icon: Wallet },
    { label: "Reports", href: "/reports", icon: TrendingUp },
    { label: "More", href: "/settings", icon: MoreHorizontal },
];

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/transactions": "Transactions",
    "/budgets": "Budgets",
    "/categories": "Categories",
    "/accounts": "Accounts",
    "/reports": "Reports",
    "/settings": "Settings",
};

function Logo() {
    return (
        <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#295b55] text-white">
                <Wallet size={18} />
            </div>
            <span className="text-[15px] font-bold tracking-tight">Money Manager</span>
        </div>
    );
}

function NavigationLink({
    item,
    isActive,
    onClick,
}: {
    item: NavigationItem;
    isActive: boolean;
    onClick: () => void;
}) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={`nav-item ${isActive ? "nav-active" : ""}`}
        >
            <Icon size={18} />
            {item.label}
        </Link>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        // Listen for authentication changes once, then keep the displayed
        // profile synchronized with Firebase Authentication.
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                console.log("User is signed in:", user);
            } else {
                console.log("No user is signed in");
                setCurrentUser(null);
            }
        });
        return unsubscribe;
    }, []);

    const pageTitle = pageTitles[pathname] ?? "Dashboard";
    const isPathActive = (href: string): boolean =>
        pathname === href || pathname.startsWith(`${href}/`);
    const closeSidebar = (): void => setIsSidebarOpen(false);

    const getInitials = (name: string) => {
        return name
            .trim()
            .split(/\s+/)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            setCurrentUser(null);
            toast.add({
                type: "success",
                title: "Signed Out",
                description: "You have successfully signed out.",
            });
            console.log("User signed out successfully");
        } catch (error) {
            toast.add({
                type: "error",
                title: "Sign Out Failed",
                description: "An error occurred while signing out.",
            });
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className={isDarkMode ? "dark" : ""}>
            <div className="app-shell">
                <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
                    <div className="mb-9 flex items-center justify-between">
                        <Logo />
                        <button
                            onClick={closeSidebar}
                            className="rounded-lg p-2 text-[var(--subtle)] lg:hidden"
                            aria-label="Close navigation"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <nav className="grid gap-1">
                        {navigationItems.map((item) => (
                            <NavigationLink
                                key={item.href}
                                item={item}
                                isActive={isPathActive(item.href)}
                                onClick={closeSidebar}
                            />
                        ))}
                    </nav>

                    <div className="mt-auto grid gap-1">
                        <NavigationLink
                            item={{ label: "Settings", href: "/settings", icon: Settings }}
                            isActive={isPathActive("/settings")}
                            onClick={closeSidebar}
                        />
                        <div className="mt-4 flex items-center gap-3 border-t border-[var(--line)] pt-5">
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e4c1a8] text-xs font-bold text-[#774f38]">
                                {getInitials(currentUser?.displayName || "Guest")}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold">{currentUser?.displayName || "Guest"}</p>
                                <p className="truncate text-xs text-[var(--subtle)]">{currentUser?.email || "guest@example.com"}</p>
                            </div>
                            <Popover>
                                <PopoverTrigger
                                    render={
                                        <button
                                            type="button"
                                            className="icon-button ml-auto"
                                            aria-label="Open account menu"
                                        />
                                    }
                                >
                                    <MoreHorizontal size={17} />
                                </PopoverTrigger>
                                <PopoverContent className="p-4">
                                    <PopoverHeader>
                                        <PopoverTitle>
                                            {currentUser?.displayName || "Guest"}
                                        </PopoverTitle>
                                        <PopoverDescription>
                                            {currentUser?.email || "guest@example.com"}
                                        </PopoverDescription>
                                        {
                                            currentUser ? (
                                                <Button onClick={handleSignOut} variant="outline" disabled={!currentUser} className="mt-3 w-full">
                                                    Sign Out
                                                </Button>
                                            )
                                                :
                                                (
                                                    <Button onClick={() => window.location.href = '/sign-in'} variant="outline" className="mt-3 w-full">
                                                        Sign In
                                                    </Button>
                                                )
                                        }
                                    </PopoverHeader>
                                </PopoverContent>
                            </Popover>

                        </div>
                    </div>
                </aside>

                {isSidebarOpen && (
                    <button
                        aria-label="Close navigation"
                        onClick={closeSidebar}
                        className="fixed inset-0 z-30 bg-black/25 lg:hidden"
                    />
                )}

                <main className="main-content">
                    <header className="topbar">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open navigation"
                            className="rounded-lg p-2 text-[var(--subtle)] lg:hidden"
                        >
                            <Menu size={21} />
                        </button>
                        <div className="hidden items-center gap-2 text-sm text-[var(--subtle)] md:flex">
                            <span>Workspace</span>
                            <span>/</span>
                            <span className="font-semibold text-[var(--ink)]">{pageTitle}</span>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <button
                                aria-label="Toggle theme"
                                onClick={() => setIsDarkMode((darkMode) => !darkMode)}
                                className="icon-button"
                            >
                                <Moon size={18} />
                            </button>
                            <button aria-label="Notifications" className="icon-button relative">
                                <Bell size={18} />
                                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d96b5e]" />
                            </button>
                            <div className="ml-1 hidden h-8 w-px bg-[var(--line)] sm:block" />
                            <div className="hidden items-center gap-2 sm:flex">
                                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#e4c1a8] text-[11px] font-bold text-[#774f38]">
                                    {getInitials(currentUser?.displayName || "Guest")}
                                </div>
                                <ChevronDown size={14} className="text-[var(--subtle)]" />
                            </div>
                        </div>
                    </header>
                    <div className="page-wrap">{children}</div>
                </main>

                <nav className="bottom-nav">
                    {mobileNavigationItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={isPathActive(item.href) ? "bottom-active" : ""}
                            >
                                <Icon size={19} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
