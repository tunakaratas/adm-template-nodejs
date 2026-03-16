"use client";

import { AdminBreadcrumb } from "@/components/admin/breadcrumb";
import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminTopBar() {
    return (
        <header className="hidden lg:flex items-center justify-between h-14 px-6 border-b border-foreground/10 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            {/* Breadcrumb */}
            <div className="flex-1">
                <AdminBreadcrumb />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                <Link href="/admin/profil">
                    <Button variant="ghost" size="icon" title="Profil">
                        <User className="h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </header>
    );
}
