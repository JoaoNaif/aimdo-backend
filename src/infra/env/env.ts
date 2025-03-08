import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
  PORT: z.coerce.number().optional().default(3333),
  BASE_URL: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number().optional().default(2525),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
})

export type Env = z.infer<typeof envSchema>
