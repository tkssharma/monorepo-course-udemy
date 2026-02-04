#!/usr/bin/env node

/**
 * Dependency Analyzer for Monorepo Migration
 * Analyzes multiple package.json files and identifies conflicts
 */

const fs = require('fs');
const path = require('path');

function findPackageJsonFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && item !== 'node_modules' && item !== '.git') {
      findPackageJsonFiles(fullPath, files);
    } else if (item === 'package.json') {
      files.push(fullPath);
    }
  }
  
  return files;
}

function analyzeDependencies(packageJsonPaths) {
  const allDeps = {};
  const conflicts = [];
  
  for (const pkgPath of packageJsonPaths) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    
    for (const [name, version] of Object.entries(deps)) {
      if (!allDeps[name]) {
        allDeps[name] = [];
      }
      
      const existing = allDeps[name].find(d => d.version === version);
      if (existing) {
        existing.packages.push(pkgPath);
      } else {
        allDeps[name].push({
          version,
          packages: [pkgPath],
        });
      }
    }
  }
  
  // Find conflicts (same package, different versions)
  for (const [name, versions] of Object.entries(allDeps)) {
    if (versions.length > 1) {
      conflicts.push({
        package: name,
        versions: versions.map(v => ({
          version: v.version,
          usedBy: v.packages.map(p => path.relative(process.cwd(), p)),
        })),
      });
    }
  }
  
  return { allDeps, conflicts };
}

function generateReport(analysis) {
  const { conflicts } = analysis;
  
  console.log('\n📊 Dependency Analysis Report\n');
  console.log('=' .repeat(60));
  
  if (conflicts.length === 0) {
    console.log('\n✅ No version conflicts found!\n');
    return;
  }
  
  console.log(`\n⚠️  Found ${conflicts.length} packages with version conflicts:\n`);
  
  for (const conflict of conflicts) {
    console.log(`\n📦 ${conflict.package}`);
    console.log('-'.repeat(40));
    
    for (const version of conflict.versions) {
      console.log(`  Version: ${version.version}`);
      console.log(`  Used by:`);
      for (const pkg of version.usedBy) {
        console.log(`    - ${pkg}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Recommendations:');
  console.log('  1. Review each conflict and decide on a target version');
  console.log('  2. Update packages to use consistent versions');
  console.log('  3. Consider using pnpm overrides or npm resolutions');
  console.log('  4. Test thoroughly after version updates\n');
}

// Main execution
const targetDir = process.argv[2] || '.';
console.log(`\n🔍 Analyzing dependencies in: ${path.resolve(targetDir)}`);

const packageJsonFiles = findPackageJsonFiles(targetDir);
console.log(`   Found ${packageJsonFiles.length} package.json files`);

const analysis = analyzeDependencies(packageJsonFiles);
generateReport(analysis);

// Export for programmatic use
module.exports = { findPackageJsonFiles, analyzeDependencies };
