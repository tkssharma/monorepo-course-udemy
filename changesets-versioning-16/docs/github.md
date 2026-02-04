Your PAT (`GH_TOKEN`) is missing the pull request permissions. You need to update it:

## For Fine-grained PAT

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. Edit your token and add these **Repository permissions**:
   - **Contents**: Read and write
   - **Pull requests**: Read and write
   - **Metadata**: Read-only

## For Classic PAT

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Ensure the token has the full **`repo`** scope checked

After updating the token:

1. Copy the new token value
2. Go to your repo **Settings** → **Secrets and variables** → **Actions**
3. Update the `GH_TOKEN` secret with the new value
4. Re-run the workflow




Here's the flow diagram for your release workflow:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GITHUB ACTIONS RELEASE FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │  Push to     │
                              │  `develop`   │
                              └──────┬───────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   Checkout Repo       │
                         │   (actions/checkout)  │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   Setup pnpm v9       │
                         │   (pnpm/action-setup) │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   Setup Node.js 20    │
                         │   (actions/setup-node)│
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   pnpm install        │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   changesets/action   │
                         └───────────┬───────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
        ┌─────────────────────┐          ┌─────────────────────┐
        │  Changesets Found?  │          │  No Changesets?     │
        │         YES         │          │   (PR merged)       │
        └──────────┬──────────┘          └──────────┬──────────┘
                   │                                │
                   ▼                                ▼
        ┌─────────────────────┐          ┌─────────────────────┐
        │  Run version cmd:   │          │  Run publish cmd:   │
        │  `pnpm changeset    │          │  `pnpm release`     │
        │   version`          │          │                     │
        └──────────┬──────────┘          └──────────┬──────────┘
                   │                                │
                   ▼                                ▼
        ┌─────────────────────┐          ┌─────────────────────┐
        │  Create PR:         │          │  Publish packages   │
        │  "chore: release    │          │  to npm registry    │
        │   packages"         │          │                     │
        └─────────────────────┘          └─────────────────────┘
```

## Summary

| Step | Action | Purpose |
|------|--------|---------|
| **Trigger** | Push to `develop` | Starts the workflow |
| **1** | Checkout | Clone repository |
| **2** | Setup pnpm | Install pnpm v9 |
| **3** | Setup Node | Install Node.js 20 |
| **4** | Install deps | Run `pnpm install` |
| **5** | Changesets action | Handles versioning & publishing |

## Changesets Action Logic

- **If `.changeset/*.md` files exist** → Bumps versions, updates CHANGELOGs, creates a Release PR
- **If no changesets** (Release PR was merged) → Publishes packages to npm using `pnpm release`