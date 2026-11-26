import { describe, expect, it } from '@jest/globals';
import { loadConfig } from './config.js';

const validKey = Buffer.alloc(32, 1).toString('base64');

describe('loadConfig', () => {
  it('applies defaults when the environment is empty', () => {
    const config = loadConfig({});
    expect(config).toMatchObject({
      mode: 'local',
      logLevel: 'info',
      databasePath: './data/unofficial-instagram-mcp.sqlite',
    });
  });

  it('reads explicit values', () => {
    const config = loadConfig({
      MODE: 'server',
      LOG_LEVEL: 'debug',
      META_APP_ID: '123',
      META_APP_SECRET: 'secret',
      TOKEN_ENCRYPTION_KEY: validKey,
      DEFAULT_ACCOUNT: 'Main',
    });
    expect(config).toMatchObject({
      mode: 'server',
      logLevel: 'debug',
      metaAppId: '123',
      metaAppSecret: 'secret',
      defaultAccount: 'main',
    });
    expect(config.tokenEncryptionKey?.length).toBe(32);
  });

  it('rejects an unknown mode', () => {
    expect(() => loadConfig({ MODE: 'cloud' })).toThrow(/MODE/);
  });

  it('rejects an encryption key that is not 32 bytes', () => {
    const shortKey = Buffer.alloc(16, 1).toString('base64');
    expect(() => loadConfig({ TOKEN_ENCRYPTION_KEY: shortKey })).toThrow(/TOKEN_ENCRYPTION_KEY/);
  });

  it('treats empty strings as unset', () => {
    const config = loadConfig({ META_APP_ID: '', TOKEN_ENCRYPTION_KEY: '' });
    expect(config.metaAppId).toBeUndefined();
    expect(config.tokenEncryptionKey).toBeUndefined();
  });

  it('never echoes secret values in validation errors', () => {
    try {
      loadConfig({ TOKEN_ENCRYPTION_KEY: 'not-a-valid-key-but-secret' });
      throw new Error('expected loadConfig to throw');
    } catch (error) {
      expect(String(error)).not.toContain('not-a-valid-key-but-secret');
    }
  });
});
