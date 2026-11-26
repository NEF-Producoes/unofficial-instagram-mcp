import type { Account } from './account.js';
import type { AccountAlias } from './account-alias.js';

/** Port for account persistence. Implementations live in the infrastructure layer. */
export interface AccountRepository {
  save(account: Account): Promise<void>;
  findByAlias(alias: AccountAlias): Promise<Account | undefined>;
  findByInstagramUserId(instagramUserId: string): Promise<Account | undefined>;
  list(): Promise<Account[]>;
  remove(alias: AccountAlias): Promise<void>;
}
