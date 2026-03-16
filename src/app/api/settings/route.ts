import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    siteTitle: "Admin Panel",
                    email: "admin@example.com",
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Settings GET error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        let settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    siteTitle: body.siteTitle || "Admin Panel",
                    metaDesc: body.metaDesc || null,
                    email: body.email || null,
                    phone: body.phone || null,
                    address: body.address || null,
                    github: body.github || null,
                    linkedin: body.linkedin || null,
                    twitter: body.twitter || null,
                    instagram: body.instagram || null,
                },
            });
        } else {
            settings = await prisma.siteSettings.update({
                where: { id: settings.id },
                data: {
                    siteTitle: body.siteTitle,
                    metaDesc: body.metaDesc || null,
                    email: body.email || null,
                    phone: body.phone || null,
                    address: body.address || null,
                    github: body.github || null,
                    linkedin: body.linkedin || null,
                    twitter: body.twitter || null,
                    instagram: body.instagram || null,
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Settings PUT error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
