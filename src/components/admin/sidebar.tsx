"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Moon,
    Sun,
    Menu,
    X,
    ClipboardList,
    User,
    type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type SidebarItem = {
    label: string;
    icon: LucideIcon;
    href: string;
};

const sidebarItems: SidebarItem[] = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard
    },
    {
        label: "Profil",
        href: "/admin/profil",
        icon: User
    },
    {
        label: "Audit Logs",
        href: "/admin/audit-logs",
        icon: ClipboardList
    },
    {
        label: "Ayarlar",
        href: "/admin/ayarlar",
        icon: Settings
    }
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = () => {
        signOut({ callbackUrl: "/admin/login" });
    };

    const renderSidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-6 border-b border-foreground/10">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                        <span className="text-lg font-bold text-background">A</span>
                    </div>
                    <div>
                        <span className="font-semibold text-sm">Admin Panel</span>
                        <p className="text-xs text-foreground/50">Template</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? "bg-foreground text-background"
                                : "hover:bg-foreground/10"
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-foreground/10 space-y-2 mt-auto">
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? (
                        <>
                            <Sun className="h-5 w-5 mr-3" />
                            Acik Tema
                        </>
                    ) : (
                        <>
                            <Moon className="h-5 w-5 mr-3" />
                            Koyu Tema
                        </>
                    )}
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Cikis Yap
                </Button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-foreground/10 px-4 py-3 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-background">A</span>
                    </div>
                    <span className="font-semibold text-sm">Admin</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-foreground/10 transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {renderSidebarContent()}
                </div>
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-background border-r border-foreground/10">
                {renderSidebarContent()}
            </aside>
        </>
    );
}
