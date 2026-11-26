import { describe, expect, it } from '@jest/globals';
import { AccountAlreadyExistsError } from '../domain/errors.js';
import { accountInput, fixedClock, newRepository } from './account-test-support.test-support.js';
import { AddAccount } from './add-account.js';

describe('AddAccount', () => {
  it('stores a new account', async () => {
    const repository = newRepository();
    await new AddAccount(repository, fixedClock).execute(accountInput());

    const stored = await repository.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.alias.value).toBe('main');
  });

  it('rejects a duplicated alias', async () => {
    const repository = newRepository();
    const useCase = new AddAccount(repository, fixedClock);
    await useCase.execute(accountInput());

    await expect(useCase.execute(accountInput({ instagramUserId: '999' }))).rejects.toThrow(
      AccountAlreadyExistsError,
    );
  });

  it('rejects the same Instagram user registered under another alias', async () => {
    const repository = newRepository();
    const useCase = new AddAccount(repository, fixedClock);
    await useCase.execute(accountInput());

    await expect(useCase.execute(accountInput({ alias: 'other' }))).rejects.toThrow(
      AccountAlreadyExistsError,
    );
  });

  it('rejects a token that is already expired', async () => {
    const useCase = new AddAccount(newRepository(), fixedClock);
    await expect(
      useCase.execute(accountInput({ tokenExpiresAt: new Date('2026-01-01T00:00:00Z') })),
    ).rejects.toThrow('expired');
  });
});
