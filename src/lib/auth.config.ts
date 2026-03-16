import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    providers: [],
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
        async authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnLogin = nextUrl.pathname === "/admin/login";

            if (isOnAdmin && !isOnLogin) {
                if (isLoggedIn) return true;
                return false;
            } else if (isOnLogin && isLoggedIn) {
                return Response.redirect(new URL("/admin", nextUrl));
            }

            return true;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
