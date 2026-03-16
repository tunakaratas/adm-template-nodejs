import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import {
    BarChart3,
    Users,
    TrendingUp,
    Activity,
    Zap,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { tr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function AdminDashboardPage() {
    const session = await auth();
    const now = new Date();

    let recentActivity: any[] = [];

    try {
        recentActivity = await prisma.auditLog.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { admin: { select: { username: true } } }
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
    }

    const hour = now.getHours();
    let greeting = "Iyi Geceler";
    if (hour >= 6 && hour < 12) greeting = "Gunaydin";
    else if (hour >= 12 && hour < 18) greeting = "Iyi Gunler";
    else if (hour >= 18 && hour < 22) greeting = "Iyi Aksamlar";

    return (
        <div className="space-y-8 p-1 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border/40">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {greeting}, {session?.user?.name?.split(' ')[0] || "Admin"}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-lg">
                        Yonetim panelinize hos geldiniz. Asagida genel bakis bilgilerini gorebilirsiniz.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-background border border-border/50 p-2 rounded-[11px] shadow-sm">
                    <div className="px-3 py-1 border-r border-border/50">
                        <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Tarih</span>
                        <span className="font-mono text-sm">{format(now, "d MMM yyyy", { locale: tr })}</span>
                    </div>
                    <div className="px-3 py-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Sistem</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">Online</span>
                    </div>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Toplam Kullanici", value: "1,284", icon: Users, trend: "+12%", trendLabel: "gecen aya gore" },
                    { label: "Bu Ay", value: "342", icon: TrendingUp, trend: "+8%", trendLabel: "artis" },
                    { label: "Aktif Oturum", value: "56", icon: Activity, trend: "+5", trendLabel: "yeni" },
                    { label: "Islem Sayisi", value: "2,847", icon: BarChart3, trend: "+18%", trendLabel: "artis" }
                ].map((stat, i) => (
                    <Card key={i} className="rounded-[11px] border border-border/50 shadow-[0_2px_10px_-5px_rgba(0,0,0,0.05)] bg-background hover:border-foreground/20 transition-all duration-300">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</h3>
                                </div>
                                <div className="p-2 bg-muted/20 rounded-lg text-foreground/70">
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-muted-foreground">
                                <span className="font-medium text-emerald-600 dark:text-emerald-400 mr-1.5">{stat.trend}</span>
                                <span>{stat.trendLabel}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Actions */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4 text-foreground/80 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-muted-foreground" /> Hizli Islemler
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { title: "Profil", href: "/admin/profil", icon: Users },
                                { title: "Ayarlar", href: "/admin/ayarlar", icon: Activity },
                                { title: "Audit Logs", href: "/admin/audit-logs", icon: BarChart3 },
                                { title: "Dashboard", href: "/admin", icon: TrendingUp },
                            ].map((item, i) => (
                                <a key={i} href={item.href} className="group flex flex-col items-center justify-center p-4 rounded-[11px] border border-border/40 hover:border-foreground/30 hover:bg-muted/10 transition-all bg-background text-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-muted/20 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">{item.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="rounded-[11px] border border-border/40 bg-background p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-semibold">Performans Analizi</h3>
                        </div>
                        <DashboardCharts />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* System Status */}
                    <div className="rounded-[11px] border border-border/40 bg-background p-5 shadow-sm">
                        <h3 className="text-sm font-semibold mb-4 text-foreground/80">Sistem Durumu</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>CPU</span>
                                    <span>24%</span>
                                </div>
                                <Progress value={24} className="h-1.5 bg-muted/20 [&>div]:bg-foreground" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Bellek</span>
                                    <span>62%</span>
                                </div>
                                <Progress value={62} className="h-1.5 bg-muted/20 [&>div]:bg-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-[11px] border border-border/40 bg-background p-5 shadow-sm">
                        <h3 className="text-sm font-semibold mb-4 text-foreground/80">Son Aktiviteler</h3>
                        <div className="space-y-0 relative">
                            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border/40"></div>
                            {recentActivity.map((log) => (
                                <div key={log.id} className="relative pl-8 py-3 group">
                                    <div className="absolute left-1 top-4 h-3 w-3 rounded-full border-2 border-background bg-muted-foreground/30 group-hover:bg-foreground transition-colors z-10"></div>
                                    <p className="text-sm font-medium leading-none">{log.action} - {log.entity}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-muted-foreground">{log.admin?.username || "Sistem"}</span>
                                        <span className="text-[10px] text-muted-foreground/60">•</span>
                                        <span className="text-xs text-muted-foreground/80">{formatDistanceToNow(log.createdAt, { addSuffix: true, locale: tr })}</span>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && (
                                <p className="text-sm text-muted-foreground pl-8">Henuz aktivite yok</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
