import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: "Eksik bilgi" },
                { status: 400 }
            );
        }

        if (typeof password !== "string" || password.length < 8) {
            return NextResponse.json(
                { error: "Sifre en az 8 karakter olmalidir" },
                { status: 400 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { resetToken: token },
        });

        if (!admin) {
            return NextResponse.json(
                { error: "Gecersiz veya suresi dolmus baglanti" },
                { status: 400 }
            );
        }

        if (!admin.resetTokenExpiry || new Date() > admin.resetTokenExpiry) {
            return NextResponse.json(
                { error: "Baglantinin suresi dolmus" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Sifreniz basariyla guncellendi."
        });

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Bir hata olustu" },
            { status: 500 }
        );
    }
}
