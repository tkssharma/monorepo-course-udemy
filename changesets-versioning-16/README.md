# Changesets - Modern Versioning & Changelog Management


---
Hey everyone, welcome back to the Monorepo Mastery course! I'm TK Sharma, and in this module, we're going to learn about **Changesets** - the modern way to manage versions and changelogs in monorepos.

If you've used Lerna before for versioning, you're going to love Changesets. It's what major projects like **Chakra UI**, **Radix UI**, **pnpm**, and **Turborepo** use for their releases.

By the end of this video, you'll know how to:

- Set up Changesets in your monorepo
- Create changesets for your PRs
- Automate releases with GitHub Actions
- Generate beautiful changelogs automatically

---

### PART 1: Why Changesets? 

#### The Problem with Traditional Versioning

```
Traditional approach:
1. Make changes across multiple packages
2. Manually update version in each package.json
3. Write changelog entries by hand
4. Hope you didn't miss anything
5. Publish and pray 🙏
```

This is error-prone and doesn't scale.

#### The Changesets Philosophy

Changesets takes a different approach:

```
Changesets approach:
1. Make changes across multiple packages
2. Run `changeset add` - describe what changed
3. PR gets merged with the changeset file
4. CI automatically bumps versions & generates changelog
5. Publish with confidence ✅
```

The key insight: **Capture intent at PR time, not release time.**

---

### PART 2: Setting Up Changesets

#### Step 1: Install Changesets

```bash
# In your monorepo root
pnpm add -D @changesets/cli @changesets/changelog-github

# Initialize changesets
pnpm changeset init
```

This creates a `.changeset` folder with `config.json`.

#### Step 2: Configure Changesets

```json
// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": ["@changesets/changelog-github", { "repo": "your-org/your-repo" }],
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

Let me explain the key options:

| Option      | What it does                                |
| ----------- | ------------------------------------------- |
| `changelog` | Generates GitHub-linked changelogs          |
| `access`    | "public" for npm, "restricted" for private  |
| `fixed`     | Packages that always share the same version |
| `linked`    | Packages that bump together                 |

#### Step 3: Update package.json scripts

```json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

---

### PART 3: Creating Changesets (8:00 - 14:00)

#### The Workflow

Let's say you fixed a bug in the `@myorg/utils` package.

```bash
# After making your changes
pnpm changeset
```

You'll see an interactive prompt:

```
🦋  Which packages would you like to include?
   ◯ @myorg/ui
   ◉ @myorg/utils

🦋  Which packages should have a major bump?
   (Press <space> to select, <enter> to proceed)

🦋  Which packages should have a minor bump?
   (Press <space> to select)

🦋  The following packages will be patch bumped:
   @myorg/utils

🦋  Please enter a summary for this change:
   Fixed date formatting for non-UTC timezones
```

This creates a file like `.changeset/funny-pandas-dance.md`:

```markdown
---
'@myorg/utils': patch
---

Fixed date formatting for non-UTC timezones
```

#### Understanding Semver

Quick refresher:

```
MAJOR.MINOR.PATCH
  │     │     └── Bug fixes (backwards compatible)
  │     └──────── New features (backwards compatible)
  └────────────── Breaking changes
```

| Change Type | When to Use                          |
| ----------- | ------------------------------------ |
| `patch`     | Bug fixes, typos, small improvements |
| `minor`     | New features, new exports            |
| `major`     | Breaking changes, removed APIs       |

#### Multiple Packages in One Changeset

If your PR affects multiple packages:

```markdown
---
'@myorg/utils': minor
'@myorg/ui': patch
---

Added new `formatCurrency` function to utils.
Updated UI components to use the new formatter.
```

---

### PART 4: Versioning & Publishing (14:00 - 18:00)

#### Running Version Command

When you're ready to release:

```bash
pnpm changeset version
```

This does several things:

1. Reads all changeset files in `.changeset/`
2. Bumps versions in `package.json` files
3. Updates `CHANGELOG.md` for each package
4. Deletes the consumed changeset files

Example generated CHANGELOG:

```markdown
# @myorg/utils

## 1.2.0

### Minor Changes

- Added new `formatCurrency` function ([#123](https://github.com/org/repo/pull/123))

### Patch Changes

- Fixed date formatting for non-UTC timezones ([#120](https://github.com/org/repo/pull/120))
```

#### Publishing

```bash
pnpm changeset publish
```

This publishes all packages with new versions to npm.

---

### PART 5: GitHub Actions Automation (18:00 - 24:00)

#### The Release Workflow

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install Dependencies
        run: pnpm install

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm changeset version
          commit: 'chore: release packages'
          title: 'chore: release packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### How It Works

```
Developer pushes PR with changeset file
                ↓
PR gets merged to main
                ↓
GitHub Action runs
                ↓
    ┌───────────────────────────┐
    │ Are there changeset files? │
    └───────────────────────────┘
           │              │
          YES            NO
           ↓              ↓
    Create/Update     Do nothing
    "Release PR"
           │
           ↓
    When Release PR is merged
           ↓
    Run `changeset publish`
           ↓
    Packages published to npm! 🎉
```

#### The Changeset Bot

Install the [Changeset Bot](https://github.com/apps/changeset-bot) on your repo.

It will comment on PRs:

```
🦋 This PR is missing a changeset.

If this change should be released, please run `pnpm changeset`
and commit the changeset file.

If this change should NOT trigger a release, you can ignore this message.
```

---

### PART 6: Advanced Features (24:00 - 28:00)

#### Snapshot Releases (for testing)

```bash
pnpm changeset version --snapshot canary
# Creates versions like: 1.2.0-canary-20260202
```

#### Pre-releases (alpha, beta, rc)

```bash
# Enter pre-release mode
pnpm changeset pre enter beta

# Now version will create beta versions
pnpm changeset version
# 1.2.0 → 1.3.0-beta.0

# Exit pre-release mode
pnpm changeset pre exit
```

#### Fixed Versioning

All packages share the same version (like React):

```json
{
  "fixed": [["@myorg/core", "@myorg/utils", "@myorg/ui"]]
}
```

#### Linked Versioning

Packages bump together but can have different versions:

```json
{
  "linked": [["@myorg/react-*"]]
}
```

---

### HANDS-ON: Let's Build It! (28:00 - 35:00)

Let's set up this module's example:

```bash
cd changesets-versioning-16

# Install dependencies
pnpm install

# See the packages
ls packages/
# utils/  ui/

# Create a changeset
pnpm changeset

# Check the generated file
ls .changeset/

# Run version (see what would happen)
pnpm changeset version

# Check CHANGELOG.md in packages
cat packages/utils/CHANGELOG.md
```

---

### OUTRO (35:00 - 36:00)

And that's Changesets! To recap:

✅ **Capture changes at PR time** with `changeset add`
✅ **Automate versioning** with `changeset version`
✅ **Automate publishing** with GitHub Actions
✅ **Beautiful changelogs** generated automatically

In the next module, we'll explore **Module Federation** for building micro-frontends in your monorepo.

If you found this helpful, please like and subscribe! See you in the next one.

---

## 📁 Files in This Module

```
changesets-versioning-16/
├── .changeset/
│   ├── config.json          # Changesets configuration
│   └── README.md            # Changesets intro
├── .github/
│   └── workflows/
│       └── release.yml      # Automated release workflow
├── packages/
│   ├── utils/               # Example utility package
│   │   ├── src/index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── ui/                  # Example UI package
│       ├── src/index.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json             # Root workspace config
├── pnpm-workspace.yaml      # Workspace definition
└── README.md                # This file
```

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Create a changeset
pnpm changeset

# Version packages
pnpm changeset version

# Build & publish (requires npm auth)
pnpm release
```

## � Release Workflow Explained (`release.yml`)

The `.github/workflows/release.yml` file automates the entire versioning and publishing process.

### Workflow Overview

```yaml
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}
```

- **Trigger**: Runs on every push to `main` branch
- **Concurrency**: Prevents duplicate workflow runs

### Job Steps Breakdown

| Step | Action                  | Purpose                            |
| ---- | ----------------------- | ---------------------------------- |
| 1    | `actions/checkout@v4`   | Clone the repository               |
| 2    | `pnpm/action-setup@v3`  | Install pnpm v9                    |
| 3    | `actions/setup-node@v4` | Setup Node.js 20 with pnpm caching |
| 4    | `pnpm install`          | Install all dependencies           |
| 5    | `changesets/action@v1`  | The main release automation        |

### Changesets Action Behavior

The `changesets/action` handles two scenarios:

#### Scenario 1: Changesets Exist (unreleased changes)

```
Developer merges PR with changeset file
          ↓
Action runs `pnpm changeset version`
          ↓
Creates/Updates "Release PR" with:
  - Version bumps in package.json
  - Updated CHANGELOG.md files
  - Commit message: "chore: release packages"
```

#### Scenario 2: No Changesets (Release PR merged)

```
Release PR gets merged
          ↓
Action runs `pnpm release`
          ↓
Packages published to npm registry 🎉
```

### Required Secrets

| Secret         | Purpose                  | How to Get                            |
| -------------- | ------------------------ | ------------------------------------- |
| `GITHUB_TOKEN` | Create PRs, push commits | Auto-provided by GitHub               |
| `NPM_TOKEN`    | Publish to npm registry  | Generate at npmjs.com → Access Tokens |

### Setting Up NPM_TOKEN

1. Go to [npmjs.com](https://www.npmjs.com) → Account → Access Tokens
2. Generate new token (Automation type)
3. In GitHub repo: Settings → Secrets → Actions → New secret
4. Name: `NPM_TOKEN`, Value: your token

### Customization Options

```yaml
- uses: changesets/action@v1
  with:
    publish: pnpm release # Command to publish packages
    version: pnpm changeset version # Command to bump versions
    commit: 'chore: release packages' # Commit message for version bump
    title: 'chore: release packages' # PR title
```

## �📚 Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Changesets GitHub Action](https://github.com/changesets/action)
- [Changeset Bot](https://github.com/apps/changeset-bot)
