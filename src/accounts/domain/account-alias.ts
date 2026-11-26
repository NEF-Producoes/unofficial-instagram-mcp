import { InvalidAccountAliasError } from './errors.js';

const ALIAS_PATTERN = /^[a-z0-9_-]{1,32}$/;

/** Short, human friendly identifier used to select an account in every tool call. */
export class AccountAlias {
  private constructor(readonly value: string) {}

  static create(raw: string): AccountAlias {
    const normalized = raw.trim().toLowerCase();
    if (!ALIAS_PATTERN.test(normalized)) {
      throw new InvalidAccountAliasError(
        'Account alias must have 1 to 32 characters: letters, digits, hyphen or underscore',
      );
    }
    return new AccountAlias(normalized);
  }

  equals(other: AccountAlias): boolean {
    return this.value === other.value;
  }
}
