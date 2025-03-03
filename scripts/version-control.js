/**
 * Simple version control script for Bolt environment
 * 
 * This script provides basic version control functionality:
 * - Creating snapshots of your project
 * - Viewing differences between snapshots
 * - Restoring previous snapshots
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Configuration
const SNAPSHOTS_DIR = path.join(__dirname, '../.snapshots');
const IGNORE_PATTERNS = [
  'node_modules',
  '.snapshots',
  'dist',
  '.bolt',
  'package-lock.json'
];

// Ensure snapshots directory exists
if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

// Helper functions
function generateSnapshotId() {
  return Date.now().toString() + '-' + 
    crypto.randomBytes(4).toString('hex');
}

function listFiles(dir, baseDir = '', ignorePatterns = IGNORE_PATTERNS) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(baseDir, entry.name);
    
    // Skip ignored patterns
    if (ignorePatterns.some(pattern => 
      fullPath.includes(pattern) || relativePath.includes(pattern))) {
      continue;
    }
    
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath, relativePath, ignorePatterns));
    } else {
      files.push(relativePath);
    }
  }
  
  return files;
}

function createFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

// Command handlers
function createSnapshot(message) {
  const snapshotId = generateSnapshotId();
  const snapshotDir = path.join(SNAPSHOTS_DIR, snapshotId);
  const projectRoot = path.join(__dirname, '..');
  
  // Create snapshot directory
  fs.mkdirSync(snapshotDir);
  
  // Create snapshot metadata
  const metadata = {
    id: snapshotId,
    timestamp: new Date().toISOString(),
    message: message || `Snapshot ${snapshotId}`,
    files: {}
  };
  
  // Copy files to snapshot
  const files = listFiles(projectRoot);
  for (const file of files) {
    const sourceFile = path.join(projectRoot, file);
    const targetDir = path.join(snapshotDir, path.dirname(file));
    const targetFile = path.join(snapshotDir, file);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy file
    fs.copyFileSync(sourceFile, targetFile);
    
    // Add file hash to metadata
    metadata.files[file] = createFileHash(sourceFile);
  }
  
  // Write metadata
  fs.writeFileSync(
    path.join(snapshotDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log(`Created snapshot: ${snapshotId}`);
  console.log(`Message: ${metadata.message}`);
  console.log(`Files: ${Object.keys(metadata.files).length}`);
  
  return snapshotId;
}

function listSnapshots() {
  const snapshots = fs.readdirSync(SNAPSHOTS_DIR)
    .filter(name => {
      const snapshotPath = path.join(SNAPSHOTS_DIR, name);
      const metadataPath = path.join(snapshotPath, 'metadata.json');
      return fs.existsSync(metadataPath);
    })
    .map(name => {
      const metadataPath = path.join(SNAPSHOTS_DIR, name, 'metadata.json');
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      return {
        id: metadata.id,
        timestamp: metadata.timestamp,
        message: metadata.message,
        fileCount: Object.keys(metadata.files).length
      };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  if (snapshots.length === 0) {
    console.log('No snapshots found.');
    return;
  }
  
  console.log('Snapshots:');
  snapshots.forEach((snapshot, index) => {
    const date = new Date(snapshot.timestamp).toLocaleString();
    console.log(`${index + 1}. [${snapshot.id}] ${date} - ${snapshot.message} (${snapshot.fileCount} files)`);
  });
}

function compareSnapshots(snapshotId1, snapshotId2) {
  const snapshot1Path = path.join(SNAPSHOTS_DIR, snapshotId1);
  const snapshot2Path = path.join(SNAPSHOTS_DIR, snapshotId2);
  
  if (!fs.existsSync(snapshot1Path) || !fs.existsSync(snapshot2Path)) {
    console.error('One or both snapshots do not exist.');
    return;
  }
  
  const metadata1 = JSON.parse(fs.readFileSync(path.join(snapshot1Path, 'metadata.json'), 'utf8'));
  const metadata2 = JSON.parse(fs.readFileSync(path.join(snapshot2Path, 'metadata.json'), 'utf8'));
  
  const allFiles = new Set([
    ...Object.keys(metadata1.files),
    ...Object.keys(metadata2.files)
  ]);
  
  const added = [];
  const removed = [];
  const modified = [];
  const unchanged = [];
  
  for (const file of allFiles) {
    const inSnapshot1 = file in metadata1.files;
    const inSnapshot2 = file in metadata2.files;
    
    if (!inSnapshot1) {
      added.push(file);
    } else if (!inSnapshot2) {
      removed.push(file);
    } else if (metadata1.files[file] !== metadata2.files[file]) {
      modified.push(file);
    } else {
      unchanged.push(file);
    }
  }
  
  console.log(`Comparing snapshots: ${snapshotId1} and ${snapshotId2}`);
  console.log(`Added: ${added.length} files`);
  added.forEach(file => console.log(`  + ${file}`));
  
  console.log(`Removed: ${removed.length} files`);
  removed.forEach(file => console.log(`  - ${file}`));
  
  console.log(`Modified: ${modified.length} files`);
  modified.forEach(file => console.log(`  ~ ${file}`));
  
  console.log(`Unchanged: ${unchanged.length} files`);
}

function restoreSnapshot(snapshotId) {
  const snapshotPath = path.join(SNAPSHOTS_DIR, snapshotId);
  
  if (!fs.existsSync(snapshotPath)) {
    console.error(`Snapshot ${snapshotId} does not exist.`);
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(path.join(snapshotPath, 'metadata.json'), 'utf8'));
  const projectRoot = path.join(__dirname, '..');
  
  // Create backup of current state
  const backupId = createSnapshot('Automatic backup before restore');
  
  // Restore files
  for (const file of Object.keys(metadata.files)) {
    const sourceFile = path.join(snapshotPath, file);
    const targetFile = path.join(projectRoot, file);
    const targetDir = path.dirname(targetFile);
    
    // Skip if source file doesn't exist
    if (!fs.existsSync(sourceFile)) {
      console.warn(`Warning: File ${file} not found in snapshot.`);
      continue;
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy file
    fs.copyFileSync(sourceFile, targetFile);
  }
  
  console.log(`Restored snapshot: ${snapshotId}`);
  console.log(`Created backup: ${backupId}`);
}

// Command line interface
function printUsage() {
  console.log('Usage:');
  console.log('  node version-control.js create [message]  - Create a new snapshot');
  console.log('  node version-control.js list              - List all snapshots');
  console.log('  node version-control.js compare id1 id2   - Compare two snapshots');
  console.log('  node version-control.js restore id        - Restore a snapshot');
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    printUsage();
    return;
  }
  
  switch (command) {
    case 'create':
      createSnapshot(args[1]);
      break;
    case 'list':
      listSnapshots();
      break;
    case 'compare':
      if (args.length < 3) {
        console.error('Error: Two snapshot IDs required for compare.');
        printUsage();
        return;
      }
      compareSnapshots(args[1], args[2]);
      break;
    case 'restore':
      if (args.length < 2) {
        console.error('Error: Snapshot ID required for restore.');
        printUsage();
        return;
      }
      restoreSnapshot(args[1]);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printUsage();
  }
}

// Run the script
main();