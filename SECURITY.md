# Security policy

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's
[private vulnerability reporting](../../security/advisories/new) on this repository.

## Scope notes

- Access tokens are encrypted at rest and must never appear in logs, tool results or errors.
- Comments and direct messages come from third parties. They are untrusted input and a possible
  prompt-injection vector. Keep read tools separate from tools that publish or send.
- Each user runs their own server with their own Meta app. Protect `META_APP_SECRET` and
  `TOKEN_ENCRYPTION_KEY` with your platform's secret store.
