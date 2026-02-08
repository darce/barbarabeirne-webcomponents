#!/usr/bin/env node
/**
 * Migration Script: Image to Picture Element
 * 
 * Converts standalone <img> tags in gallery pages to <picture> elements
 * with WebP sources to prevent double-download flash and enable native loading.
 * 
 * Usage:
 *   node scripts/migrate-to-picture.js          # Run migration
 *   node scripts/migrate-to-picture.js --dry    # Show what would happen
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = {
  includeDirs: ['.', 'appalachian', 'becoming', 'belfast', 'children', 'dismal', 'praise', 'press'],
  extensions: ['.html'],
  excludeFiles: [],
};

// Parse CLI arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry') || args.includes('--dry-run');

/**
 * Find all HTML files
 */
const findHtmlFiles = () => {
  const files = [];

  CONFIG.includeDirs.forEach(dir => {
    const dirPath = path.join(ROOT, dir);
    if (!fs.existsSync(dirPath)) return;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    entries.forEach(entry => {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(path.join(dirPath, entry.name));
      }
    });
  });

  return files;
};

/**
 * Check if WebP version of an image exists
 */
const webpExists = (imgSrc, htmlPath) => {
  if (!imgSrc) return false;

  // Resolve path relative to HTML file
  const htmlDir = path.dirname(htmlPath);
  const absoluteImgPath = path.resolve(htmlDir, imgSrc);

  // Check if original file exists (sanity check)
  if (!fs.existsSync(absoluteImgPath)) {
    // Try relative to root if it starts with / or no ./
    const rootPath = path.join(ROOT, imgSrc.replace(/^\//, ''));
    if (fs.existsSync(rootPath)) {
      const webpPath = rootPath.replace(/\.(jpe?g|png)$/i, '.webp');
      return fs.existsSync(webpPath) ? webpPath : false;
    }
    return false;
  }

  const webpPath = absoluteImgPath.replace(/\.(jpe?g|png)$/i, '.webp');
  return fs.existsSync(webpPath) ? webpPath : false;
};

/**
 * Process a single HTML file
 */
const processFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const dom = new JSDOM(content);
  const doc = dom.window.document;
  let modified = false;

  // Find images in carousel or slides
  // Select images that are direct children of li (dax-slide) or picture (already wrapped)
  // We want to find unwrapped images
  const images = doc.querySelectorAll('dax-carousel img, .dax-slides img');

  if (images.length === 0) return false;

  console.log(`\nProcessing ${path.relative(ROOT, filePath)}...`);

  images.forEach(img => {
    // Skip if already wrapped in picture
    if (img.closest('picture')) return;

    const src = img.getAttribute('src');
    if (!src || !src.match(/\.(jpe?g|png)$/i)) return;

    // Check if WebP exists
    const webpPath = webpExists(src, filePath);
    if (!webpPath) {
      console.log(`  Skipping ${src} (no WebP found)`);
      return;
    }

    const webpSrc = src.replace(/\.(jpe?g|png)$/i, '.webp');

    if (DRY_RUN) {
      console.log(`  Would wrap: ${src} -> picture (webp: ${webpSrc})`);
      modified = true;
      return;
    }

    // Create picture element
    const picture = doc.createElement('picture');

    // Copy classes if any (optional, but dax-carousel doesn't strictly need them on picture)

    // Create source
    const source = doc.createElement('source');
    source.setAttribute('srcset', webpSrc);
    source.setAttribute('type', 'image/webp');

    // Insert picture before img
    img.parentNode.insertBefore(picture, img);

    // Move img into picture
    picture.appendChild(source);
    picture.appendChild(img); // Moves the node

    console.log(`  Wrapped: ${src}`);
    modified = true;
  });

  if (modified && !DRY_RUN) {
    fs.writeFileSync(filePath, dom.serialize());
    return true;
  }

  return modified;
};

const run = () => {
  // Check if jsdom is available
  try {
    require.resolve('jsdom');
  } catch (e) {
    console.error('Error: jsdom is required. Run: npm install jsdom --save-dev');
    process.exit(1);
  }

  const files = findHtmlFiles();
  console.log(`Found ${files.length} HTML files to inspect.`);

  let changed = 0;

  files.forEach(file => {
    if (processFile(file)) {
      changed++;
    }
  });

  console.log(`\nMigration complete. ${changed} files modified.`);
};

run();
