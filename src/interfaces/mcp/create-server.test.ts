import { afterEach, describe, expect, it } from '@jest/globals';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import {
  accountInput,
  fixedClock,
  newRepository,
} from '../../accounts/application/account-test-support.test-support.js';
import { AddAccount } from '../../accounts/application/add-account.js';
import { ListAccounts } from '../../accounts/application/list-accounts.js';
import { createServer } from './create-server.js';

let client: Client | undefined;

async function connect(withAccount: boolean): Promise<Client> {
  const repository = newRepository();
  if (withAccount) {
    await new AddAccount(repository, fixedClock).execute(accountInput());
  }
  const server = createServer({ listAccounts: new ListAccounts(repository, fixedClock) });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  client = new Client({ name: 'test-client', version: '0.0.0' });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

afterEach(async () => {
  await client?.close();
  client = undefined;
});

describe('MCP server', () => {
  it('exposes list_accounts as a read-only tool', async () => {
    const { tools } = await (await connect(false)).listTools();
    const tool = tools.find((t) => t.name === 'list_accounts');

    expect(tool).toBeDefined();
    expect(tool?.annotations?.readOnlyHint).toBe(true);
    expect(tool?.annotations?.destructiveHint).toBe(false);
  });

  it('returns connected accounts without any token', async () => {
    const result = await (await connect(true)).callTool({ name: 'list_accounts', arguments: {} });

    expect(result.isError).toBeFalsy();
    expect(result.structuredContent).toMatchObject({
      accounts: [{ alias: 'main', instagramUserId: '17841400000000001' }],
    });
    expect(JSON.stringify(result)).not.toContain('token-main');
  });

  it('returns an empty list when no account is connected', async () => {
    const result = await (await connect(false)).callTool({ name: 'list_accounts', arguments: {} });
    expect(result.structuredContent).toEqual({ accounts: [] });
  });
});
