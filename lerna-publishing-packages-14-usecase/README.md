Perfect — using **Lerna in a monorepo** to publish to GitLab's **private npm registry** works well with GitLab CI/CD, but it does need a bit of coordination between `.npmrc`, `lerna.json`, and your CI pipeline.

Here’s a full step-by-step setup to publish Lerna-managed packages to GitLab’s private registry via **GitLab CI/CD**:

---

## ✅ 1. `lerna.json` Configuration

Make sure your `lerna.json` has:

```json
{
  "packages": ["packages/*"],
  "version": "independent",
  "useWorkspaces": true,
  "command": {
    "publish": {
      "registry": "https://gitlab.com/api/v4/projects/PROJECT_ID/packages/npm/"
    }
  }
}
```

> Replace `PROJECT_ID` with your GitLab project’s numeric ID.

---

## ✅ 2. Root `.npmrc` File

Add this to the root of your repo (`.npmrc`):

```ini
//gitlab.com/api/v4/projects/PROJECT_ID/packages/npm/:_authToken=${GL_TOKEN}
@your-scope:registry=https://gitlab.com/api/v4/projects/PROJECT_ID/packages/npm/
always-auth=true
```

> Replace `@your-scope` with your npm package scope (e.g., `@tkssharma`).

---

## ✅ 3. GitLab CI Configuration (`.gitlab-ci.yml`)

Here’s an example pipeline for publishing:

```yaml
stages:
  - release

release:
  stage: release
  image: node:18
  script:
    - npm ci
    - npx lerna publish from-package --yes
  only:
    - master
  variables:
    GL_TOKEN: $CI_JOB_TOKEN
```

**OR**, if you're using a Personal/Deploy Token, pass it as a secret instead:

```yaml
variables:
  GL_TOKEN: $YOUR_SECRET_GL_TOKEN
```

### Explanation:

- `npm ci`: installs dependencies via npm workspaces
- `npx lerna publish from-package`: publishes all packages already versioned and tagged (`from-package` avoids re-versioning)
- `GL_TOKEN`: provides GitLab or deploy auth token to npm

---

## ✅ 4. Set Up Auth Token

You need to provide a token with `write_package_registry` scope.

You can use:

- **GitLab CI Job Token** (`$CI_JOB_TOKEN`) for same-project publishing.
- **Personal Access Token** or **Deploy Token** for cross-project access.

Store it in **GitLab → Settings → CI/CD → Variables** as `GL_TOKEN`.

---

## ✅ 5. Publish Flow

1. Update versions via:

   ```bash
   npx lerna version
   ```

2. Push tags to GitLab:

   ```bash
   git push --follow-tags
   ```

3. The GitLab CI job triggers, and runs:

   ```bash
   npx lerna publish from-package
   ```

---
