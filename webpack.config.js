import { resolve } from 'node:path';
import { rmSync } from 'node:fs';

const __dirname = import.meta.dirname;
const distFolder = resolve( __dirname, 'dist' );

rmSync( distFolder, { recursive: true, force: true } );

const config = {
  context: __dirname,
  mode: 'production',
  optimization: { minimize: false },
  entry: './src/index.js',
  target: 'node',
  externals: [
    /@aws-sdk\/*/
  ]
};

export default [
  {
    ...config,
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
  },
  {
    ...config,
    output: {
      path: distFolder,
      filename: 'index.cjs',
      library: {
        type: 'commonjs2'
      }
    }
  }
];
