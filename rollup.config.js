const path = require('path');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel').default;

module.exports = {
    input: path.resolve(__dirname, 'src/init.js'),
    output: {
        file: path.resolve(__dirname, 'lib/init.js'),
        format: 'iife',
        name: 'GalleryInit',
        sourcemap: true,
    },
    plugins: [
        nodeResolve({
            browser: true,
        }),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
        }),
    ],
};
