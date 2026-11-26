import type { Clock } from '../../shared/domain/clock.js';
import type { AccountRepository } from '../domain/account-repository.js';

const REFRESH_THRESHOLD_DAYS = 7;

/** Read model for an account. It intentionally has no access token field. */
export interface AccountSummary {
  alias: string;
  instagramUserId: string;
  grantedPermissions: readonly string[];
  tokenExpiresAt: Date;
  tokenNeedsRefresh: boolean;
}

export class ListAccounts {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly clock: Clock,
  ) {}

  async execute(): Promise<AccountSummary[]> {
    const now = this.clock.now();
    const accounts = await this.accounts.list();
    return accounts.map((account) => ({
      alias: account.alias.value,
      instagramUserId: account.instagramUserId,
      grantedPermissions: account.grantedPermissions,
      tokenExpiresAt: account.token.expiresAt,
      tokenNeedsRefresh: account.token.needsRefresh(now, REFRESH_THRESHOLD_DAYS),
    }));
  }
}
