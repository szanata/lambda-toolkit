const { resolve } = require( 'path' );
const { execSync } = require('node:child_process');

const distFolder = resolve( __dirname, 'dist' );

execSync( `rm -rf ${distFolder}` );

const commonConfig = {
  context: __dirname,
  mode: 'production',
  optimization: { minimize: false },
  entry: './src/index.js',
  target: 'node',
  externals: [
    /@aws-sdk\/*/
  ]
};
module.exports = [
  // esm
  Object.assign( {}, commonConfig, {
    output: {
      path: distFolder,
      filename: 'index.mjs',
      library: {
        type: 'module'
      }
    },
    experiments: {
      outputModule: true
    }
  } ),
  // cjs
  Object.assign( {}, commonConfig, {
    output: {
      path: distFolder,
      filename: 'index.cjs',
      library: {
        type: 'commonjs2'
      }
    }
  } )
];
