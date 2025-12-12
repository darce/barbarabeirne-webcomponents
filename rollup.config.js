const path = require('path');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel').default;
const scss = require('rollup-plugin-scss');

const plugins = [
    nodeResolve({ browser: true }),
    babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
    }),
];

module.exports = [
    {
        input: path.resolve(__dirname, 'src/init.js'),
        output: {
            file: path.resolve(__dirname, 'lib/init.js'),
            format: 'iife',
            name: 'GalleryInit',
            sourcemap: true,
        },
        plugins,
    },
    {
        input: path.resolve(__dirname, 'src/components/dax-carousel/dax-carousel.js'),
        output: {
            file: path.resolve(__dirname, 'lib/components/dax-carousel/dax-carousel.js'),
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            nodeResolve({ browser: true }),
            scss({ output: false }),
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
            }),
        ],
    },
    {
        input: path.resolve(__dirname, 'src/components/gallery-intro-toggle/gallery-intro-toggle.js'),
        output: {
            file: path.resolve(__dirname, 'lib/components/gallery-intro-toggle/gallery-intro-toggle.js'),
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            nodeResolve({ browser: true }),
            scss({ output: false }),
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
            }),
        ],
    },
];
