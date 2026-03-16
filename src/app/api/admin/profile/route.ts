import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET: Admin profil bilgileri
export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const admin = await prisma.admin.findFirst({
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });

        if (!admin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        // Son giriş bilgisi
        const lastLogin = await prisma.auditLog.findFirst({
            where: { action: "LOGIN" },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true, ipAddress: true },
        });

        return NextResponse.json({ ...admin, lastLogin });
    } catch (error) {
        console.error("Profile error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

// PUT: Profil güncelleme
export async function PUT(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { username, email, currentPassword, newPassword } = body;

        const admin = await prisma.admin.findFirst();
        if (!admin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        const updateData: any = {};

        // Kullanıcı adı değişikliği
        if (username && username !== admin.username) {
            updateData.username = username;
        }

        // Email değişikliği
        if (email && email !== admin.email) {
            updateData.email = email;
        }

        // Şifre değişikliği
        if (currentPassword && newPassword) {
            const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
            if (!isValidPassword) {
                return NextResponse.json(
                    { error: "Mevcut şifre yanlış" },
                    { status: 400 }
                );
            }

            if (newPassword.length < 6) {
                return NextResponse.json(
                    { error: "Yeni şifre en az 6 karakter olmalı" },
                    { status: 400 }
                );
            }

            updateData.password = await bcrypt.hash(newPassword, 12);
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: "Değişiklik yok" });
        }

        await prisma.admin.update({
            where: { id: admin.id },
            data: updateData,
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                adminId: admin.id,
                action: "UPDATE",
                entity: "Admin",
                entityId: admin.id,
                details: JSON.stringify({
                    updated: Object.keys(updateData).filter((k) => k !== "password"),
                    passwordChanged: !!updateData.password,
                }),
            },
        });

        return NextResponse.json({ message: "Profil güncellendi" });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
