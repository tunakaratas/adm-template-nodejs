import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Admin Panel",
    description: "Admin Panel Template",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
