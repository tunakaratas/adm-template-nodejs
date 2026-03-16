"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Gecersiz kullanici adi veya sifre");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch {
            setError("Bir hata olustu. Lutfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-foreground rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-background">A</span>
                    </div>
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <p className="text-sm text-foreground/60 mt-2">
                        Yonetim paneline hos geldiniz
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-8 rounded-2xl border border-foreground/10 bg-background space-y-6"
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 text-red-600"
                        >
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </motion.div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="username">Kullanici Adi</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="admin"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Sifre</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <a
                            href="/admin/forgot-password"
                            className="text-sm text-primary hover:underline"
                        >
                            Sifremi Unuttum?
                        </a>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                Giris yapiliyor...
                            </>
                        ) : (
                            "Giris Yap"
                        )}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
