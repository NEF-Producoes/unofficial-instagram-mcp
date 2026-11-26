import { Writable } from 'node:stream';
import { describe, expect, it } from '@jest/globals';
import { createLogger } from './logger.js';

function capture(): { stream: Writable; output: () => string } {
  const chunks: string[] = [];
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(String(chunk));
      callback();
    },
  });
  return { stream, output: () => chunks.join('') };
}

describe('createLogger', () => {
  it('redacts token and secret fields', () => {
    const { stream, output } = capture();
    const logger = createLogger('info', stream);

    logger.info(
      { accessToken: 'tok-123', appSecret: 'sec-456', nested: { token: 'tok-789' } },
      'hello',
    );

    expect(output()).toContain('hello');
    expect(output()).not.toContain('tok-123');
    expect(output()).not.toContain('sec-456');
    expect(output()).not.toContain('tok-789');
  });

  it('respects the configured level', () => {
    const { stream, output } = capture();
    createLogger('error', stream).info('should not appear');
    expect(output()).toBe('');
  });
});
