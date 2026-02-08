const path = require('path');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel').default;
const { string } = require('rollup-plugin-string');

/**
 * Rollup configuration
 * 
 * CSS is pre-compiled by build:css before bundling.
 * JS components import the compiled CSS files from .build/css/
 * using rollup-plugin-string to inline them as strings.
 * All output goes directly to dist/lib/.
 */

const plugins = [
    nodeResolve({ browser: true }),
    babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
    }),
];

// Plugin to import CSS files as strings (for Shadow DOM injection)
const cssStringPlugin = string({
    include: '**/*.css',
});

// Shared plugins for component bundles
const componentPlugins = [
    nodeResolve({ browser: true }),
    cssStringPlugin,
    babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
    }),
];

module.exports = [
    {
        input: path.resolve(__dirname, 'src/init.js'),
        output: {
            file: path.resolve(__dirname, 'dist/lib/init.js'),
            format: 'iife',
            name: 'GalleryInit',
            sourcemap: true,
        },
        plugins,
    },
    {
        input: path.resolve(__dirname, 'src/components/dax-carousel/dax-carousel.js'),
        output: {
            file: path.resolve(__dirname, 'dist/lib/components/dax-carousel/dax-carousel.js'),
            format: 'esm',
            sourcemap: true,
        },
        plugins: componentPlugins,
    },
    {
        input: path.resolve(__dirname, 'src/components/gallery-intro-toggle/gallery-intro-toggle.js'),
        output: {
            file: path.resolve(__dirname, 'dist/lib/components/gallery-intro-toggle/gallery-intro-toggle.js'),
            format: 'esm',
            sourcemap: true,
        },
        plugins: componentPlugins,
    },
    {
        input: path.resolve(__dirname, 'src/components/dax-nav/dax-nav.js'),
        output: {
            file: path.resolve(__dirname, 'dist/lib/components/dax-nav/dax-nav.js'),
            format: 'esm',
            sourcemap: true,
        },
        plugins: componentPlugins,
    },
    {
        input: path.resolve(__dirname, 'src/components/dax-sidebar/dax-sidebar.js'),
        output: {
            file: path.resolve(__dirname, 'dist/lib/components/dax-sidebar/dax-sidebar.js'),
            format: 'esm',
            sourcemap: true,
        },
        plugins: componentPlugins,
    },
];
