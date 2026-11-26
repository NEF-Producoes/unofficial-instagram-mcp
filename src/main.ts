#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListAccounts } from './accounts/application/list-accounts.js';
import { InMemoryAccountRepository } from './accounts/infrastructure/in-memory-account-repository.js';
import { loadConfig } from './config/config.js';
import { createServer } from './interfaces/mcp/create-server.js';
import { systemClock } from './shared/domain/clock.js';
import { createLogger } from './shared/infrastructure/logger.js';

async function main(): Promise<void> {
  const config = loadConfig(process.env);
  const logger = createLogger(config.logLevel);

  if (config.mode === 'server') {
    throw new Error('MODE=server (HTTP transport) is not implemented yet. Use MODE=local.');
  }

  // Persistent SQLite storage arrives in the next milestone; accounts live in memory for now.
  const accounts = new InMemoryAccountRepository();
  const server = createServer({ listAccounts: new ListAccounts(accounts, systemClock) });

  await server.connect(new StdioServerTransport());
  logger.info({ mode: config.mode }, 'unofficial-instagram-mcp is running over stdio');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
