import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const email = process.env.ADMIN_EMAIL || "admin@example.com";

    if (!password || password.length < 6) {
        console.error("Password must be at least 6 characters");
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.upsert({
        where: { username },
        update: {
            password: hashedPassword,
            email,
        },
        create: {
            username,
            email,
            password: hashedPassword,
        },
    });

    console.log(`Admin user created/updated successfully!`);
    console.log(`  Username: ${admin.username}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  ID: ${admin.id}`);
}

main()
    .catch((e) => {
        console.error("Error creating admin:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
