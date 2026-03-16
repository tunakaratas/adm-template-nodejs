import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN";
type AuditEntity = string;

interface AuditLogOptions {
    action: AuditAction;
    entity: AuditEntity;
    entityId?: string;
    details?: Record<string, unknown>;
}

export async function logAudit({ action, entity, entityId, details }: AuditLogOptions) {
    try {
        const session = await auth();
        let ip = "unknown";
        let userAgent = "unknown";

        try {
            const headersList = await headers();
            ip = headersList.get("x-forwarded-for") || "unknown";
            userAgent = headersList.get("user-agent") || "unknown";
        } catch {
            // Ignored: likely running in a context without request headers
        }

        const adminId = session?.user?.email ? await getAdminIdByEmail(session.user.email) : null;

        await prisma.auditLog.create({
            data: {
                adminId,
                action,
                entity,
                entityId,
                details: details ? JSON.stringify(details) : null,
                ipAddress: ip,
                userAgent: userAgent,
            },
        });
    } catch (error) {
        console.error("Failed to create audit log", error);
    }
}

async function getAdminIdByEmail(email: string) {
    const admin = await prisma.admin.findUnique({
        where: { email },
        select: { id: true }
    });
    return admin?.id;
}
