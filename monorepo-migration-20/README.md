# Module 20: Monorepo Migration Strategies

## 🎬 Video Script

---

### INTRO (0:00 - 2:00)

Hey everyone! Welcome to the final module of Monorepo Mastery. I'm TK Sharma, and today we're covering one of the most requested topics - **Monorepo Migration**.

You've learned all about monorepos - Nx, Turborepo, Changesets, Bun, remote caching. But what if you're not starting fresh? What if you have **10, 20, or 100 existing repositories** that you need to bring together?

That's what this module is all about:

- **When** to migrate (and when NOT to)
- **How** to preserve Git history
- **Strategies** for low-risk migration
- **Tools** to automate the process

By the end, you'll have a complete migration playbook. Let's do this!

---

### PART 1: Should You Migrate? (2:00 - 8:00)

#### Signs You Need a Monorepo

| Symptom                    | Impact                    |
| -------------------------- | ------------------------- |
| Cross-repo PRs are painful | Slow delivery             |
| Dependency version drift   | Bugs in production        |
| "Works on my machine"      | Inconsistent environments |
| Duplicated code everywhere | Maintenance burden        |
| CI/CD is fragmented        | Slow, unreliable deploys  |

#### When NOT to Migrate

❌ **Don't migrate if:**

- Teams are completely independent
- Repos have different deployment cycles
- You're trying to "fix" organizational issues
- No one wants to maintain shared tooling

#### Cost-Benefit Analysis

```
COSTS                           BENEFITS
─────────────────────────────────────────────────────
Migration effort (weeks)        Shared code/tooling
Learning curve                  Atomic commits
Tooling investment              Better refactoring
CI/CD redesign                  Unified testing
                               Single source of truth
```

**Rule of thumb:** If you're making cross-repo changes more than once a week, migration ROI is positive within 6 months.

---

### PART 2: Migration Strategies (8:00 - 16:00)

#### Strategy 1: Big Bang 💥

```
Day 1: All repos merged
        ↓
Day 2: Everyone works in monorepo
```

**Pros:**

- Clean break
- Consistent tooling immediately
- No dual maintenance

**Cons:**

- High risk
- Requires coordination
- All-or-nothing

**Best for:** Small teams (<10), few repos (<5), low traffic periods

#### Strategy 2: Incremental 📈

```
Week 1: Migrate repo A
Week 2: Migrate repo B
Week 3: Migrate repo C
...
```

**Pros:**

- Lower risk
- Learn as you go
- Can pause if issues arise

**Cons:**

- Longer timeline
- Temporary complexity
- Cross-repo changes still painful during migration

**Best for:** Medium teams, moderate repo count

#### Strategy 3: Strangler Fig 🌿

```
┌─────────────────────────────────────────┐
│            Traffic Router               │
└─────────────────────────────────────────┘
       ↓                    ↓
┌──────────────┐    ┌──────────────┐
│  Old Repos   │    │   Monorepo   │
│  (shrinking) │    │  (growing)   │
└──────────────┘    └──────────────┘
```

**Pros:**

- Zero downtime
- Fully reversible
- Gradual team adoption

**Cons:**

- Maintenance overhead
- Longer timeline
- Complexity in routing

**Best for:** Large teams, critical systems, risk-averse orgs

---

### PART 3: Preserving Git History (16:00 - 26:00)

#### Why Preserve History?

- `git blame` still works
- `git log` shows full context
- Legal/compliance requirements
- Team morale (your commits matter!)

#### Method 1: git filter-repo (Recommended)

```bash
# Install git-filter-repo
pip install git-filter-repo

# Clone the repo you want to migrate
git clone https://github.com/myorg/frontend.git
cd frontend

# Rewrite history to put everything in a subdirectory
git filter-repo --to-subdirectory-filter apps/frontend

# This transforms:
# src/App.tsx → apps/frontend/src/App.tsx
# package.json → apps/frontend/package.json
```

#### Method 2: Migration Script

I've included a script in this module:

```bash
#!/bin/bash
# scripts/migrate-repo.sh

# Usage: ./migrate-repo.sh -s <source_url> -t <target_dir> -m <monorepo_path>

# Example:
./migrate-repo.sh \
  -s https://github.com/myorg/frontend.git \
  -t apps/frontend \
  -m ~/my-monorepo
```

The script:

1. Clones the source repo
2. Rewrites history with `filter-repo`
3. Adds as remote to monorepo
4. Merges with `--allow-unrelated-histories`
5. Cleans up

#### Step-by-Step Migration

```bash
# 1. Start with empty monorepo
mkdir my-monorepo && cd my-monorepo
git init
pnpm init

# 2. Set up workspace structure
mkdir apps packages
cat > pnpm-workspace.yaml << EOF
packages:
  - "apps/*"
  - "packages/*"
EOF

# 3. Commit the skeleton
git add .
git commit -m "Initial monorepo structure"

# 4. Migrate first repo (frontend)
./scripts/migrate-repo.sh \
  -s https://github.com/myorg/frontend.git \
  -t apps/frontend \
  -m .

# 5. Verify history preserved
git log --oneline apps/frontend/
# abc1234 feat: add login page
# def5678 fix: button styling
# ... (full history!)

# 6. Repeat for other repos
./scripts/migrate-repo.sh -s .../api.git -t apps/api -m .
./scripts/migrate-repo.sh -s .../shared.git -t packages/shared -m .
```

---

### PART 4: Resolving Dependency Conflicts (26:00 - 34:00)

#### The Problem

```
frontend/package.json:  "react": "^17.0.0"
admin/package.json:     "react": "^18.2.0"
mobile/package.json:    "react": "^16.14.0"

🚨 Three different React versions!
```

#### Dependency Analyzer Script

I've included a script to find conflicts:

```bash
node scripts/dependency-analyzer.js .

# Output:
# 📊 Dependency Analysis Report
# ════════════════════════════════════════════════════════
#
# ⚠️  Found 12 packages with version conflicts:
#
# 📦 react
# ────────────────────────────────────
#   Version: ^17.0.0
#   Used by:
#     - apps/frontend/package.json
#
#   Version: ^18.2.0
#   Used by:
#     - apps/admin/package.json
# ...
```

#### Resolution Strategies

**Option 1: Upgrade All (Recommended)**

```bash
# Update all packages to latest
pnpm update react react-dom --recursive

# Or use pnpm catalog (pnpm 9+)
# pnpm-workspace.yaml
catalog:
  react: "^18.2.0"
  react-dom: "^18.2.0"
```

**Option 2: Use Overrides (Temporary)**

```json
// package.json (root)
{
  "pnpm": {
    "overrides": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    }
  }
}
```

**Option 3: Allow Multiple Versions (Last Resort)**

Some packages can coexist (lodash, date-fns). But frameworks (React, Vue) should be singletons.

#### Post-Migration Checklist

```
[ ] All packages install without errors
[ ] No duplicate React/Vue/Angular in bundle
[ ] TypeScript compiles cleanly
[ ] All tests pass
[ ] CI/CD pipeline works
[ ] Deployment succeeds
```

---

### PART 5: Team Adoption (34:00 - 40:00)

#### CODEOWNERS File

Define who owns what:

```
# .github/CODEOWNERS

# Default owners
* @org/platform-team

# Apps
/apps/frontend/    @org/frontend-team
/apps/api/         @org/backend-team
/apps/mobile/      @org/mobile-team

# Packages
/packages/ui/      @org/design-system
/packages/utils/   @org/platform-team

# CI/CD (requires platform review)
/.github/          @org/platform-team
/turbo.json        @org/platform-team
```

#### New Workflow for Developers

**Before (Polyrepo):**

```
1. Clone frontend repo
2. Clone api repo
3. Clone shared repo
4. Run each separately
5. Make changes across repos = 3 PRs 😰
```

**After (Monorepo):**

```
1. Clone monorepo
2. pnpm install (all deps)
3. pnpm dev (all apps)
4. Make changes across apps = 1 PR ✅
```

#### Training Topics

1. **New commands:**
   - `pnpm --filter <package> <command>`
   - `nx affected -t test`
   - `turbo run build`

2. **PR guidelines:**
   - Smaller, focused PRs
   - Use changesets for versioning
   - Reference related packages

3. **Debugging:**
   - `nx graph` to visualize dependencies
   - `turbo build --summarize` for cache analysis

---

### PART 6: Migration Checklist (40:00 - 44:00)

#### Pre-Migration

```
[ ] Identified all repos to migrate
[ ] Analyzed dependency conflicts
[ ] Chosen migration strategy
[ ] Set up empty monorepo with tooling
[ ] Created CODEOWNERS file
[ ] Scheduled migration window
[ ] Communicated to all teams
```

#### During Migration

```
[ ] Migrated repo with history preserved
[ ] Updated package.json (name, deps)
[ ] Resolved dependency conflicts
[ ] Fixed import paths
[ ] Tests pass
[ ] CI/CD works
```

#### Post-Migration

```
[ ] Archived old repository
[ ] Updated documentation
[ ] Team training completed
[ ] Monitoring in place
[ ] Retrospective scheduled
```

#### Success Metrics

| Metric              | Before       | After   | Target  |
| ------------------- | ------------ | ------- | ------- |
| Cross-repo PRs      | 5/week       | 0/week  | 0       |
| CI time             | 20 min       | 5 min   | <10 min |
| Dependency versions | 47 conflicts | 0       | 0       |
| Onboarding time     | 2 days       | 4 hours | <1 day  |

---

### HANDS-ON: Let's Migrate! (44:00 - 50:00)

```bash
# Navigate to the module
cd monorepo-migration-20

# Check out the example structure
ls example-structure/
# package.json  pnpm-workspace.yaml  turbo.json

# Analyze dependencies in an existing project
node scripts/dependency-analyzer.js /path/to/your/projects

# Use the migration script
chmod +x scripts/migrate-repo.sh

./scripts/migrate-repo.sh \
  -s https://github.com/your-org/your-repo.git \
  -t apps/your-repo \
  -m ./example-structure
```

#### Migration Templates

Check out the `templates/` folder:

- `CODEOWNERS` - Code ownership template
- `migration-checklist.md` - Detailed checklist

---

### OUTRO (50:00 - 52:00)

Congratulations! 🎉 You've completed **Monorepo Mastery**!

Let's recap everything you've learned:

| Module | Topic                                   |
| ------ | --------------------------------------- |
| 1-6    | Fundamentals, Lerna, Workspaces         |
| 8-11   | Nx & Turborepo                          |
| 12-15  | CI/CD & Full-Stack Setup                |
| **16** | **Changesets** (versioning)             |
| **17** | **Module Federation** (micro-frontends) |
| **18** | **Bun Workspaces** (modern runtime)     |
| **19** | **Remote Caching** (fast CI/CD)         |
| **20** | **Migration** (polyrepo → monorepo)     |

You now have the skills to:
✅ Choose the right monorepo tool
✅ Set up workspaces with any package manager
✅ Build micro-frontends with Module Federation
✅ Automate releases with Changesets
✅ Speed up CI/CD with remote caching
✅ Migrate existing repos while preserving history

**Thank you** for taking this course! If it helped you, please leave a review and share it with your team.

Happy coding! 🚀

---

## 📁 Files in This Module

```
monorepo-migration-20/
├── scripts/
│   ├── migrate-repo.sh         # Migration automation script
│   └── dependency-analyzer.js  # Find version conflicts
├── templates/
│   ├── CODEOWNERS              # Code ownership template
│   └── migration-checklist.md  # Detailed checklist
├── example-structure/
│   ├── package.json            # Example root config
│   ├── pnpm-workspace.yaml     # Workspace definition
│   └── turbo.json              # Turborepo config
└── README.md
```

## 🚀 Quick Start

```bash
# Analyze dependencies
node scripts/dependency-analyzer.js /path/to/repos

# Migrate a repository
./scripts/migrate-repo.sh \
  -s https://github.com/org/repo.git \
  -t apps/repo-name \
  -m ./my-monorepo

# Use the checklist
cat templates/migration-checklist.md
```

## 📚 Resources

- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [Nx Migration Guide](https://nx.dev/recipes/adopting-nx)
- [Turborepo Migration](https://turbo.build/repo/docs/crafting-your-repository/structuring-a-repository)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
