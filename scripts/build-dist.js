/**
 * Production Build Script
 *
 * Orchestrates the build process for the distribution folder (dist/).
 * 1. Cleans dist/
 * 2. Runs build steps (css → .build/ + dist/lib/, bundle → dist/lib/)
 * 3. Copies static assets and HTML to dist/
 * 4. Inlines Critical CSS into dist/ HTML files
 *
 * No intermediate lib/ directory is used; compiled assets go straight to dist/lib/.
 * Component CSS intermediates live in .build/css/ (gitignored) for rollup imports.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Files / directories to copy into dist (HTML pages + static assets only)
const COPY_LIST = [
    'index.html',
    'contact.html',
    'exhibitions.html',
    'press.html',
    'bio.html',
    'appalachian',
    'becoming',
    'belfast',
    'children',
    'dismal',
    'praise',
    'press', // folder
    'fonts',
    'images',
];

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const runCommand = (cmd) => {
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: 'inherit', cwd: ROOT });
};

const build = () => {
    console.log('\nStarting Production Build...\n');

    // 1. clean dist
    if (fs.existsSync(DIST)) {
        console.log('Cleaning dist/...');
        fs.rmSync(DIST, { recursive: true, force: true });
    }
    ensureDir(DIST);

    // 2. Run build steps (CSS to .build/ + dist/lib/, JS bundles to dist/lib/)
    console.log('Running build steps...');
    runCommand('npm run build:webp');
    runCommand('npm run build:css');
    runCommand('npm run build:bundle');

    // 3. Copy Assets
    console.log('\nCopying assets to dist/...');
    const copy = (src, dest) => {
        if (!fs.existsSync(src)) return;
        const stat = fs.lstatSync(src);
        if (stat.isDirectory()) {
            ensureDir(dest);
            fs.readdirSync(src).forEach(
                (child) => copy(path.join(src, child), path.join(dest, child))
            );
        } else {
            fs.copyFileSync(src, dest);
        }
    };

    COPY_LIST.forEach((item) => {
        const srcPath = path.join(ROOT, item);
        const destPath = path.join(DIST, item);

        if (fs.existsSync(srcPath)) {
            console.log(`  ${item}`);
            copy(srcPath, destPath);
        } else {
            console.warn(`  Warning: ${item} not found.`);
        }
    });

    // 4. Inline Critical CSS
    // We pass "dist" as argument to the script
    console.log('\nInlining Critical CSS in dist/...');
    runCommand('node scripts/inline-critical.js dist');

    console.log('\nBuild Complete! Output in dist/');
};

build();
