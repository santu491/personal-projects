const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset', ['@babel/preset-typescript', { allowDeclareFields: true }]],
  plugins: [
    'transform-inline-environment-variables',
    ['@babel/plugin-proposal-decorators', { version: '2023-05' }],
    '@babel/plugin-transform-class-static-block',
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        alias: {
          '@sydney/motif-components/src': path.resolve(__dirname, 'node_modules', '@sydney', 'motif-components', 'src'),
          '@sydney/motif-components-real': path.resolve(__dirname, 'node_modules', '@sydney', 'motif-components'),
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
