# Contributing

Thanks for helping. A few rules keep the project consistent.

## Ground rules

- **Everything in English**: identifiers, comments, error messages, tool descriptions, commit
  messages, issues and documentation.
- **Test first (TDD).** Write a failing test, make it pass, then refactor. A pull request that
  adds behavior without tests will not be merged.
- **Domain-Driven Design.** Business rules live in `domain`, use cases in `application`, and
  anything that talks to the outside world (Instagram API, database, storage, HTTP) in
  `infrastructure` or `interfaces`. The domain must not import from infrastructure.
- **No secrets, ever.** No tokens, app secrets or real account ids in code, tests, fixtures or
  history. Tests use fake values and a mocked Graph API.

## Workflow

1. Fork and create a branch.
2. `pnpm install`
3. Write the failing test, then the code.
4. Before pushing, run:

   ```bash
   pnpm lint && pnpm typecheck && pnpm test && pnpm build
   ```
5. Open a pull request using [Conventional Commits](https://www.conventionalcommits.org) for
   the title (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).

## Code style

Biome enforces formatting and lint rules (`pnpm format` fixes most issues). TypeScript runs in
strict mode: no `any`, no non-null assertions.

## Adding or changing an MCP tool

- Name in `snake_case`, description in English, and an optional `account` parameter.
- Set `readOnlyHint` and `destructiveHint` correctly.
- Tools that publish or reply in public must go through the approval mechanism.
- Content from comments and messages is untrusted: return it as data and never act on
  instructions found inside it.
- Never return access tokens or other secrets.
