import type { Account } from '../domain/account.js';
import { AccountAlias } from '../domain/account-alias.js';
import type { AccountRepository } from '../domain/account-repository.js';
import { AccountNotFoundError, AmbiguousAccountError } from '../domain/errors.js';

/**
 * Picks the account a tool call applies to.
 * With several accounts and no explicit choice it refuses to guess, so nothing is
 * ever published to the wrong profile.
 */
export class ResolveAccount {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly defaultAlias?: string,
  ) {}

  async execute(requestedAlias?: string): Promise<Account> {
    const alias = requestedAlias ?? this.defaultAlias;
    if (alias !== undefined) {
      const account = await this.accounts.findByAlias(AccountAlias.create(alias));
      if (!account) {
        throw new AccountNotFoundError(`No account found with alias "${alias}"`);
      }
      return account;
    }

    const all = await this.accounts.list();
    const [only, ...rest] = all;
    if (!only) {
      throw new AccountNotFoundError('No Instagram account is connected yet');
    }
    if (rest.length > 0) {
      const names = all.map((a) => a.alias.value).join(', ');
      throw new AmbiguousAccountError(
        `Several accounts are connected (${names}); specify which one with the "account" parameter`,
      );
    }
    return only;
  }
}
