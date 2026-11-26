import type { Clock } from '../../shared/domain/clock.js';
import { InMemoryAccountRepository } from '../infrastructure/in-memory-account-repository.js';
import type { AddAccountInput } from './add-account.js';

export const FIXED_NOW = new Date('2026-11-26T12:00:00Z');

export const fixedClock: Clock = { now: () => FIXED_NOW };

export function newRepository(): InMemoryAccountRepository {
  return new InMemoryAccountRepository();
}

export function accountInput(overrides: Partial<AddAccountInput> = {}): AddAccountInput {
  return {
    alias: 'main',
    instagramUserId: '17841400000000001',
    accessToken: 'token-main',
    tokenExpiresAt: new Date(FIXED_NOW.getTime() + 60 * 24 * 60 * 60 * 1000),
    grantedPermissions: ['instagram_business_basic', 'instagram_business_content_publish'],
    ...overrides,
  };
}
