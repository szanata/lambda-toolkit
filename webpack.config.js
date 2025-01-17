const { resolve } = require( 'path' );

const distFolder = resolve( __dirname, 'dist' );

const commonConfig = {
  context: __dirname,
  mode: 'production',
  optimization: { minimize: false },
  entry: {
    'index.js': './src/index.js'
  },
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
      filename: '[name]/index.mjs',
      library: {
        type: 'module'
      },
      clean: true
    },
    experiments: {
      outputModule: true
    }
  } ),
  // cjs
  Object.assign( {}, commonConfig, {
    output: {
      path: distFolder,
      filename: '[name]/index.cjs',
      libraryTarget: 'commonjs2',
      clean: true
    }
  } )
];