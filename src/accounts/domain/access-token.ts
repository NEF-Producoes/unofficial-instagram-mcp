import { InvalidAccessTokenError } from './errors.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Instagram user access token with its expiration date.
 * The raw value is a private field so it cannot leak through logging or serialization.
 */
export class AccessToken {
  readonly #value: string;

  private constructor(
    value: string,
    readonly expiresAt: Date,
  ) {
    this.#value = value;
  }

  static create(value: string, expiresAt: Date): AccessToken {
    if (value.trim().length === 0) {
      throw new InvalidAccessTokenError('Access token must not be empty');
    }
    return new AccessToken(value.trim(), expiresAt);
  }

  /** Returns the raw token. Call only where the value must be sent to the Instagram API or encrypted. */
  reveal(): string {
    return this.#value;
  }

  isExpired(now: Date): boolean {
    return this.expiresAt.getTime() <= now.getTime();
  }

  needsRefresh(now: Date, thresholdDays: number): boolean {
    return this.expiresAt.getTime() - now.getTime() <= thresholdDays * DAY_MS;
  }

  toString(): string {
    return '[REDACTED]';
  }

  toJSON(): string {
    return '[REDACTED]';
  }
}
