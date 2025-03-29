## **🔥 Lerna Commands Cheat Sheet (Lerna 7+)**  

Lerna is a powerful monorepo management tool, and with version **7+**, it now works with **npm, Yarn, or pnpm workspaces** instead of `lerna bootstrap`.  

---

## **📌 1. Initialize a Lerna Monorepo**
```sh
npx lerna init
```
✅ Creates a `lerna.json` file and a `packages/` directory.

---

## **📌 2. Install Dependencies & Link Packages**  
**(Replaces `lerna bootstrap` in Lerna 7+)**  
```sh
npm install
```
✅ Installs dependencies and links internal packages.  

---

## **📌 3. Run Commands Across All Packages**  
Run a script across **all packages**:  
```sh
npx lerna run <script-name>
```
Example:
```sh
npx lerna run test
```
✅ Runs `npm run test` inside all packages.  

Run in **a specific package**:
```sh
npx lerna run build --scope=@my-monorepo/utils
```
✅ Runs `npm run build` only in `@my-monorepo/utils`.  

---

## **📌 4. Adding a New Package**  
Create a new package inside `packages/`:  
```sh
npx lerna create <package-name>
```
Example:
```sh
npx lerna create @my-monorepo/logger --private
```
✅ Creates `packages/logger` with `package.json`.

---

## **📌 5. Add Dependencies to a Package**  
Add a dependency **to a specific package**:  
```sh
npx lerna add lodash --scope=@monorepo/api
```
✅ Adds `lodash` to `@my-monorepo/api`.

Add a dependency **to all packages**:  
```sh
npx lerna add lodash
```
✅ Adds `lodash` to all packages.

Link an **internal package** (e.g., `@my-monorepo/utils` in `@my-monorepo/api`):  
```sh
npx lerna add @my-monorepo/utils --scope=@my-monorepo/api
```
✅ Adds `@my-monorepo/utils` as a dependency inside `@my-monorepo/api`.

---

## **📌 6. List All Managed Packages**  
```sh
npx lerna list
```
✅ Shows all packages inside the monorepo.  

To show package versions:  
```sh
npx lerna list --json
```

---

## **📌 7. Versioning & Publishing**  
### **Check Which Packages Have Changed**  
```sh
npx lerna changed
```
✅ Lists all packages that have changed since the last release.

### **Bump Package Versions Automatically**  
```sh
npx lerna version
```
✅ Updates version numbers in `package.json` and creates a Git tag.

Use **independent versioning** (different versions per package):  
```sh
npx lerna version --independent
```

### **Publish Packages to npm**  
```sh
npx lerna publish
```
✅ Publishes all updated packages to **npm**.

To publish **only a specific package**:  
```sh
npx lerna publish from-package --scope=@my-monorepo/api
```

---

## **📌 8. Clean All Node Modules in Packages**  
```sh
npx lerna clean
```
✅ Deletes all `node_modules` inside packages.

---

## **📌 9. Execute Custom Commands in All Packages**  
Run a command across all packages:  
```sh
npx lerna exec -- <your-command>
```
Example:
```sh
npx lerna exec -- rm -rf dist
```
✅ Deletes the `dist/` folder in all packages.

---

## **🚀 Next Steps**
- Want **TypeScript support** in Lerna monorepo? 🟦  
- Need **CI/CD pipelines** for publishing? 🔄  
- Looking to migrate to **Nx or Turborepo** for faster builds? ⚡  

Let me know how you'd like to proceed! 😊