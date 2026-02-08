/**
 * Script to inline critical CSS and remove font preload links
 *
 * Usage: node scripts/inline-critical.js [target-dir]
 *
 * Reads dist/lib/styles.css (or target-dir/lib/styles.css) and replaces
 * <link rel="stylesheet" href="...lib/styles.css"> with inline <style> in
 * every HTML file. The full CSS (~20KB) is inlined to eliminate FOUC.
 *
 * Also rewrites relative font URLs in the inlined CSS so they resolve
 * correctly from each HTML file's directory, and removes <link rel="preload">
 * font hints (redundant once the @font-face rules are inline).
 */

const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

const CONFIG = {
    includeDirs: ['.', 'appalachian', 'becoming', 'belfast', 'children', 'dismal', 'praise', 'press'],
};

// Parse CLI arguments
const args = process.argv.slice(2);
const TARGET_DIR = args[0] ? path.resolve(process.cwd(), args[0]) : ROOT;

// The compiled CSS uses font paths relative to dist/lib/ (e.g. "../fonts/...").
// We need to recalculate the relative path from each HTML file to dist/fonts/.
const FONTS_DIR = path.join(TARGET_DIR, 'fonts');

/**
 * Rewrite ../fonts/ URLs in CSS to be relative to the given HTML file's directory.
 */
const rewriteFontUrls = (css, htmlDir) => {
    const relPath = path.relative(htmlDir, FONTS_DIR).split(path.sep).join('/');
    // relPath will be "fonts" for root-level pages, "../fonts" for subdir pages
    return css.replaceAll('../fonts/', `${relPath}/`);
};

const findHtmlFiles = () => {
    const files = [];
    CONFIG.includeDirs.forEach((dir) => {
        // If target dir is specified, look inside it
        const searchBase = args[0] ? path.join(TARGET_DIR, dir) : path.join(ROOT, dir);

        if (!fs.existsSync(searchBase)) return;

        // Read directory
        const entries = fs.readdirSync(searchBase, { withFileTypes: true });
        entries.forEach((entry) => {
            if (entry.isFile() && entry.name.endsWith('.html')) {
                files.push(path.join(searchBase, entry.name));
            }
        });
    });
    return files;
};

const run = () => {
    // CSS lives at TARGET_DIR/lib/styles.css (written by build:css)
    const CSS_PATH = path.join(TARGET_DIR, 'lib/styles.css');

    if (!fs.existsSync(CSS_PATH)) {
        console.error(`Error: ${CSS_PATH} not found. Run npm run build:css first.`);
        process.exit(1);
    }

    const cssContent = fs.readFileSync(CSS_PATH, 'utf8');
    const files = findHtmlFiles();

    console.log(`Inlining CSS into ${files.length} HTML files...`);

    let changed = 0;

    files.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        const dom = new JSDOM(content);
        const doc = dom.window.document;

        // Find the stylesheet link
        // Note: usage might vary (href="lib/styles.css" or href="./lib/styles.css" etc)
        // We look for a link with href ending in lib/styles.css
        const link = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'))
            .find((el) => el.getAttribute('href').endsWith('lib/styles.css'));

        if (link) {
            console.log(`  Processing ${path.relative(ROOT, filePath)}`);

            // Rewrite font URLs relative to this HTML file's directory
            const htmlDir = path.dirname(filePath);
            const adjustedCss = rewriteFontUrls(cssContent, htmlDir);

            const style = doc.createElement('style');
            style.textContent = adjustedCss;

            link.parentNode.replaceChild(style, link);

            // Remove font preload links (redundant with inlined @font-face)
            const preloads = Array.from(doc.querySelectorAll('link[rel="preload"][as="font"]'));
            preloads.forEach((el) => el.remove());

            fs.writeFileSync(filePath, dom.serialize());
            changed++;
        } else {
            console.log(`  Skipping ${path.relative(ROOT, filePath)} (link not found)`);
        }
    });

    console.log(`\nInlining complete. ${changed} files modified.`);
};

run();
