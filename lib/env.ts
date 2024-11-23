import { z } from "zod";

const envSchema = z.object({
  ASSEMBLYAI_API_KEY: z.string().trim().min(1),
  SUPERVIZ_CLIENT_ID: z.string().trim().min(1),
  SUPERVIZ_SECRET_KEY: z.string().trim().min(1),
  RESEND_API_KEY: z.string().trim().min(1),
  APP_BASE_URL: z.string().trim().min(1).default("http://localhost:3000"),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const env = envSchema.parse(process.env);
