"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const pathLabels: Record<string, string> = {
    admin: "Admin",
    profil: "Profil",
    ayarlar: "Ayarlar",
    "audit-logs": "Audit Logs",
};

export function AdminBreadcrumb() {
    const pathname = usePathname();

    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbItems = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        return { label, href };
    });

    if (breadcrumbItems.length <= 1) return null;

    return (
        <nav className="flex items-center gap-1 text-sm text-foreground/50">
            <Link href="/admin" className="hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
            </Link>
            {breadcrumbItems.slice(1).map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                    <ChevronRight className="h-4 w-4" />
                    {index < breadcrumbItems.length - 2 ? (
                        <Link href={item.href} className="hover:text-foreground transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
