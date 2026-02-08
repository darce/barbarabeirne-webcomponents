/**
 * Script to inline critical CSS and defer main stylesheet
 * 
 * Usage: node scripts/inline-critical.js
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const CRITICAL_CSS_PATH = path.join(ROOT, 'lib/styles.css'); // We use the main bundle as critical for now (it's small ~20kb)
// OR we could extract just critical.css if we had a separate build.
// Given the user asked for critical.scss content to be inlined, let's look at how build-css.js works.
// build-css.js bundles EVERYTHING into lib/styles.css.
// To follow instructions "The critical.scss content should be inlined", we need to compile critical.scss separately
// OR just inline the whole small CSS file.
// Let's check the size of lib/styles.css. It's ~20KB. Inlining 20KB is acceptable and simplest.
// It avoids FOUC completely.

// However, strictly speaking, "critical.scss content" implies just that file.
// But critical.scss alone won't style the whole page (reset, typography, etc are in main.scss).
// The user likely wants to eliminate render blocking CSS.
// Strategy: Inline the WHOLE `lib/styles.css` content into <style> in head.
// Remove the <link rel="stylesheet"> entirely?
// Or inline critical parts and defer the rest?
// Given the file size (20KB), inlining the whole thing is the best performance move for this site.
// It eliminates an RTT.

// Let's refine the plan:
// 1. Read lib/styles.css
// 2. For each HTML file:
// 3. Find <link rel="stylesheet" href="lib/styles.css"> (or similar)
// 4. Replace with <style>...css content...</style>

const CONFIG = {
  includeDirs: ['.', 'appalachian', 'becoming', 'belfast', 'children', 'dismal', 'praise', 'press'],
};

// Parse CLI arguments
const args = process.argv.slice(2);
const TARGET_DIR = args[0] ? path.resolve(process.cwd(), args[0]) : ROOT;

const findHtmlFiles = () => {
  const files = [];
  CONFIG.includeDirs.forEach(dir => {
    // If target dir is specified, look inside it
    const searchBase = args[0] ? path.join(TARGET_DIR, dir) : path.join(ROOT, dir);

    if (!fs.existsSync(searchBase)) return;

    // Read directory
    const entries = fs.readdirSync(searchBase, { withFileTypes: true });
    entries.forEach(entry => {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(path.join(searchBase, entry.name));
      }
    });
  });
  return files;
};

const run = () => {
  // CSS is always in ROOT/lib/styles.css (source build artifact)
  // OR if we are building to dist, maybe it's in dist/lib/styles.css?
  // Let's assume the build process put it in TARGET_DIR/lib/styles.css if we are running on dist.
  const CSS_PATH = args[0] ? path.join(TARGET_DIR, 'lib/styles.css') : CRITICAL_CSS_PATH;

  if (!fs.existsSync(CSS_PATH)) {
    console.error(`Error: ${CSS_PATH} not found. Run npm run build:css first.`);
    process.exit(1);
  }

  const cssContent = fs.readFileSync(CSS_PATH, 'utf8');
  const files = findHtmlFiles();

  console.log(`Inlining CSS into ${files.length} HTML files...`);

  let changed = 0;

  files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(content);
    const doc = dom.window.document;

    // Find the stylesheet link
    // Note: usage might vary (href="lib/styles.css" or href="./lib/styles.css" etc)
    // We look for a link with href ending in lib/styles.css
    const link = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'))
      .find(el => el.getAttribute('href').endsWith('lib/styles.css'));

    if (link) {
      console.log(`  Processing ${path.relative(ROOT, filePath)}`);

      const style = doc.createElement('style');
      style.textContent = cssContent;

      link.parentNode.replaceChild(style, link);

      fs.writeFileSync(filePath, dom.serialize());
      changed++;
    } else {
      // Check if already inlined? (Has <style> with content?)
      // Or maybe using a different path?
      console.log(`  Skipping ${path.relative(ROOT, filePath)} (link not found)`);
    }
  });

  console.log(`\nInlining complete. ${changed} files modified.`);
};

run();
