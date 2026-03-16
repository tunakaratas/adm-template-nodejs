import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Create default admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const admin = await prisma.admin.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            email: process.env.ADMIN_EMAIL || "admin@example.com",
            password: hashedPassword,
        },
    });

    console.log(`Admin user created: ${admin.username} (${admin.email})`);

    // Create default site settings
    await prisma.siteSettings.upsert({
        where: { id: "default" },
        update: {},
        create: {
            id: "default",
            siteTitle: "Admin Panel",
            email: "admin@example.com",
        },
    });

    console.log("Default settings created");

    // Create a sample audit log
    await prisma.auditLog.create({
        data: {
            adminId: admin.id,
            action: "LOGIN",
            entity: "Admin",
            entityId: admin.id,
            details: JSON.stringify({ message: "Initial seed login" }),
        },
    });

    console.log("Sample audit log created");
    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
