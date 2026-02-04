# Monorepo Mastery Course - 2026 Edition

A comprehensive course covering monorepo architecture, tooling, and best practices for modern development teams.

---

## 📚 Course Modules

### **Part 1: Foundations (Modules 1-6)**

| Module | Folder              | Topic                       |
| ------ | ------------------- | --------------------------- |
| 01     | `introduction-01/`  | Introduction to Monorepos   |
| 02     | `setting-up-02/`    | Setting Up a Basic Monorepo |
| 03     | `lerna-publish-03/` | Lerna Publishing Basics     |
| 04     | `lerna-apps-04/`    | Building Apps with Lerna    |
| 05     | `workpsaces-05/`    | npm/yarn Workspaces         |
| 06     | `workpsace-06/`     | Advanced Workspaces         |

### **Part 2: Modern Tooling (Modules 7-11)**

| Module | Folder            | Topic                  |
| ------ | ----------------- | ---------------------- |
| 08     | `nx-monorepo-08/` | Nx Monorepo Setup      |
| 09     | `nx-monorepo-09/` | Advanced Nx Features   |
| 10     | `turborepo-10/`   | Turborepo Fundamentals |
| 11     | `turborepo-11/`   | Advanced Turborepo     |

### **Part 3: CI/CD & Optimization (Modules 12-15)**

| Module | Folder                                    | Topic                          |
| ------ | ----------------------------------------- | ------------------------------ |
| 12     | `lerna-with-ci-cd-12/`                    | Lerna CI/CD Integration        |
| 13     | `turborepo-ci-cd-13/`                     | Turborepo CI/CD Pipelines      |
| 14     | `lerna-publishing-packages-14-usecase/`   | Publishing Packages (Use Case) |
| 15     | `pnpm-nx-fullstack-app-setup-15-usecase/` | Full-Stack App with pnpm + Nx  |

### **Part 4: 2026 New Modules (Modules 16-20)** 🆕

| Module | Folder                      | Topic                                      |
| ------ | --------------------------- | ------------------------------------------ |
| 16     | `changesets-versioning-16/` | Changesets - Modern Versioning & Changelog |
| 17     | `module-federation-17/`     | Module Federation - Micro-Frontends        |
| 18     | `bun-workspaces-18/`        | Bun Workspaces - Modern Runtime            |
| 19     | `remote-caching-19/`        | Remote Caching (Nx Cloud/Turborepo)        |
| 20     | `monorepo-migration-20/`    | Monorepo Migration Strategies              |

---

## � 2026 New Modules - Deep Dive

### Module 16: Changesets - Modern Versioning

> **Folder:** `changesets-versioning-16/`

The modern alternative to Lerna versioning, used by Chakra UI, Radix, and pnpm.

**What's Included:**

- ✅ Complete Changesets configuration
- ✅ Sample packages (`@myorg/utils`, `@myorg/ui`)
- ✅ GitHub Actions workflow for automated releases
- ✅ Pre-release (alpha/beta) support

**Key Topics:**

- `changeset add` / `changeset version` / `changeset publish`
- Automated changelog generation
- GitHub Changeset Bot integration

---

### Module 17: Module Federation - Micro-Frontends

> **Folder:** `module-federation-17/`

Build micro-frontend architectures with runtime code sharing.

**What's Included:**

- ✅ **Shell App** (Host) - Port 3000
- ✅ **Products App** (Remote) - Port 3001
- ✅ **Cart App** (Remote) - Port 3002
- ✅ Rsbuild + Module Federation Enhanced setup
- ✅ Cross-app communication via CustomEvents

**Key Topics:**

- Host/Remote architecture
- Shared dependencies (React singleton)
- Dynamic remote loading
- Error boundaries and fallbacks

---

### Module 18: Bun Workspaces - Modern Runtime

> **Folder:** `bun-workspaces-18/`

Leverage Bun's blazing-fast runtime with native workspace support.

**What's Included:**

- ✅ **API Server** - Hono framework
- ✅ **Web App** - Server-rendered HTML
- ✅ **Shared Package** - Utilities with tests
- ✅ `bunfig.toml` configuration
- ✅ Built-in test runner examples

**Key Topics:**

- `bun install` (10x faster than npm)
- Native TypeScript execution
- `bun test` with coverage
- Workspace protocol (`workspace:*`)

---

### Module 19: Remote Caching

> **Folder:** `remote-caching-19/`

Dramatically speed up CI/CD with distributed caching.

**What's Included:**

- ✅ **Nx Cloud Example** - Full setup with DTE
- ✅ **Turborepo Remote Cache** - Vercel integration
- ✅ **Self-Hosted Option** - Docker Compose setup
- ✅ GitHub Actions workflows for both tools

**Key Topics:**

- Cache hit rates and performance gains
- Distributed Task Execution (Nx)
- Self-hosted cache with S3/MinIO
- Cache invalidation strategies

---

### Module 20: Monorepo Migration

> **Folder:** `monorepo-migration-20/`

Strategies and tools for migrating from polyrepo to monorepo.

**What's Included:**

- ✅ **Migration Script** - Preserves Git history
- ✅ **Dependency Analyzer** - Finds version conflicts
- ✅ **CODEOWNERS Template** - Code ownership
- ✅ **Migration Checklist** - Step-by-step guide
- ✅ **Example Structure** - Target monorepo layout

**Key Topics:**

- Big Bang vs Incremental vs Strangler Fig
- `git filter-repo` for history preservation
- Dependency conflict resolution
- Team adoption strategies

---

## �🎯 What You'll Learn

### Core Concepts

- What is a monorepo?
- Monorepos vs Polyrepos
- Advantages and trade-offs
- Real-world examples (Google, Facebook, Microsoft)

### Tools & Technologies

- **Lerna** - Package versioning and publishing
- **Nx** - Extensible build system with plugins
- **Turborepo** - High-performance build system
- **pnpm** - Fast, disk-efficient package manager
- **Bun** - Modern JavaScript runtime
- **Changesets** - Version management

### Advanced Topics

- Module Federation for micro-frontends
- Remote caching for CI/CD optimization
- Migration strategies from polyrepo
- Code ownership with CODEOWNERS
- Dependency analysis and conflict resolution

---

## 🚀 Getting Started

Each module folder contains:

- `README.md` - Module overview and learning objectives
- `package.json` - Dependencies and scripts
- Source code and configuration files
- GitHub Actions workflows (where applicable)

### Prerequisites

- Node.js 20+
- pnpm 9+ (recommended) or npm/yarn
- Git
- Basic TypeScript knowledge

---

## 📖 Hands-On Projects

1. **Basic Monorepo with Nx** - Create a simple monorepo with multiple projects
2. **Full-Stack Monorepo** - Next.js frontend + NestJS backend
3. **Micro-Frontend System** - Module Federation with React
4. **CI/CD Pipeline** - Automated testing and deployment
5. **Migration Project** - Convert polyrepo to monorepo

---

## 🛠️ Tech Stack (2026 Edition)

| Category             | Tools                            |
| -------------------- | -------------------------------- |
| **Build Systems**    | Nx 19+, Turborepo 2+, Bun        |
| **Package Managers** | pnpm 9+, Bun, npm                |
| **Versioning**       | Changesets, Lerna                |
| **CI/CD**            | GitHub Actions, GitLab CI        |
| **Caching**          | Nx Cloud, Turborepo Remote Cache |
| **Languages**        | TypeScript 5.4+                  |

---

## 📁 Repository Structure

```
monorepo-course-udemy/
├── introduction-01/           # Module 1: Introduction
├── setting-up-02/             # Module 2: Setup
├── lerna-publish-03/          # Module 3: Lerna Publishing
├── lerna-apps-04/             # Module 4: Lerna Apps
├── workpsaces-05/             # Module 5: Workspaces
├── workpsace-06/              # Module 6: Advanced Workspaces
├── nx-monorepo-08/            # Module 8: Nx Setup
├── nx-monorepo-09/            # Module 9: Advanced Nx
├── turborepo-10/              # Module 10: Turborepo
├── turborepo-11/              # Module 11: Advanced Turborepo
├── lerna-with-ci-cd-12/       # Module 12: Lerna CI/CD
├── turborepo-ci-cd-13/        # Module 13: Turborepo CI/CD
├── lerna-publishing-packages-14-usecase/  # Module 14: Publishing
├── pnpm-nx-fullstack-app-setup-15-usecase/ # Module 15: Full-Stack
├── changesets-versioning-16/  # Module 16: Changesets 🆕
├── module-federation-17/      # Module 17: Module Federation 🆕
├── bun-workspaces-18/         # Module 18: Bun Workspaces 🆕
├── remote-caching-19/         # Module 19: Remote Caching 🆕
└── monorepo-migration-20/     # Module 20: Migration 🆕
```

---

## 👨‍💻 Author

**TK Sharma** - Code with TKSSharma

---

## 📄 License

MIT
