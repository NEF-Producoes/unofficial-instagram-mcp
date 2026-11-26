import type { Account } from '../domain/account.js';
import type { AccountAlias } from '../domain/account-alias.js';
import type { AccountRepository } from '../domain/account-repository.js';

/** Volatile repository used by tests and by quick local experiments. */
export class InMemoryAccountRepository implements AccountRepository {
  readonly #accounts = new Map<string, Account>();

  async save(account: Account): Promise<void> {
    this.#accounts.set(account.alias.value, account);
  }

  async findByAlias(alias: AccountAlias): Promise<Account | undefined> {
    return this.#accounts.get(alias.value);
  }

  async findByInstagramUserId(instagramUserId: string): Promise<Account | undefined> {
    return [...this.#accounts.values()].find((a) => a.instagramUserId === instagramUserId);
  }

  async list(): Promise<Account[]> {
    return [...this.#accounts.values()];
  }

  async remove(alias: AccountAlias): Promise<void> {
    this.#accounts.delete(alias.value);
  }
}
