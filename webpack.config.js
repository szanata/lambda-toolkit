import { resolve } from 'node:path';

const __dirname = import.meta.dirname;
const distFolder = resolve( __dirname, 'dist' );

const config = {
  context: __dirname,
  mode: 'production',
  optimization: { minimize: false },
  entry: './src/index.mjs',
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
      },
      clean: true
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
      },
      clean: true
    }
  }
];
