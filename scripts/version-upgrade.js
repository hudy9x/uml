#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the package.json path
const packageJsonPath = join(process.cwd(), 'package.json');
const versionLockPath = join(process.cwd(), '.version-lock');

// Read current version from package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
let [major, minor, patch] = packageJson.version.split('.').map(Number);

// Get the last processed commit hash
function getLastProcessedCommit() {
  try {
    if (existsSync(versionLockPath)) {
      return readFileSync(versionLockPath, 'utf8').trim();
    }
  } catch (error) {
    console.log('No version lock file found, will process all commits');
  }
  return null;
}

// Save the current HEAD as the last processed commit
function saveLastProcessedCommit() {
  const currentCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  writeFileSync(versionLockPath, currentCommit);
}

// Get commits since last processed commit
function getNewCommits() {
  const lastProcessedCommit = getLastProcessedCommit();
  
  try {
    if (lastProcessedCommit) {
      // Get commits since last processed commit
      return execSync(`git log ${lastProcessedCommit}..HEAD --pretty=format:"%s"`, { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
    } else {
      // If no last processed commit, get all commits
      return execSync('git log --pretty=format:"%s"', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
    }
  } catch (error) {
    console.error('Error getting git commits:', error.message);
    return [];
  }
}

// Analyze commits and determine version bump
function analyzeCommits(commits) {
  let shouldBumpMajor = false;
  let shouldBumpMinor = false;
  let shouldBumpPatch = false;

  commits.forEach(commit => {
    const lowerCommit = commit.toLowerCase();
    
    // Check for breaking changes
    if (lowerCommit.includes('breaking change') || lowerCommit.includes('!:')) {
      shouldBumpMajor = true;
    }
    // Check for features
    else if (lowerCommit.startsWith('feat:') || lowerCommit.startsWith('feature:')) {
      shouldBumpMinor = true;
    }
    // Check for patches
    else if (
      lowerCommit.startsWith('fix:') ||
      lowerCommit.startsWith('perf:') ||
      lowerCommit.startsWith('refactor:') ||
      lowerCommit.startsWith('style:') ||
      lowerCommit.startsWith('test:') ||
      lowerCommit.startsWith('docs:')
    ) {
      shouldBumpPatch = true;
    }
  });

  return { shouldBumpMajor, shouldBumpMinor, shouldBumpPatch };
}

// Update version based on commit analysis
function updateVersion() {
  const commits = getNewCommits();
  
  if (commits.length === 0) {
    console.log('No new commits to analyze');
    return null;
  }

  console.log(`Analyzing ${commits.length} new commits...`);
  commits.forEach(commit => console.log(`- ${commit}`));

  const { shouldBumpMajor, shouldBumpMinor, shouldBumpPatch } = analyzeCommits(commits);

  if (shouldBumpMajor) {
    major++;
    minor = 0;
    patch = 0;
  } else if (shouldBumpMinor) {
    minor++;
    patch = 0;
  } else if (shouldBumpPatch) {
    patch++;
  } else {
    console.log('No version bump needed');
    return null;
  }

  return `${major}.${minor}.${patch}`;
}

// Main execution
const newVersion = updateVersion();

if (newVersion) {
  // Update package.json
  packageJson.version = newVersion;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  // Save the current commit as last processed
  saveLastProcessedCommit();
  
  console.log(`Version upgraded to ${newVersion}`);
  console.log('Last processed commit saved to .version-lock');
} 