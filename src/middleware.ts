import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect API routes (except auth endpoints)
    if (pathname.startsWith("/api")) {
        if (pathname.startsWith("/api/auth/")) {
            return NextResponse.next();
        }

        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.next();
    }

    // Protect Admin routes
    if (pathname.startsWith("/admin")) {
        if (
            pathname === "/admin/login" ||
            pathname === "/admin/forgot-password" ||
            pathname.startsWith("/admin/reset-password")
        ) {
            return NextResponse.next();
        }

        const session = await auth();
        if (!session?.user) {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next();
    }

    // Redirect root to admin
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|_vercel|.*\\..*).*)",
    ],
};
