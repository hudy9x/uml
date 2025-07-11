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
const tauriConfigPath = join(process.cwd(), 'src-tauri', 'tauri.conf.json');

// Read current version from package.json
const packageJson = process.env.CURRENT_VERSION ? process.env.CURRENT_VERSION : JSON.parse(readFileSync(packageJsonPath, 'utf8'));
let [major, minor, patch] = packageJson.version.split('.').map(Number);

// Function to update Tauri config version
function updateTauriConfig(version) {
  try {
    const tauriConfig = JSON.parse(readFileSync(tauriConfigPath, 'utf8'));
    tauriConfig.version = version;
    writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2) + '\n');
    console.log('Updated Tauri config version');
  } catch (error) {
    console.error('Error updating Tauri config:', error.message);
  }
}

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
      // Get commits since last processed commit, excluding the last processed commit itself
      return execSync(`git log ${lastProcessedCommit}..HEAD --not ${lastProcessedCommit} --pretty=format:"%s"`, { encoding: 'utf8' })
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
  let highestBumpType = 'none';

  // Define verb patterns for different types of changes
  const featureVerbs = [
    'add',
    'create',
    'implement',
    'introduce',
    'enable'
  ];

  const patchVerbs = [
    'update',
    'fix',
    'refactor',
    'format',
    'remove',
    'change',
    'merge',
    'clean',
    'optimize',
    'adjust',
    'modify',
    'rename',
    'move',
    'delete',
    'disable'
  ];

  // Track version changes for logging
  let tempMajor = major;
  let tempMinor = minor;
  let tempPatch = patch;
  
  console.log('\nAnalyzing commits with potential version changes:');
  commits.forEach(commit => {
    const lowerCommit = commit.toLowerCase();
    const firstWord = lowerCommit.split(' ')[0];
    let commitBumpType = 'none';

    if (lowerCommit.startsWith('skip') || lowerCommit.includes('bump new version') || lowerCommit.includes('skip:')) {
      return;
    }
    
    // Check for breaking changes - highest priority
    if (lowerCommit.includes('breaking change') || lowerCommit.includes('!:')) {
      commitBumpType = 'major';
      if (highestBumpType !== 'major') {
        tempMajor++;
        tempMinor = 0;
        tempPatch = 0;
      }
      highestBumpType = 'major';
    }
    // Check for features - medium priority
    else if (
      lowerCommit.startsWith('feat:') || 
      lowerCommit.startsWith('feature:') ||
      featureVerbs.some(verb => firstWord === verb)
    ) {
      commitBumpType = 'minor';
      if (highestBumpType !== 'major') {
        if (highestBumpType !== 'minor') {
          tempMinor++;
          tempPatch = 0;
        }
        highestBumpType = 'minor';
      }
    }
    // Check for patches - lowest priority
    else if (
      lowerCommit.startsWith('fix:') ||
      lowerCommit.startsWith('perf:') ||
      lowerCommit.startsWith('refactor:') ||
      lowerCommit.startsWith('style:') ||
      lowerCommit.startsWith('test:') ||
      lowerCommit.startsWith('docs:') ||
      patchVerbs.some(verb => firstWord === verb)
    ) {
      commitBumpType = 'patch';
      tempPatch++;
      highestBumpType = 'patch';
    }
    // Default to patch for unmatched commit types
    else {
      commitBumpType = 'patch';
      tempPatch++;
      highestBumpType = 'patch';
    }
    console.log(`- ${commit} (${commitBumpType}: v${tempMajor}.${tempMinor}.${tempPatch})`);
  });

  return {
    major: tempMajor,
    minor: tempMinor,
    patch: tempPatch,
    shouldBumpMajor: highestBumpType === 'major',
    shouldBumpMinor: highestBumpType === 'minor',
    shouldBumpPatch: highestBumpType === 'patch'
  };
}

// Update version based on commit analysis
function updateVersion() {
  const commits = getNewCommits();
  
  if (commits.length === 0) {
    console.log('No new commits to analyze');
    return null;
  }

  const currentVersion = `${major}.${minor}.${patch}`;
  console.log(`\nStarting version: ${currentVersion}`);

  const { major: newMajor, minor: newMinor, patch: newPatch } = analyzeCommits(commits);

  // Apply the highest level version bump only once
  // if (shouldBumpMajor) {
  //   console.log('\nApplying major version bump...');
  //   major++;
  //   minor = 0;
  //   patch = 0;
  // } else if (shouldBumpMinor) {
  //   console.log('\nApplying minor version bump...');
  //   minor++;
  //   patch = 0;
  // } else if (shouldBumpPatch) {
  //   console.log('\nApplying patch version bump...');
  //   patch++;
  // } else {
  //   console.log('\nNo version bump needed');
  //   return null;
  // }

  const newVersion = `${newMajor}.${newMinor}.${newPatch}`;
  console.log(`\nFinal version change: ${currentVersion} → ${newVersion}`);
  return newVersion;
}

// Main execution
const newVersion = updateVersion();

if (newVersion) {
  // Update package.json
  packageJson.version = newVersion;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  // Update Tauri config version
  updateTauriConfig(newVersion);
  
  // Save the current commit as last processed
  saveLastProcessedCommit();
  
  console.log(`Version upgraded to ${newVersion}`);
  console.log('Last processed commit saved to .version-lock');
} 