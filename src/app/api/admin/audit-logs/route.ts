
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 10;
        const search = searchParams.get("search") || "";

        const skip = (page - 1) * limit;

        const where = search ? {
            OR: [
                { action: { contains: search } },
                { entity: { contains: search } },
                { details: { contains: search } },
                { admin: { username: { contains: search } } }
            ]
        } : {};

        const [logs, total] = await prisma.$transaction([
            prisma.auditLog.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: "desc" },
                include: {
                    admin: {
                        select: { username: true, email: true }
                    }
                }
            }),
            prisma.auditLog.count({ where })
        ]);

        return NextResponse.json({
            logs,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        console.error("Audit Log API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
