const { resolve } = require( 'path' );
const { execSync } = require( 'node:child_process' );

const distFolder = resolve( __dirname, 'dist' );

execSync( `rm -rf ${distFolder}` );

module.exports = {
  context: __dirname,
  mode: 'production',
  optimization: { minimize: false },
  entry: './src/index.js',
  target: 'node',
  output: {
    path: distFolder,
    filename: 'index.js',
    library: {
      type: 'commonjs2'
    }
  },
  experiments: {
    outputModule: true
  },
  externals: [
    /@aws-sdk\/*/
  ]
};
