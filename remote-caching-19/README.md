# Module 19: Remote Caching - Distributed Build Caching

## 🎬 Video Script

---

### INTRO (0:00 - 2:00)

Hey everyone! Welcome back to Monorepo Mastery. I'm TK Sharma, and in this module, we're tackling one of the most impactful optimizations you can make to your monorepo - **Remote Caching**.

Imagine this scenario:

- Your CI takes 20 minutes
- 10 developers push PRs daily
- That's **3+ hours** of CI time wasted **every day**

What if I told you that with remote caching, you could cut that to **2 minutes**?

In this module, you'll learn:

- How remote caching works
- Setting up **Nx Cloud** (free tier available!)
- Setting up **Turborepo Remote Cache**
- Self-hosted options with Docker

Let's make your CI blazing fast!

---

### PART 1: Understanding Remote Caching (2:00 - 8:00)

#### The Problem: Wasteful Rebuilds

```
Without Remote Caching:
┌─────────────────────────────────────────────────────┐
│ Developer A pushes PR                               │
│   → CI builds ALL packages (20 min)                 │
│                                                     │
│ Developer B pushes PR (same code, different branch) │
│   → CI builds ALL packages AGAIN (20 min)           │
│                                                     │
│ Developer A pushes fix                              │
│   → CI builds ALL packages AGAIN (20 min)           │
└─────────────────────────────────────────────────────┘
Total: 60 minutes of builds 😰
```

#### The Solution: Shared Cache

```
With Remote Caching:
┌─────────────────────────────────────────────────────┐
│ Developer A pushes PR                               │
│   → CI builds packages, uploads to cache (20 min)   │
│   → Cache: ████████████ (filled)                    │
│                                                     │
│ Developer B pushes PR                               │
│   → CI downloads from cache (30 sec!) ✅           │
│                                                     │
│ Developer A pushes fix                              │
│   → Only changed package rebuilds (2 min) ✅       │
└─────────────────────────────────────────────────────┘
Total: ~23 minutes (4x faster!)
```

#### How It Works

```
Build Request: "build @myorg/utils"
        ↓
Calculate Hash (inputs: source files, deps, env)
        ↓
Hash: abc123xyz
        ↓
┌───────────────────────────────┐
│ Check Remote Cache            │
│ GET /cache/abc123xyz          │
└───────────────────────────────┘
        │
   ┌────┴────┐
   │         │
  HIT       MISS
   ↓         ↓
Download   Run build
outputs    Upload outputs
   ↓         ↓
   └────┬────┘
        ↓
    Continue
```

#### Cache Inputs (What Makes a Hash)

| Input Type   | Examples                      |
| ------------ | ----------------------------- |
| Source files | `src/**/*.ts`, `src/**/*.tsx` |
| Dependencies | `package.json`, lockfile      |
| Config       | `tsconfig.json`, `.env`       |
| Runtime      | Node version, OS              |

If ANY input changes → new hash → cache miss → rebuild.

---

### PART 2: Nx Cloud Setup (8:00 - 18:00)

#### Why Nx Cloud?

- **Free tier** - 500 hours/month (plenty for most teams)
- **Zero config** - One command to connect
- **Distributed Task Execution** - Parallelize across agents
- **Beautiful dashboard** - Insights and analytics

#### Step 1: Connect to Nx Cloud

```bash
# In your Nx workspace
npx nx connect

# You'll see:
# ✅ Nx Cloud has been enabled
# ✅ Your access token has been saved to nx.json
```

This adds to `nx.json`:

```json
{
  "nxCloudAccessToken": "YOUR_TOKEN_HERE"
}
```

#### Step 2: Configure Caching

```json
// nx.json
{
  "nxCloudAccessToken": "xxx",
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "cache": true,
      "inputs": ["default", "^production"]
    },
    "lint": {
      "cache": true
    }
  },
  "namedInputs": {
    "default": ["{projectRoot}/**/*"],
    "production": ["default", "!{projectRoot}/**/*.spec.ts", "!{projectRoot}/test/**/*"]
  }
}
```

#### Step 3: Run With Remote Cache

```bash
# First run - builds and uploads
nx build my-app
# > NX   Successfully ran target build (45s)
# > NX   Uploaded to remote cache

# Second run - instant!
nx build my-app
# > NX   Successfully ran target build (0.5s)
# > NX   Retrieved from remote cache 🎉
```

#### Step 4: CI Configuration

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

env:
  NX_CLOUD_ACCESS_TOKEN: ${{ secrets.NX_CLOUD_ACCESS_TOKEN }}

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Important for affected!

      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install

      # Only build/test affected packages!
      - run: npx nx affected -t lint test build
```

#### Distributed Task Execution (DTE)

Run tasks in parallel across multiple CI agents:

```yaml
# .github/workflows/ci.yml
jobs:
  agents:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        agent: [1, 2, 3] # 3 parallel agents
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: npx nx-cloud start-agent

  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: npx nx-cloud start-ci-run --distribute-on="3 agents"
      - run: npx nx affected -t lint test build
```

---

### PART 3: Turborepo Remote Cache (18:00 - 28:00)

#### Vercel Remote Cache (Default)

If you deploy to Vercel, remote caching is **automatic**!

```bash
# Login to Vercel
npx turbo login

# Link your repo
npx turbo link

# That's it! Caching enabled.
```

#### Manual Setup

```bash
# Get your tokens
npx turbo login

# Set environment variables
export TURBO_TOKEN=your_token
export TURBO_TEAM=your_team
```

#### turbo.json Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"],
      "cache": true
    },
    "test": {
      "outputs": ["coverage/**"],
      "cache": true
    },
    "lint": {
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

#### CI with Turborepo

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm turbo build test lint
```

#### Turborepo Cache Stats

```bash
turbo build --summarize

# Output:
# Tasks:    8 successful, 8 total
# Cached:   7 cached, 8 total
# Time:     1.2s
#
# Cache hit rate: 87.5%
```

---

### PART 4: Self-Hosted Cache (28:00 - 35:00)

#### Why Self-Host?

- **Data sovereignty** - Keep cache in your infrastructure
- **No external dependencies** - Works in air-gapped environments
- **Cost control** - Free (just compute + storage)
- **Custom policies** - Your rules for retention

#### Option 1: Turborepo Custom Cache Server

```yaml
# docker-compose.yml
version: '3.8'

services:
  turbo-cache:
    image: ducktors/turborepo-remote-cache:latest
    ports:
      - '3000:3000'
    environment:
      - STORAGE_PROVIDER=local
      - STORAGE_PATH=/cache
      - TURBO_TOKEN=your-secret-token
    volumes:
      - turbo-cache:/cache

volumes:
  turbo-cache:
```

```bash
# Start the server
docker-compose up -d

# Configure Turborepo
export TURBO_API=http://localhost:3000
export TURBO_TOKEN=your-secret-token
export TURBO_TEAM=my-team

# Run build
turbo build
```

#### Option 2: S3-Compatible Storage

```yaml
# docker-compose.yml
services:
  minio:
    image: minio/minio:latest
    ports:
      - '9000:9000'
    command: server /data
    environment:
      - MINIO_ROOT_USER=admin
      - MINIO_ROOT_PASSWORD=password

  turbo-cache:
    image: ducktors/turborepo-remote-cache:latest
    environment:
      - STORAGE_PROVIDER=s3
      - S3_ENDPOINT=http://minio:9000
      - S3_BUCKET=turbo-cache
      - S3_ACCESS_KEY=admin
      - S3_SECRET_KEY=password
      - TURBO_TOKEN=secret
```

#### Production Checklist

| Item           | Details                        |
| -------------- | ------------------------------ |
| **HTTPS**      | Use TLS in production          |
| **Auth**       | Strong, rotated tokens         |
| **Storage**    | Persistent volumes or S3       |
| **Cleanup**    | TTL or LRU eviction policy     |
| **Monitoring** | Cache hit rates, storage usage |

---

### PART 5: Measuring Impact (35:00 - 40:00)

#### Before vs After Metrics

```
Metric                  Before      After       Improvement
─────────────────────────────────────────────────────────────
Average CI time         18 min      4 min       77% faster
Cache hit rate          0%          85%         -
Daily CI minutes        180 min     40 min      78% reduction
Developer wait time     15 min      3 min       80% faster
```

#### Nx Cloud Dashboard

The Nx Cloud dashboard shows:

- Build times over time
- Cache hit rates
- Most expensive tasks
- Agent utilization

```
┌─────────────────────────────────────────────────────────┐
│  Nx Cloud Dashboard                                      │
├─────────────────────────────────────────────────────────┤
│  📊 Last 7 days                                         │
│                                                         │
│  Total runs: 847                                        │
│  Cache hit rate: 89.2%                                  │
│  Time saved: 142 hours                                  │
│                                                         │
│  Top tasks by time:                                     │
│  1. e2e-tests    (avg 4m 23s)                          │
│  2. build-web    (avg 2m 12s)                          │
│  3. test-api     (avg 1m 45s)                          │
└─────────────────────────────────────────────────────────┘
```

---

### HANDS-ON: Let's Set It Up! (40:00 - 45:00)

#### Nx Cloud Example

```bash
cd remote-caching-19/nx-cloud-example

# Install dependencies
pnpm install

# Connect to Nx Cloud (free!)
npx nx connect

# Run a build
npx nx build

# Run again - see the cache hit!
npx nx build
```

#### Turborepo Example

```bash
cd remote-caching-19/turbo-cache-example

# Install
pnpm install

# Run with local cache first
pnpm turbo build

# Run again
pnpm turbo build --summarize
# Cached: 100%!
```

#### Self-Hosted Example

```bash
cd remote-caching-19/self-hosted

# Start the cache server
docker-compose up -d

# Set environment
export TURBO_API=http://localhost:3000
export TURBO_TOKEN=your-secret-token
export TURBO_TEAM=my-team

# Now turbo will use your local cache server!
```

---

### OUTRO (45:00 - 46:00)

Remote caching is a **game-changer** for monorepo CI/CD. Let's recap:

✅ **Nx Cloud** - Free tier, zero config, DTE support
✅ **Turborepo** - Vercel integration or self-hosted
✅ **Self-hosted** - Full control with Docker
✅ **Massive savings** - 70-90% faster CI pipelines

The ROI is incredible:

- Developer productivity increases
- CI costs decrease
- Faster feedback loops

In the final module, we'll cover **Monorepo Migration** - how to move from multiple repos to a monorepo without losing your Git history.

See you there!

---

## 📁 Files in This Module

```
remote-caching-19/
├── nx-cloud-example/
│   ├── nx.json                    # Nx Cloud config
│   ├── package.json
│   └── .github/workflows/ci.yml   # CI with DTE
├── turbo-cache-example/
│   ├── turbo.json                 # Turbo config
│   ├── package.json
│   └── .github/workflows/ci.yml   # CI with remote cache
├── self-hosted/
│   ├── docker-compose.yml         # Self-hosted setup
│   └── README.md                  # Setup instructions
└── README.md
```

## 🚀 Quick Start

```bash
# Nx Cloud (recommended)
cd nx-cloud-example
pnpm install
npx nx connect
npx nx build

# Turborepo
cd turbo-cache-example
pnpm install
npx turbo login
pnpm turbo build

# Self-hosted
cd self-hosted
docker-compose up -d
```

## 📚 Resources

- [Nx Cloud Documentation](https://nx.app/docs)
- [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Self-hosted Turborepo Cache](https://github.com/ducktors/turborepo-remote-cache)
