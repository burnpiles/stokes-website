---
name: environment quirks
description: Non-obvious runtime/tooling gotchas in this Replit container that cost rework.
---

- **code_execution sandbox has no `process.env`.** Accessing `process.env.X` throws `Cannot read properties of undefined`. To read secrets/env vars, run in `bash` (where env vars are present) or use the provided `viewEnvVars` callback — not raw `process.env` in the JS sandbox.
- **`python3` is not installed in bash.** Use `node -e` for JSON parsing in shell pipelines (e.g. read stdin, `JSON.parse`, log fields).
