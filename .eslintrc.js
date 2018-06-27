module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
    webextensions: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
  ],
  globals: {
    $: false,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'babel',
    'jsx-a11y',
    'react',
  ],
  rules: {
    'babel/new-cap': [
      2,
      {
        capIsNewExceptions: [
          'List',
          'Map',
        ],
      },
    ],
    'babel/no-invalid-this': 1,
    'babel/semi': 1,
    'babel/no-unused-expressions': 1,
    'import/namespace': [
      2,
      {
        allowComputed: true,
      },
    ],
    'jsx-a11y/label-has-for': [
      2,
      {
        allowChildren: true,
      },
    ],
  },
  settings: {
    'import/resolver': 'webpack',
  },
};
