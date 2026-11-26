import { describe, expect, it } from '@jest/globals';
import { AccountNotFoundError, AmbiguousAccountError } from '../domain/errors.js';
import { accountInput, fixedClock, newRepository } from './account-test-support.test-support.js';
import { AddAccount } from './add-account.js';
import { ResolveAccount } from './resolve-account.js';

async function setup(aliases: string[], defaultAlias?: string) {
  const repository = newRepository();
  const add = new AddAccount(repository, fixedClock);
  for (const [index, alias] of aliases.entries()) {
    await add.execute(accountInput({ alias, instagramUserId: `1784140000000000${index}` }));
  }
  return new ResolveAccount(repository, defaultAlias);
}

describe('ResolveAccount', () => {
  it('returns the requested account', async () => {
    const resolve = await setup(['main', 'clinic']);
    expect((await resolve.execute('clinic')).alias.value).toBe('clinic');
  });

  it('is case insensitive on the requested alias', async () => {
    const resolve = await setup(['main']);
    expect((await resolve.execute('MAIN')).alias.value).toBe('main');
  });

  it('throws when the requested alias does not exist', async () => {
    const resolve = await setup(['main']);
    await expect(resolve.execute('ghost')).rejects.toThrow(AccountNotFoundError);
  });

  it('uses the only account when none is requested', async () => {
    const resolve = await setup(['main']);
    expect((await resolve.execute()).alias.value).toBe('main');
  });

  it('uses the configured default account when several exist', async () => {
    const resolve = await setup(['main', 'clinic'], 'clinic');
    expect((await resolve.execute()).alias.value).toBe('clinic');
  });

  it('refuses to guess when several accounts exist and no default is set', async () => {
    const resolve = await setup(['main', 'clinic']);
    await expect(resolve.execute()).rejects.toThrow(AmbiguousAccountError);
  });

  it('throws when there are no accounts at all', async () => {
    const resolve = await setup([]);
    await expect(resolve.execute()).rejects.toThrow(AccountNotFoundError);
  });
});
