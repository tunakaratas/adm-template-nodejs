"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, User, Mail, Lock, Shield, Clock, Globe, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface AdminProfile {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    lastLogin: {
        createdAt: string;
        ipAddress: string | null;
    } | null;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/admin/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setUsername(data.username);
                setEmail(data.email);
            }
        } catch {
            toast.error("Profil yuklenemedi");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email }),
            });

            if (res.ok) {
                toast.success("Profil guncellendi");
                fetchProfile();
            } else {
                const data = await res.json();
                toast.error(data.error || "Guncelleme basarisiz");
            }
        } catch {
            toast.error("Baglanti hatasi");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Yeni sifreler esleshmiyor");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Sifre en az 6 karakter olmali");
            return;
        }

        setSaving(true);

        try {
            const res = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (res.ok) {
                toast.success("Sifre basariyla degistirildi");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                const data = await res.json();
                toast.error(data.error || "Sifre degistirilemedi");
            }
        } catch {
            toast.error("Baglanti hatasi");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="h-8 w-48 bg-foreground/5 rounded animate-pulse" />
                <div className="h-64 bg-foreground/5 rounded-xl animate-pulse" />
                <div className="h-64 bg-foreground/5 rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold">Profil & Guvenlik</h1>
                <p className="text-foreground/60 mt-1">
                    Hesap bilgilerinizi ve guvenlik ayarlarinizi yonetin.
                </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Hesap Bilgileri
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Kullanici Adi</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-posta</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={saving}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Kaydet
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Sifre Degistir
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Mevcut Sifre</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                                    <Input
                                        id="currentPassword"
                                        type={showPasswords ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(!showPasswords)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60"
                                    >
                                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">Yeni Sifre</Label>
                                    <Input
                                        id="newPassword"
                                        type={showPasswords ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="En az 6 karakter"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Yeni Sifre (Tekrar)</Label>
                                    <Input
                                        id="confirmPassword"
                                        type={showPasswords ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-sm text-red-500">Sifreler eslesmiyor</p>
                            )}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={saving} variant="outline">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Sifre Degistir
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Guvenlik Bilgileri
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-foreground/5">
                                <div className="flex items-center gap-2 text-sm text-foreground/60">
                                    <Clock className="h-4 w-4" />
                                    Hesap Olusturulma
                                </div>
                                <span className="text-sm font-medium">
                                    {profile?.createdAt
                                        ? format(new Date(profile.createdAt), "d MMMM yyyy", { locale: tr })
                                        : "-"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-foreground/5">
                                <div className="flex items-center gap-2 text-sm text-foreground/60">
                                    <Clock className="h-4 w-4" />
                                    Son Giris
                                </div>
                                <span className="text-sm font-medium">
                                    {profile?.lastLogin
                                        ? format(new Date(profile.lastLogin.createdAt), "d MMM yyyy HH:mm", { locale: tr })
                                        : "Bilgi yok"}
                                </span>
                            </div>
                            {profile?.lastLogin?.ipAddress && (
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                                        <Globe className="h-4 w-4" />
                                        Son Giris IP
                                    </div>
                                    <span className="text-sm font-mono">{profile.lastLogin.ipAddress}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
