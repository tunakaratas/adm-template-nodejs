import { z } from "zod";

// ============ Auth ============
export const loginSchema = z.object({
    username: z.string().min(1, "Kullanıcı adı gerekli"),
    password: z.string().min(1, "Şifre gerekli"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ============ Settings ============
export const settingsSchema = z.object({
    siteTitle: z.string().optional(),
    metaDesc: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    github: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
});
export type SettingsInput = z.infer<typeof settingsSchema>;

// ============ Helper ============
export function formatZodError(error: z.ZodError): string {
    return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
}
