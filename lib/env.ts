import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  ADMIN_BANK_ACCOUNT: z.string().min(1),
  ADMIN_BANK_IBAN: z.string().min(1),
  ADMIN_BANK_NAME: z.string().min(1),
  ADMIN_BANK_ACCOUNT_HOLDER: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  RESEND_API_KEY: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
});

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default("Servio"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_ADMIN_BANK_ACCOUNT: z.string().min(1),
  NEXT_PUBLIC_ADMIN_BANK_IBAN: z.string().min(1),
  NEXT_PUBLIC_ADMIN_BANK_NAME: z.string().min(1),
  NEXT_PUBLIC_ADMIN_BANK_ACCOUNT_HOLDER: z.string().min(1),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_REALTIME_URL: z.string().url().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
});

const serverEnv = serverSchema.parse(process.env);
const publicEnv = publicSchema.parse(process.env);

export const env = { ...serverEnv, ...publicEnv } as const;
export { serverEnv, publicEnv };
