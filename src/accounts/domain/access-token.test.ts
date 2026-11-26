import { describe, expect, it } from '@jest/globals';
import { AccessToken } from './access-token.js';
import { InvalidAccessTokenError } from './errors.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date('2026-11-26T12:00:00Z');

describe('AccessToken', () => {
  it('rejects an empty token value', () => {
    expect(() => AccessToken.create('  ', new Date(now.getTime() + DAY_MS))).toThrow(
      InvalidAccessTokenError,
    );
  });

  it('reports expired when the expiration date is not in the future', () => {
    const token = AccessToken.create('abc', now);
    expect(token.isExpired(now)).toBe(true);
  });

  it('reports not expired when the expiration date is in the future', () => {
    const token = AccessToken.create('abc', new Date(now.getTime() + DAY_MS));
    expect(token.isExpired(now)).toBe(false);
  });

  it('needs refresh when it expires within the threshold', () => {
    const token = AccessToken.create('abc', new Date(now.getTime() + 5 * DAY_MS));
    expect(token.needsRefresh(now, 7)).toBe(true);
    expect(token.needsRefresh(now, 3)).toBe(false);
  });

  it('never exposes the raw value through toString or JSON', () => {
    const token = AccessToken.create('super-secret', new Date(now.getTime() + DAY_MS));
    expect(String(token)).not.toContain('super-secret');
    expect(JSON.stringify(token)).not.toContain('super-secret');
  });
});
