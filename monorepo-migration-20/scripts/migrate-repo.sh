#!/bin/bash

# Monorepo Migration Script
# This script migrates a repository into a monorepo while preserving Git history

set -e

# Configuration
SOURCE_REPO=""
TARGET_DIR=""
MONOREPO_PATH=""

print_usage() {
  echo "Usage: $0 -s <source_repo_url> -t <target_directory> -m <monorepo_path>"
  echo ""
  echo "Options:"
  echo "  -s  Source repository URL (e.g., https://github.com/org/repo.git)"
  echo "  -t  Target directory in monorepo (e.g., packages/my-package)"
  echo "  -m  Path to local monorepo"
  echo ""
  echo "Example:"
  echo "  $0 -s https://github.com/myorg/frontend.git -t apps/frontend -m ~/monorepo"
}

while getopts "s:t:m:h" opt; do
  case $opt in
    s) SOURCE_REPO="$OPTARG" ;;
    t) TARGET_DIR="$OPTARG" ;;
    m) MONOREPO_PATH="$OPTARG" ;;
    h) print_usage; exit 0 ;;
    *) print_usage; exit 1 ;;
  esac
done

if [ -z "$SOURCE_REPO" ] || [ -z "$TARGET_DIR" ] || [ -z "$MONOREPO_PATH" ]; then
  print_usage
  exit 1
fi

TEMP_DIR=$(mktemp -d)
REPO_NAME=$(basename "$SOURCE_REPO" .git)

echo "🚀 Starting migration..."
echo "   Source: $SOURCE_REPO"
echo "   Target: $TARGET_DIR"
echo "   Monorepo: $MONOREPO_PATH"

# Step 1: Clone the source repository
echo ""
echo "📥 Step 1: Cloning source repository..."
git clone "$SOURCE_REPO" "$TEMP_DIR/$REPO_NAME"
cd "$TEMP_DIR/$REPO_NAME"

# Step 2: Rewrite history to move files into target directory
echo ""
echo "🔄 Step 2: Rewriting Git history..."
git filter-repo --to-subdirectory-filter "$TARGET_DIR" --force

# Step 3: Add as remote to monorepo and fetch
echo ""
echo "📦 Step 3: Merging into monorepo..."
cd "$MONOREPO_PATH"
git remote add "$REPO_NAME-migration" "$TEMP_DIR/$REPO_NAME"
git fetch "$REPO_NAME-migration"

# Step 4: Merge with allow-unrelated-histories
echo ""
echo "🔀 Step 4: Merging histories..."
git merge "$REPO_NAME-migration/main" --allow-unrelated-histories -m "Migrate $REPO_NAME into $TARGET_DIR"

# Step 5: Cleanup
echo ""
echo "🧹 Step 5: Cleaning up..."
git remote remove "$REPO_NAME-migration"
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Migration complete!"
echo "   Repository '$REPO_NAME' has been migrated to '$TARGET_DIR'"
echo ""
echo "Next steps:"
echo "  1. Review the merged files"
echo "  2. Update package.json name and dependencies"
echo "  3. Run 'pnpm install' to update lockfile"
echo "  4. Test the build and tests"
echo "  5. Commit any necessary fixes"
