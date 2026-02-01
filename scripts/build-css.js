/**
 * Build script for CSS
 * 
 * Three responsibilities:
 * 1. Compile component SCSS → CSS in lib/ directories (for JS imports)
 * 2. Compile site SCSS (main.scss, gallery.scss) 
 * 3. Concatenate all into single lib/styles.css (reduces network requests)
 * 
 * Uses sass CLI (modern API) to avoid deprecation warnings.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LIB_DIR = path.join(ROOT, 'lib');
const TEMP_DIR = path.join(LIB_DIR, '.css-temp');

// Static CSS files to include first (order matters)
const STATIC_CSS_FILES = [
  // reset.css is now imported in main.scss
];

// Site SCSS files to compile (order matters)
const SITE_SCSS_FILES = [
  'src/styles/main.scss',
  'src/styles/gallery.scss',
  'src/styles/critical.scss',
];

// Component SCSS files to compile
// Each will be compiled to CSS in lib/components/ dir AND included in aggregated output
const COMPONENT_SCSS_FILES = [
  {
    src: 'src/components/dax-carousel/dax-carousel.scss',
    dest: 'lib/components/dax-carousel/dax-carousel.css',
  },
  {
    src: 'src/components/dax-nav/dax-nav.scss',
    dest: 'lib/components/dax-nav/dax-nav.css',
  },
  {
    src: 'src/components/dax-sidebar/dax-sidebar.scss',
    dest: 'lib/components/dax-sidebar/dax-sidebar.css',
  },
  {
    src: 'src/components/gallery-intro-toggle/gallery-intro-toggle.scss',
    dest: 'lib/components/gallery-intro-toggle/gallery-intro-toggle.css',
  },
];

const OUTPUT_FILE = path.join(LIB_DIR, 'styles.css');

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Compile a single SCSS file to CSS
const compileSass = (inputPath, outputPath) => {
  const cmd = `sass "${inputPath}" "${outputPath}" --style=compressed --no-source-map --quiet-deps 2>&1`;
  try {
    execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`Error compiling ${inputPath}:`);
    console.error(error.stdout || error.message);
    return false;
  }
};

// Main build function
const buildCSS = () => {
  console.log('Building CSS...');

  ensureDir(TEMP_DIR);

  const cssChunks = [];
  let hasErrors = false;

  // 1. Include static CSS files first
  STATIC_CSS_FILES.forEach((cssPath) => {
    const fullPath = path.join(ROOT, cssPath);
    if (fs.existsSync(fullPath)) {
      cssChunks.push(fs.readFileSync(fullPath, 'utf8'));
      console.log(`  ✓ ${cssPath}`);
    } else {
      console.error(`  ✗ ${cssPath} (not found)`);
      hasErrors = true;
    }
  });

  // 2. Compile site SCSS files
  SITE_SCSS_FILES.forEach((scssPath, index) => {
    const fullPath = path.join(ROOT, scssPath);
    const tempPath = path.join(TEMP_DIR, `site-${index}.css`);

    if (!fs.existsSync(fullPath)) {
      console.error(`  ✗ ${scssPath} (not found)`);
      hasErrors = true;
      return;
    }

    if (compileSass(fullPath, tempPath)) {
      cssChunks.push(fs.readFileSync(tempPath, 'utf8'));
      console.log(`  ✓ ${scssPath}`);
    } else {
      hasErrors = true;
    }
  });

  // 3. Compile each component SCSS to its lib/ destination AND collect for aggregation
  COMPONENT_SCSS_FILES.forEach(({ src, dest }) => {
    const srcPath = path.join(ROOT, src);
    const destPath = path.join(ROOT, dest);

    if (!fs.existsSync(srcPath)) {
      console.error(`  ✗ ${src} (not found)`);
      hasErrors = true;
      return;
    }

    // Ensure destination directory exists
    ensureDir(path.dirname(destPath));

    // Compile to final destination (for JS imports)
    if (compileSass(srcPath, destPath)) {
      // Also collect for aggregation
      cssChunks.push(fs.readFileSync(destPath, 'utf8'));
      console.log(`  ✓ ${src} → ${dest}`);
    } else {
      hasErrors = true;
    }
  });

  if (hasErrors) {
    console.error('\nBuild failed with errors.');
    process.exit(1);
  }

  // 3. Concatenate all CSS chunks
  const finalCSS = cssChunks.join('\n');
  fs.writeFileSync(OUTPUT_FILE, finalCSS);

  // 4. Cleanup temp directory
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  const sizeKB = (Buffer.byteLength(finalCSS, 'utf8') / 1024).toFixed(2);
  console.log(`\n✓ Created ${OUTPUT_FILE} (${sizeKB} KB)`);
};

buildCSS();
