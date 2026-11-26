import { pino } from 'pino';

export type Logger = pino.Logger;

const SECRET_KEYS = ['accessToken', 'appSecret', 'token', 'secret', 'tokenEncryptionKey'];

/**
 * Creates a JSON logger that writes to stderr by default.
 * Stdout is reserved for the MCP protocol when running over stdio.
 */
export function createLogger(
  level: string,
  destination: NodeJS.WritableStream = process.stderr,
): Logger {
  return pino(
    {
      level,
      redact: {
        paths: [...SECRET_KEYS, ...SECRET_KEYS.map((key) => `*.${key}`)],
        censor: '[REDACTED]',
      },
    },
    destination,
  );
}
