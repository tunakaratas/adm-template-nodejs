import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email adresi gerekli" },
                { status: 400 }
            );
        }

        const admin = await prisma.admin.findFirst({
            where: { email },
        });

        if (!admin) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return NextResponse.json({ success: true, message: "Eger email adresi kayitliysa, sifirlama baglantisi gonderildi." });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry,
            },
        });

        // TODO: Send email with reset link
        // The reset link should be: ${process.env.NEXTAUTH_URL}/admin/reset-password?token=${token}
        console.log(`Password reset token for ${email}: ${token}`);
        console.log(`Reset link: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`);

        return NextResponse.json({
            success: true,
            message: "Eger email adresi kayitliysa, sifirlama baglantisi gonderildi."
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Bir hata olustu" },
            { status: 500 }
        );
    }
}
