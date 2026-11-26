import type { AccessToken } from './access-token.js';
import type { AccountAlias } from './account-alias.js';
import { InvalidInstagramUserIdError } from './errors.js';

export interface AccountProps {
  alias: AccountAlias;
  instagramUserId: string;
  token: AccessToken;
  grantedPermissions: readonly string[];
  createdAt: Date;
}

/** An Instagram professional account connected to this server. */
export class Account {
  private constructor(
    readonly alias: AccountAlias,
    readonly instagramUserId: string,
    readonly token: AccessToken,
    readonly grantedPermissions: readonly string[],
    readonly createdAt: Date,
  ) {}

  static create(props: AccountProps): Account {
    if (!/^\d+$/.test(props.instagramUserId)) {
      throw new InvalidInstagramUserIdError('Instagram user id must contain only digits');
    }
    return new Account(
      props.alias,
      props.instagramUserId,
      props.token,
      [...props.grantedPermissions],
      props.createdAt,
    );
  }

  withToken(token: AccessToken): Account {
    return new Account(
      this.alias,
      this.instagramUserId,
      token,
      this.grantedPermissions,
      this.createdAt,
    );
  }

  hasPermission(permission: string): boolean {
    return this.grantedPermissions.includes(permission);
  }
}
