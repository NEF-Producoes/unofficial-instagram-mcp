import { describe, expect, it } from '@jest/globals';
import { AccountAlias } from './account-alias.js';
import { InvalidAccountAliasError } from './errors.js';

describe('AccountAlias', () => {
  it('normalizes to lowercase and trims whitespace', () => {
    expect(AccountAlias.create('  My-Clinic ').value).toBe('my-clinic');
  });

  it('accepts letters, digits, hyphens and underscores', () => {
    expect(AccountAlias.create('brand_01-b').value).toBe('brand_01-b');
  });

  it.each(['', '   ', 'has space', 'bad/char', 'acentuação', 'a'.repeat(33)])(
    'rejects invalid alias %p',
    (raw) => {
      expect(() => AccountAlias.create(raw)).toThrow(InvalidAccountAliasError);
    },
  );

  it('considers two aliases with the same normalized value equal', () => {
    expect(AccountAlias.create('Main').equals(AccountAlias.create('main'))).toBe(true);
  });
});
