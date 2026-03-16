
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, RefreshCw, Search, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId: string | null;
    details: string | null;
    admin: {
        username: string;
        email: string;
    } | null;
    ipAddress: string | null;
    createdAt: string;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [detailsOpen, setDetailsOpen] = useState<string | null>(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                search: searchTerm,
            });
            const res = await fetch(`/api/admin/audit-logs?${params}`);
            const data = await res.json();
            setLogs(data.logs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchLogs();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, page]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">İşlem Geçmişi (Audit Logs)</h1>
                    <p className="text-muted-foreground mt-2">
                        Sistemdeki kritik değişikliklerin kayıtları.
                    </p>
                </div>
                <Button onClick={fetchLogs} variant="outline" size="icon">
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Ara (Entity, Action, Kullanıcı)..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tarih</TableHead>
                                <TableHead>Kullanıcı</TableHead>
                                <TableHead>İşlem</TableHead>
                                <TableHead>Varlık</TableHead>
                                <TableHead>IP Adresi</TableHead>
                                <TableHead className="text-right">Detay</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Yükleniyor...
                                    </TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        Kayıt bulunamadı.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">
                                            {format(new Date(log.createdAt), "d MMM yyyy HH:mm", { locale: tr })}
                                        </TableCell>
                                        <TableCell>
                                            {log.admin ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{log.admin.username}</span>
                                                    <span className="text-xs text-muted-foreground">{log.admin.email}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">Sistem / Bilinmiyor</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                log.action === "CREATE" ? "default" :
                                                    log.action === "UPDATE" ? "secondary" :
                                                        log.action === "DELETE" ? "destructive" : "outline"
                                            }>
                                                {log.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{log.entity}</TableCell>
                                        <TableCell className="text-xs font-mono">{log.ipAddress || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>İşlem Detayı</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 text-sm">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <span className="font-semibold block">İşlem ID:</span>
                                                                <span className="font-mono text-xs text-muted-foreground">{log.id}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold block">Varlık ID:</span>
                                                                <span className="font-mono text-xs text-muted-foreground">{log.entityId || "-"}</span>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <span className="font-semibold block mb-2">Değişiklik Detayları (JSON):</span>
                                                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs font-mono">
                                                                {log.details ? JSON.stringify(JSON.parse(log.details), null, 2) : "Detay yok"}
                                                            </pre>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                                                            <ShieldAlert className="h-3 w-3" />
                                                            <span>User Agent: {// @ts-ignore
                                                                log.userAgent || "Bilinmiyor"}</span>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex justify-center gap-2">
                <Button
                    variant="outline"
                    disabled={page === 1 || loading}
                    onClick={() => setPage(p => p - 1)}
                >
                    Önceki
                </Button>
                <span className="flex items-center px-4 font-medium text-sm">Sayfa {page}</span>
                <Button
                    variant="outline"
                    disabled={logs.length < 10 || loading}
                    onClick={() => setPage(p => p + 1)}
                >
                    Sonraki
                </Button>
            </div>
        </div>
    );
}
