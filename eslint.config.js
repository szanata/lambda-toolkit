const js = require( '@eslint/js' );
const globals = require( 'globals' );
const importPlugin = require( 'eslint-plugin-import' );

module.exports = [
  {
    ignores: [
      'dist/**',
      '**/coverage/**',
      'coverage/**'
    ]
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'commonjs'
      },
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      'array-bracket-spacing': [ 'error', 'always' ],
      'arrow-parens': [ 'error', 'as-needed' ],
      'arrow-spacing': [ 'error', { before: true, after: true } ],
      'block-spacing': [ 'error', 'always' ],
      'brace-style': [ 'error', '1tbs', { allowSingleLine: true } ],
      camelcase: [ 'error', { properties: 'never' } ],
      'comma-dangle': [ 'error', 'never' ],
      'comma-spacing': [ 'error' ],
      'computed-property-spacing': [ 'error', 'never' ],
      'consistent-return': [ 'error', { treatUndefinedAsUnspecified: true } ],
      curly: [ 'error' ],
      eqeqeq: [ 'error' ],
      'eol-last': [ 'error', 'always' ],
      'func-call-spacing': [ 'error', 'never' ],
      'func-names': 0,
      'generator-star-spacing': [ 'error', { before: true, after: false } ],
      'global-require': [ 'error' ],
      'init-declarations': [ 'error', 'always' ],
      indent: [ 'error', 2 ],
      'key-spacing': [ 'error', { afterColon: true } ],
      'keyword-spacing': [ 'error' ],
      'max-len': [ 'error', 150 ],
      'no-bitwise': [ 'error', { int32Hint: true } ],
      'no-buffer-constructor': [ 'error' ],
      'no-console': 0,
      'no-mixed-operators': [ 'error' ],
      'no-multiple-empty-lines': [ 'error', { max: 1, maxEOF: 1 } ],
      'no-multi-spaces': [ 'error' ],
      'no-nested-ternary': [ 'error' ],
      'no-param-reassign': [ 'error' ],
      'no-plusplus': 0,
      'no-regex-spaces': [ 'error' ],
      'no-restricted-syntax': [
        'error',
        'DebuggerStatement',
        'Eval',
        'ForInStatement',
        'LabeledStatement',
        'WithStatement'
      ],
      'no-return-await': [ 'error' ],
      'no-template-curly-in-string': 0,
      'no-trailing-spaces': [ 'error' ],
      'no-underscore-dangle': 0,
      'no-unused-expressions': [ 'error' ],
      'no-unused-vars': [ 'error', { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', ignoreRestSiblings: true } ],
      'no-use-before-define': [ 'error' ],
      'no-useless-catch': 0,
      'no-useless-constructor': 1,
      'no-var': [ 'error' ],
      'object-curly-newline': [ 'error', { consistent: true, multiline: true } ],
      'object-curly-spacing': [ 'error', 'always' ],
      'object-shorthand': [ 'error' ],
      'operator-linebreak': [ 'error', 'after' ],
      'prefer-const': [ 'error' ],
      quotes: [ 'error', 'single' ],
      'quote-props': [ 'error', 'as-needed' ],
      'require-atomic-updates': 0,
      semi: [ 'error', 'always' ],
      'space-before-blocks': [ 'error' ],
      'space-before-function-paren': [ 'error', { anonymous: 'always', named: 'never', asyncArrow: 'always' } ],
      'space-in-parens': [ 'error', 'always', { exceptions: [ 'empty' ] } ],
      'space-infix-ops': [ 'error' ],
      'space-unary-ops': [ 'error', { words: true, nonwords: false } ]
    }
  }
];
