import type { Clock } from '../../shared/domain/clock.js';
import { AccessToken } from '../domain/access-token.js';
import { Account } from '../domain/account.js';
import { AccountAlias } from '../domain/account-alias.js';
import type { AccountRepository } from '../domain/account-repository.js';
import { AccountAlreadyExistsError, InvalidAccessTokenError } from '../domain/errors.js';

export interface AddAccountInput {
  alias: string;
  instagramUserId: string;
  accessToken: string;
  tokenExpiresAt: Date;
  grantedPermissions: readonly string[];
}

export class AddAccount {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: AddAccountInput): Promise<void> {
    const alias = AccountAlias.create(input.alias);
    const token = AccessToken.create(input.accessToken, input.tokenExpiresAt);
    const now = this.clock.now();

    if (token.isExpired(now)) {
      throw new InvalidAccessTokenError('Access token is already expired');
    }
    if (await this.accounts.findByAlias(alias)) {
      throw new AccountAlreadyExistsError(`An account with alias "${alias.value}" already exists`);
    }
    if (await this.accounts.findByInstagramUserId(input.instagramUserId)) {
      throw new AccountAlreadyExistsError(
        `Instagram user ${input.instagramUserId} is already registered under another alias`,
      );
    }

    await this.accounts.save(
      Account.create({
        alias,
        instagramUserId: input.instagramUserId,
        token,
        grantedPermissions: input.grantedPermissions,
        createdAt: now,
      }),
    );
  }
}
