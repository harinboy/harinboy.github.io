'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var babel = require('@rollup/plugin-babel');
var terser = require('@rollup/plugin-terser');
var license = require('rollup-plugin-license');
var path = require('path');

const JS_SRC = '_javascript';
const JS_DIST = 'assets/js/dist';
const isProd = process.env.NODE_ENV === 'production';

function build(filename) {
  return {
    input: [`${JS_SRC}/${filename}.js`],
    output: {
      file: `${JS_DIST}/${filename}.min.js`,
      format: 'iife',
      name: 'Chirpy',
      sourcemap: !isProd
    },
    watch: {
      include: `${JS_SRC}/**`
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/env'],
        plugins: ['@babel/plugin-proposal-class-properties']
      }),
      license({
        banner: {
          commentStyle: 'ignored',
          content: { file: path.join(__dirname, JS_SRC, '_copyright') }
        }
      }),
      isProd && terser()
    ]
  };
}

var rollup_config = [
  build('commons'),
  build('home'),
  build('categories'),
  build('page'),
  build('post'),
  build('misc')
];

exports.default = rollup_config;
