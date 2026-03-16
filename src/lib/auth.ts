import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const username = credentials.username as string;
                const password = credentials.password as string;

                const admin = await prisma.admin.findUnique({
                    where: { username },
                });

                if (!admin) {
                    return null;
                }

                const isValidPassword = await bcrypt.compare(password, admin.password);

                if (!isValidPassword) {
                    return null;
                }

                return {
                    id: admin.id,
                    name: admin.username,
                    email: admin.email,
                };
            },
        }),
    ],
});
