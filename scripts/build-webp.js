#!/usr/bin/env node
/**
 * WebP Image Conversion Script
 * 
 * Converts all JPEG/PNG images in /images/ directories to WebP format.
 * WebP files are created alongside originals (not replacing them) for fallback support.
 * 
 * Usage:
 *   node scripts/build-webp.js          # Convert all images
 *   node scripts/build-webp.js --clean  # Remove all generated WebP files
 *   node scripts/build-webp.js --dry    # Show what would be converted without converting
 * 
 * Requirements:
 *   brew install webp   (provides cwebp command)
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
  quality: 80,                          // WebP quality (0-100)
  patterns: ['**/*images*/**/*.jpg', '**/*images*/**/*.jpeg', '**/*images*/**/*.png'],
  excludeDirs: ['node_modules', '.git', 'lib'],
};

// Parse CLI arguments
const args = process.argv.slice(2);
const MODE = {
  clean: args.includes('--clean'),
  dry: args.includes('--dry') || args.includes('--dry-run'),
};

/**
 * Check if cwebp is installed
 */
const checkDependencies = () => {
  const result = spawnSync('which', ['cwebp'], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error('Error: cwebp is not installed.');
    console.error('Install with: brew install webp');
    process.exit(1);
  }
};

/**
 * Find all image files matching patterns
 */
const findImages = () => {
  const images = [];

  const walkDir = (dir) => {
    // Skip excluded directories
    const basename = path.basename(dir);
    if (CONFIG.excludeDirs.includes(basename)) return;

    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile()) {
        // Only process files in directories containing 'images' in the path
        const relativePath = path.relative(ROOT, fullPath);
        if (!relativePath.includes('images')) continue;

        // Match supported extensions
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          images.push(fullPath);
        }
      }
    }
  };

  walkDir(ROOT);
  return images.sort();
};

/**
 * Get WebP output path for an image
 */
const getWebpPath = (imagePath) => {
  const ext = path.extname(imagePath);
  return imagePath.replace(ext, '.webp');
};

/**
 * Convert a single image to WebP
 */
const convertToWebp = (imagePath) => {
  const webpPath = getWebpPath(imagePath);

  // Skip if WebP already exists and is newer than source
  if (fs.existsSync(webpPath)) {
    const srcStat = fs.statSync(imagePath);
    const webpStat = fs.statSync(webpPath);
    if (webpStat.mtimeMs > srcStat.mtimeMs) {
      return { status: 'skipped', reason: 'up-to-date' };
    }
  }

  try {
    const cmd = `cwebp -q ${CONFIG.quality} "${imagePath}" -o "${webpPath}" 2>/dev/null`;
    execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });

    // Get file sizes for comparison
    const srcSize = fs.statSync(imagePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((1 - webpSize / srcSize) * 100).toFixed(1);

    return {
      status: 'converted',
      srcSize,
      webpSize,
      savings: `${savings}%`
    };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

/**
 * Remove all generated WebP files
 */
const cleanWebpFiles = () => {
  console.log('Cleaning WebP files...\n');

  const images = findImages();
  let removed = 0;

  for (const imagePath of images) {
    const webpPath = getWebpPath(imagePath);
    if (fs.existsSync(webpPath)) {
      if (MODE.dry) {
        console.log(`  Would remove: ${path.relative(ROOT, webpPath)}`);
      } else {
        fs.unlinkSync(webpPath);
        console.log(`  Removed: ${path.relative(ROOT, webpPath)}`);
      }
      removed++;
    }
  }

  console.log(`\n${MODE.dry ? 'Would remove' : 'Removed'} ${removed} WebP files.`);
};

/**
 * Format bytes for display
 */
const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Main build function
 */
const buildWebp = () => {
  checkDependencies();

  if (MODE.clean) {
    cleanWebpFiles();
    return;
  }

  console.log('Converting images to WebP...\n');

  const images = findImages();

  if (images.length === 0) {
    console.log('No images found in /images/ directories.');
    return;
  }

  let converted = 0;
  let skipped = 0;
  let errors = 0;
  let totalSrcSize = 0;
  let totalWebpSize = 0;

  for (const imagePath of images) {
    const relativePath = path.relative(ROOT, imagePath);

    if (MODE.dry) {
      console.log(`  Would convert: ${relativePath}`);
      converted++;
      continue;
    }

    const result = convertToWebp(imagePath);

    if (result.status === 'converted') {
      console.log(`  ✓ ${relativePath} (${result.savings} savings)`);
      converted++;
      totalSrcSize += result.srcSize;
      totalWebpSize += result.webpSize;
    } else if (result.status === 'skipped') {
      skipped++;
    } else {
      console.error(`  ✗ ${relativePath}: ${result.message}`);
      errors++;
    }
  }

  console.log('\n--- Summary ---');
  console.log(`  Found:     ${images.length} images`);
  console.log(`  Converted: ${converted}`);
  console.log(`  Skipped:   ${skipped} (already up-to-date)`);
  if (errors > 0) console.log(`  Errors:    ${errors}`);

  if (totalSrcSize > 0) {
    const totalSavings = ((1 - totalWebpSize / totalSrcSize) * 100).toFixed(1);
    console.log(`\n  Original:  ${formatBytes(totalSrcSize)}`);
    console.log(`  WebP:      ${formatBytes(totalWebpSize)}`);
    console.log(`  Saved:     ${formatBytes(totalSrcSize - totalWebpSize)} (${totalSavings}%)`);
  }
};

buildWebp();
