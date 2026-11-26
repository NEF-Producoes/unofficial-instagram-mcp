# unofficial-instagram-mcp

Open-source [MCP](https://modelcontextprotocol.io) server for the Instagram API. It lets an AI
assistant such as Claude publish Reels, photos and carousels, manage comments and direct
messages, and read insights, across one or many Instagram professional accounts.

> **Not affiliated with Meta or Instagram.** This is an independent community project.
> "Instagram" and "Meta" are trademarks of their respective owners.

## Status

Early development. Only the foundation exists today:

| Area                                                                      | State   |
| ------------------------------------------------------------------------- | ------- |
| Multi-account model (accounts, aliases, token expiry, account resolution) | Done    |
| MCP server over stdio with the `list_accounts` tool                       | Done    |
| Configuration, redacting logger, CI                                       | Done    |
| Persistent storage (SQLite) and encrypted tokens                          | Next    |
| Publishing (Reels, photos, carousels, Stories)                            | Planned |
| Comments, insights                                                        | Planned |
| Direct messages and webhooks                                              | Planned |
| HTTP transport, S3-compatible media storage, scheduling                   | Planned |

## Design goals

- **Multi-account from day one.** Every tool takes an `account` parameter. With several
  accounts connected and no explicit choice, a tool refuses to guess instead of posting to the
  wrong profile.
- **Two ways to run.** `MODE=local` (stdio, on your own computer) or `MODE=server`
  (HTTP, self-hosted). There is no hosted service: each user runs their own server and brings
  their own Meta app.
- **Choose your media path.** Local files, S3-compatible storage (Cloudflare R2, Backblaze B2,
  MinIO, Supabase Storage) or a public URL. Uploaded media is deleted after publishing.
- **Choose your scheduler.** A built-in SQLite queue or an n8n workflow.
- **Safe by default.** Access tokens are encrypted at rest and never returned by any tool.
  Comments and DMs are untrusted input and must be treated as data, never as instructions.

## Requirements

- Node.js 22 or newer and pnpm.
- An Instagram **professional** account (Business or Creator).
- A Meta app of type _Business_ with the Instagram product. Add each profile as an Instagram
  Tester while the app is in development mode. Operating accounts you do not own requires
  Meta's App Review.

## Quick start (local mode)

```bash
pnpm install
pnpm build
cp .env.example .env   # then edit the values
```

Add the server to your MCP client. Example for Claude Code:

```bash
claude mcp add instagram -- node /absolute/path/to/unofficial-instagram-mcp/dist/main.js
```

## Configuration

All configuration comes from environment variables. See [`.env.example`](.env.example).

| Variable                          | Default                                  | Description                                               |
| --------------------------------- | ---------------------------------------- | --------------------------------------------------------- |
| `MODE`                            | `local`                                  | `local` (stdio) or `server` (HTTP, not implemented yet)   |
| `LOG_LEVEL`                       | `info`                                   | `fatal`, `error`, `warn`, `info`, `debug` or `trace`      |
| `DATABASE_PATH`                   | `./data/unofficial-instagram-mcp.sqlite` | SQLite file                                               |
| `META_APP_ID` / `META_APP_SECRET` | none                                     | Credentials of your Meta app                              |
| `TOKEN_ENCRYPTION_KEY`            | none                                     | 32 bytes, base64. Generate with `openssl rand -base64 32` |
| `DEFAULT_ACCOUNT`                 | none                                     | Alias used when a tool call omits `account`               |

Never commit real values. Use your platform's secret store in production.

## Architecture

Domain-Driven Design with one bounded context per concern:

```
src/
  shared/        errors, clock, logger
  accounts/      domain, application, infrastructure
  publishing/    (planned)
  engagement/    (planned)
  messaging/     (planned)
  insights/      (planned)
  interfaces/
    mcp/         MCP tools
```

The domain layer never depends on infrastructure. The Instagram API, storage and scheduler are
reached through ports implemented in each context's `infrastructure` folder.

## Development

The project is built test-first (TDD) with Jest.

```bash
pnpm test            # run the test suite
pnpm test:watch      # watch mode
pnpm test:coverage   # coverage report
pnpm lint            # Biome lint and format check
pnpm format          # apply Biome fixes
pnpm typecheck       # TypeScript, no emit
pnpm build           # compile to dist/
```

See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

[0BSD](LICENSE). Use it for any purpose, with no conditions.
