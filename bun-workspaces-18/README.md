# Module 18: Bun Workspaces - Modern Runtime for Monorepos

## 🎬 Video Script

---

### INTRO (0:00 - 2:00)

Hey everyone! I'm TK Sharma, and in this module, we're going to explore **Bun** - the fastest JavaScript runtime that's taking the developer world by storm.

Bun isn't just fast - it's an **all-in-one toolkit** that replaces:

- Node.js (runtime)
- npm/pnpm/yarn (package manager)
- Jest/Vitest (test runner)
- esbuild/webpack (bundler)

And the best part? It has **native workspace support** built right in!

By the end of this video, you'll build a full-stack monorepo with:

- A shared utilities package
- An API server using Hono
- A web app serving HTML
- All running on Bun!

Let's go!

---

### PART 1: Why Bun? (2:00 - 6:00)

#### Speed Comparison

```
npm install:     45 seconds
pnpm install:    12 seconds
bun install:     1.2 seconds  🚀
```

Bun is written in Zig (not JavaScript) and uses:

- JavaScriptCore (Safari's engine) instead of V8
- Native code for hot paths
- Optimized system calls

#### What Bun Replaces

| Tool            | Bun Equivalent           |
| --------------- | ------------------------ |
| Node.js         | `bun` runtime            |
| npm/yarn/pnpm   | `bun install`, `bun add` |
| npx             | `bunx`                   |
| Jest/Vitest     | `bun test`               |
| esbuild/webpack | `bun build`              |
| ts-node         | Native! (no config)      |
| nodemon         | `bun --watch`            |

#### When to Use Bun

✅ **Use Bun when:**

- You want faster installs and builds
- You're starting a new project
- You need native TypeScript support
- You want built-in testing

⚠️ **Be cautious when:**

- You need 100% Node.js compatibility
- Your project uses native Node addons
- You're in a highly regulated environment

---

### PART 2: Setting Up Bun Workspaces (6:00 - 12:00)

#### Install Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (via PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version
# 1.1.x
```

#### Project Structure

```
bun-workspaces-18/
├── apps/
│   ├── api/              # Backend API
│   └── web/              # Frontend web app
├── packages/
│   └── shared/           # Shared utilities
├── package.json          # Root workspace config
├── bunfig.toml           # Bun configuration
└── tsconfig.json
```

#### Workspace Configuration

```json
// package.json
{
  "name": "bun-workspaces-monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "dev": "bun --filter '*' dev",
    "build": "bun --filter '*' build",
    "test": "bun test"
  }
}
```

That's it! No `pnpm-workspace.yaml` needed - Bun reads `workspaces` from package.json.

#### Bun Configuration

```toml
# bunfig.toml
[install]
exact = true  # Save exact versions

[test]
coverage = true
coverageDir = "coverage"
```

---

### PART 3: Building the Shared Package (12:00 - 18:00)

#### Package Setup

```json
// packages/shared/package.json
{
  "name": "@repo/shared",
  "version": "1.0.0",
  "main": "src/index.ts", // Bun runs TS directly!
  "types": "src/index.ts",
  "scripts": {
    "test": "bun test"
  }
}
```

Notice: No build step needed! Bun runs TypeScript natively.

#### Shared Utilities

```typescript
// packages/shared/src/index.ts

// Validation
export const isEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Response helpers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const createResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

export const createError = (error: string): ApiResponse<never> => ({
  success: false,
  error,
});

// Constants
export const APP_NAME = 'Bun Monorepo Demo';
```

#### Writing Tests with Bun

```typescript
// packages/shared/src/index.test.ts
import { describe, expect, test } from 'bun:test';
import { isEmail, createResponse, createError } from './index';

describe('Validation', () => {
  test('isEmail validates correctly', () => {
    expect(isEmail('test@example.com')).toBe(true);
    expect(isEmail('invalid')).toBe(false);
  });
});

describe('Response helpers', () => {
  test('createResponse wraps data', () => {
    const response = createResponse({ id: 1 });
    expect(response.success).toBe(true);
    expect(response.data).toEqual({ id: 1 });
  });

  test('createError includes message', () => {
    const response = createError('Not found');
    expect(response.success).toBe(false);
    expect(response.error).toBe('Not found');
  });
});
```

Run tests:

```bash
bun test
# ✓ Validation > isEmail validates correctly
# ✓ Response helpers > createResponse wraps data
# ✓ Response helpers > createError includes message
# 3 pass
```

---

### PART 4: Building the API (18:00 - 26:00)

#### Using Hono Framework

Hono is a lightweight, fast web framework that works great with Bun.

```json
// apps/api/package.json
{
  "name": "api",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts"
  },
  "dependencies": {
    "@repo/shared": "workspace:*",
    "hono": "^4.0.0"
  }
}
```

#### API Server Code

```typescript
// apps/api/src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createResponse, createError, isEmail } from '@repo/shared';

const app = new Hono();

// Middleware
app.use('/*', cors());

// In-memory store
const users = [{ id: 1, name: 'John', email: 'john@example.com' }];

// Routes
app.get('/', (c) => {
  return c.json(createResponse({ message: 'Bun API running!' }));
});

app.get('/users', (c) => {
  return c.json(createResponse(users));
});

app.post('/users', async (c) => {
  const { name, email } = await c.req.json();

  if (!isEmail(email)) {
    return c.json(createError('Invalid email'), 400);
  }

  const user = { id: users.length + 1, name, email };
  users.push(user);
  return c.json(createResponse(user), 201);
});

// Start server - Bun style!
export default {
  port: 3000,
  fetch: app.fetch,
};
```

#### Start the API

```bash
cd apps/api
bun dev

# 🚀 Server running at http://localhost:3000
```

The `--watch` flag auto-restarts on file changes!

---

### PART 5: Performance Benchmarks (26:00 - 30:00)

#### Install Speed

```bash
# Clear node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Time the install
time bun install
# real    0m1.234s  ← Blazing fast!

# Compare to pnpm
time pnpm install
# real    0m8.567s
```

#### HTTP Server Performance

```bash
# Start the server
bun apps/api/src/index.ts

# Benchmark with wrk
wrk -t12 -c400 -d30s http://localhost:3000/users

# Bun + Hono: ~150,000 req/sec
# Node + Express: ~30,000 req/sec
```

**5x faster!** 🚀

#### Test Speed

```bash
time bun test
# real    0m0.156s

time jest
# real    0m3.234s
```

**20x faster tests!**

---

### PART 6: Advanced Bun Features (30:00 - 36:00)

#### Native SQLite

```typescript
import { Database } from 'bun:sqlite';

const db = new Database('mydb.sqlite');
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');
db.run('INSERT INTO users (name) VALUES (?)', ['John']);

const users = db.query('SELECT * FROM users').all();
console.log(users);
```

No npm packages needed!

#### Bun Build

```bash
# Bundle for production
bun build ./src/index.ts --outdir ./dist --target bun

# For browsers
bun build ./src/app.tsx --outdir ./dist --target browser
```

#### Bun Macros (Compile-time code)

```typescript
// This runs at BUILD time, not runtime!
import { getVersion } from './version' with { type: 'macro' };

// version.ts
export function getVersion() {
  return Bun.version;
}

// Result: The version is embedded as a string literal in the bundle
```

#### File I/O (Faster than Node)

```typescript
// Bun way - simpler and faster
const file = Bun.file('./data.json');
const data = await file.json();

// Write
await Bun.write('./output.txt', 'Hello Bun!');
```

---

### HANDS-ON: Let's Run It! (36:00 - 42:00)

```bash
# Navigate to the module
cd bun-workspaces-18

# Install dependencies (watch how fast!)
bun install

# Run all tests
bun test

# Start the API
bun run dev:api

# In another terminal, start the web app
bun run dev:web

# Or run both
bun run dev
```

#### Test the API

```bash
# Get users
curl http://localhost:3000/users

# Create user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com"}'
```

---

### OUTRO (42:00 - 43:00)

And that's Bun Workspaces! Let's recap:

✅ **10x faster installs** with `bun install`
✅ **Native TypeScript** - no config needed
✅ **Built-in test runner** with coverage
✅ **Workspace support** out of the box
✅ **Incredible performance** for HTTP servers

Bun is production-ready and being used by companies like **Vercel**, **Cloudflare**, and **Figma**.

In the next module, we'll explore **Remote Caching** to make your CI/CD pipelines blazing fast with Nx Cloud and Turborepo.

See you there!

---

## 📁 Files in This Module

```
bun-workspaces-18/
├── apps/
│   ├── api/                     # Backend API
│   │   ├── src/index.ts        # Hono server
│   │   └── package.json
│   └── web/                     # Web app
│       ├── src/index.ts        # HTML server
│       └── package.json
├── packages/
│   └── shared/                  # Shared utilities
│       ├── src/
│       │   ├── index.ts        # Exports
│       │   └── index.test.ts   # Tests
│       └── package.json
├── bunfig.toml                  # Bun config
├── package.json                 # Root workspace
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Run tests
bun test

# Start development
bun run dev:api   # http://localhost:3000
bun run dev:web   # http://localhost:3001
```

## 📚 Resources

- [Bun Documentation](https://bun.sh/docs)
- [Hono Framework](https://hono.dev/)
- [Bun Workspaces Guide](https://bun.sh/docs/install/workspaces)
