import { z } from 'zod';

export interface Config {
  mode: 'local' | 'server';
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  databasePath: string;
  metaAppId: string | undefined;
  metaAppSecret: string | undefined;
  /** 32 raw bytes used to encrypt access tokens at rest. */
  tokenEncryptionKey: Buffer | undefined;
  /** Account alias used when a tool call does not specify one. */
  defaultAccount: string | undefined;
}

const emptyToUndefined = (value: unknown): unknown => (value === '' ? undefined : value);

const optionalString = z.preprocess(emptyToUndefined, z.string().trim().min(1).optional());

const encryptionKey = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .refine((value) => Buffer.from(value, 'base64').length === 32, {
      message: 'must be 32 bytes encoded as base64 (generate with: openssl rand -base64 32)',
    })
    .transform((value) => Buffer.from(value, 'base64'))
    .optional(),
);

const envSchema = z.object({
  MODE: z.preprocess(emptyToUndefined, z.enum(['local', 'server']).default('local')),
  LOG_LEVEL: z.preprocess(
    emptyToUndefined,
    z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  ),
  DATABASE_PATH: z.preprocess(
    emptyToUndefined,
    z.string().min(1).default('./data/unofficial-instagram-mcp.sqlite'),
  ),
  META_APP_ID: optionalString,
  META_APP_SECRET: optionalString,
  TOKEN_ENCRYPTION_KEY: encryptionKey,
  DEFAULT_ACCOUNT: optionalString,
});

/**
 * Parses and validates environment variables.
 * Error messages list variable names and reasons only, never the offending values,
 * so secrets cannot leak into logs.
 */
export function loadConfig(env: Record<string, string | undefined>): Config {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid configuration: ${details}`);
  }
  const values = parsed.data;
  return {
    mode: values.MODE,
    logLevel: values.LOG_LEVEL,
    databasePath: values.DATABASE_PATH,
    metaAppId: values.META_APP_ID,
    metaAppSecret: values.META_APP_SECRET,
    tokenEncryptionKey: values.TOKEN_ENCRYPTION_KEY,
    defaultAccount: values.DEFAULT_ACCOUNT?.toLowerCase(),
  };
}
