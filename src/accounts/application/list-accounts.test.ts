import { describe, expect, it } from '@jest/globals';
import { accountInput, fixedClock, newRepository } from './account-test-support.test-support.js';
import { AddAccount } from './add-account.js';
import { ListAccounts } from './list-accounts.js';

describe('ListAccounts', () => {
  it('returns an empty list when there are no accounts', async () => {
    expect(await new ListAccounts(newRepository(), fixedClock).execute()).toEqual([]);
  });

  it('returns summaries that never contain the access token', async () => {
    const repository = newRepository();
    await new AddAccount(repository, fixedClock).execute(accountInput());

    const summaries = await new ListAccounts(repository, fixedClock).execute();

    expect(summaries).toEqual([
      {
        alias: 'main',
        instagramUserId: '17841400000000001',
        grantedPermissions: ['instagram_business_basic', 'instagram_business_content_publish'],
        tokenExpiresAt: new Date('2027-01-25T12:00:00Z'),
        tokenNeedsRefresh: false,
      },
    ]);
    expect(JSON.stringify(summaries)).not.toContain('token-main');
  });

  it('flags tokens that are close to expiring', async () => {
    const repository = newRepository();
    await new AddAccount(repository, fixedClock).execute(
      accountInput({ tokenExpiresAt: new Date('2026-11-30T12:00:00Z') }),
    );

    const [summary] = await new ListAccounts(repository, fixedClock).execute();
    expect(summary?.tokenNeedsRefresh).toBe(true);
  });
});
