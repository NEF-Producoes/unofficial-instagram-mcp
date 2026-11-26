import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ListAccounts } from '../../accounts/application/list-accounts.js';

export interface ServerDependencies {
  listAccounts: ListAccounts;
}

const SERVER_INFO = { name: 'unofficial-instagram-mcp', version: '0.0.0' } as const;

const accountSummarySchema = z.object({
  alias: z.string(),
  instagramUserId: z.string(),
  grantedPermissions: z.array(z.string()),
  tokenExpiresAt: z.string().describe('ISO 8601 date-time'),
  tokenNeedsRefresh: z.boolean(),
});

/** Builds the MCP server and registers every tool. Transport is attached by the caller. */
export function createServer(dependencies: ServerDependencies): McpServer {
  const server = new McpServer(SERVER_INFO);

  server.registerTool(
    'list_accounts',
    {
      title: 'List Instagram accounts',
      description:
        'Lists the Instagram accounts connected to this server, with granted permissions and token expiration. Never returns access tokens.',
      inputSchema: {},
      outputSchema: { accounts: z.array(accountSummarySchema) },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      const summaries = await dependencies.listAccounts.execute();
      const accounts = summaries.map((summary) => ({
        ...summary,
        grantedPermissions: [...summary.grantedPermissions],
        tokenExpiresAt: summary.tokenExpiresAt.toISOString(),
      }));
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ accounts }, null, 2) }],
        structuredContent: { accounts },
      };
    },
  );

  return server;
}
