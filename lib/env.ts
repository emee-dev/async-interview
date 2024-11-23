import { z } from "zod";

const envSchema = z.object({
  // Assembly AI
  ASSEMBLYAI_API_KEY: z.string().trim().min(1),

  // Superviz
  NEXT_PUBLIC_SUPERVIZ_DEVELOPER_TOKEN: z.string().trim().min(1),
  SUPERVIZ_CLIENT_ID: z.string().trim().min(1),
  SUPERVIZ_SECRET_KEY: z.string().trim().min(1),

  // Resend
  RESEND_API_KEY: z.string().trim().min(1),

  // Kinde
  KINDE_CLIENT_ID: z.string().trim().min(1),
  KINDE_CLIENT_SECRET: z.string().trim().min(1),
  KINDE_ISSUER_URL: z.string().trim().min(1),
  KINDE_SITE_URL: z.string().trim().min(1).default("http://localhost:3000"),
  KINDE_POST_LOGOUT_REDIRECT_URL: z
    .string()
    .trim()
    .min(1)
    .default("http://localhost:3000"),
  KINDE_POST_LOGIN_REDIRECT_URL: z
    .string()
    .trim()
    .min(1)
    .default("http://localhost:3000/dashboard"),

  // Convex
  CONVEX_DEPLOYMENT: z.string().trim().min(1),
  NEXT_PUBLIC_CONVEX_URL: z.string().trim().min(1),

  // App
  APP_BASE_URL: z.string().trim().min(1).default("http://localhost:3000"),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const env = envSchema.parse(process.env);
