"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Globe, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const [settings, setSettings] = useState({
        siteTitle: "",
        metaDesc: "",
        email: "",
        phone: "",
        address: "",
        github: "",
        linkedin: "",
        twitter: "",
        instagram: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            if (res.ok) {
                const data = await res.json();
                const cleanData = Object.keys(data).reduce((acc: any, key) => {
                    acc[key] = data[key] === null ? "" : data[key];
                    return acc;
                }, {});
                setSettings({ ...settings, ...cleanData });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    const handleChange = (key: string, value: string) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSaved(false);

        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
            } else {
                alert("Kaydedilemedi. Lutfen tekrar deneyin.");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Baglanti hatasi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Ayarlar</h1>
                <p className="text-foreground/60 mt-1">
                    Site ayarlarini ve iletisim bilgilerini duzenleyin.
                </p>
            </div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-8"
            >
                {/* Site Settings */}
                <div className="p-6 rounded-xl border border-foreground/10 bg-background space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Site Ayarlari</h2>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="siteTitle">Site Basligi</Label>
                        <Input
                            id="siteTitle"
                            value={settings.siteTitle}
                            onChange={(e) => handleChange("siteTitle", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="metaDesc">Meta Aciklama</Label>
                        <Textarea
                            id="metaDesc"
                            value={settings.metaDesc}
                            onChange={(e) => handleChange("metaDesc", e.target.value)}
                            rows={2}
                        />
                    </div>
                </div>

                {/* Contact Info */}
                <div className="p-6 rounded-xl border border-foreground/10 bg-background space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Iletisim Bilgileri</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                                <Input
                                    id="phone"
                                    value={settings.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Adres</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                            <Textarea
                                id="address"
                                value={settings.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                className="pl-10"
                                rows={2}
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="p-6 rounded-xl border border-foreground/10 bg-background space-y-4">
                    <h2 className="text-lg font-semibold">Sosyal Medya</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="github">GitHub</Label>
                            <Input
                                id="github"
                                type="url"
                                value={settings.github}
                                onChange={(e) => handleChange("github", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                                id="linkedin"
                                type="url"
                                value={settings.linkedin}
                                onChange={(e) => handleChange("linkedin", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <Input
                                id="twitter"
                                type="url"
                                value={settings.twitter}
                                onChange={(e) => handleChange("twitter", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                                id="instagram"
                                type="url"
                                value={settings.instagram}
                                onChange={(e) => handleChange("instagram", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between">
                    {isSaved && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-green-600"
                        >
                            Ayarlar kaydedildi!
                        </motion.span>
                    )}
                    <div className="ml-auto">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                    Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Kaydet
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.form>
        </div>
    );
}
