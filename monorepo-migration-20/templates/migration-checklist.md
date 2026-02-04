# Monorepo Migration Checklist

## Pre-Migration

### Assessment
- [ ] Identified all repositories to migrate
- [ ] Documented current dependency versions across repos
- [ ] Analyzed dependency conflicts
- [ ] Estimated migration timeline
- [ ] Identified team champions/owners

### Planning
- [ ] Chosen monorepo tool (Nx/Turborepo/Lerna)
- [ ] Defined folder structure
- [ ] Created CODEOWNERS file
- [ ] Set up communication channels
- [ ] Scheduled migration windows

### Infrastructure Setup
- [ ] Created monorepo repository
- [ ] Set up workspace configuration (pnpm/npm/yarn)
- [ ] Configured build tool (Nx/Turbo)
- [ ] Set up CI/CD pipeline skeleton
- [ ] Created development documentation

---

## Migration Phase

### Per-Repository Migration
- [ ] Cloned source repository
- [ ] Rewritten Git history (git filter-repo)
- [ ] Merged into monorepo with history
- [ ] Updated package.json (name, dependencies)
- [ ] Resolved dependency conflicts
- [ ] Updated import paths
- [ ] Verified builds pass
- [ ] Verified tests pass
- [ ] Updated CI/CD configuration

### Dependency Resolution
- [ ] Identified conflicting versions
- [ ] Decided on target versions
- [ ] Updated all packages to consistent versions
- [ ] Configured overrides/resolutions if needed
- [ ] Tested compatibility

### CI/CD Migration
- [ ] Migrated build scripts
- [ ] Set up affected-based builds
- [ ] Configured caching
- [ ] Set up deployment pipelines
- [ ] Tested rollback procedures

---

## Post-Migration

### Validation
- [ ] All apps build successfully
- [ ] All tests pass
- [ ] E2E tests pass
- [ ] Performance benchmarks acceptable
- [ ] No regressions in functionality

### Documentation
- [ ] Updated README files
- [ ] Created migration guide
- [ ] Documented new workflows
- [ ] Updated contribution guidelines
- [ ] Created troubleshooting guide

### Team Adoption
- [ ] Conducted training sessions
- [ ] Set up office hours for questions
- [ ] Created FAQ document
- [ ] Established code review guidelines
- [ ] Set up monitoring/alerting

### Cleanup
- [ ] Archived old repositories
- [ ] Updated external references (docs, links)
- [ ] Removed temporary migration branches
- [ ] Cleaned up unused dependencies
- [ ] Optimized CI/CD pipelines

---

## Go-Live Checklist

### Final Verification
- [ ] Production builds verified
- [ ] Deployment pipeline tested
- [ ] Monitoring in place
- [ ] Rollback plan documented
- [ ] On-call team briefed

### Communication
- [ ] Announced migration completion
- [ ] Shared new repository URLs
- [ ] Updated team onboarding docs
- [ ] Scheduled retrospective meeting

---

## Success Metrics

Track these metrics before and after migration:

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| CI build time | ___ min | ___ min | -50% |
| Install time | ___ min | ___ min | -30% |
| PR merge time | ___ hr | ___ hr | -20% |
| Cross-repo changes | ___ PRs | 1 PR | 1 PR |
| Dependency duplicates | ___ | ___ | 0 |
