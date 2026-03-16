import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopBar } from "@/components/admin/top-bar";
import { SessionProvider } from "next-auth/react";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/admin/login");
    }

    return (
        <SessionProvider session={session}>
            <div className="min-h-screen bg-background">
                <AdminSidebar />
                <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
                    <AdminTopBar />
                    <div className="p-6 lg:p-8">{children}</div>
                </main>
            </div>
        </SessionProvider>
    );
}
