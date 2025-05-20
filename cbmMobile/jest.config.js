const transformNodeModules = [
  '(jest-)?react-native',
  '@react-native(-community)?',
  '@react-native',
  '@react-native-community',
  '@react-native-picker',
  '@react-navigation',
  'react-native-keychain',
  'react-native-keyboard-aware-scroll-view',
  'react-native-modal',
  'react-native-permissions',
  'react-native-picker-select',
  'react-native-push-notification',
  'react-native-safe-area-context',
  'react-native-webview',
  'react-native-reanimated',
  'react-native-config',
  'react-native-date-picker',
  'react-native-elements',
  '@sydney/motif-components',
  'react-native-[a-z-]+',
  '@crediblemind/embeddable-react-native',
  'react-native-network-logger',
  'react-hook-form',
  '@react-navigation/bottom-tabs',
];
const reactNativeJestPreset = require('react-native/jest-preset');

module.exports = {
  preset: 'react-native',
  cacheDirectory: '.jest/cache',
  collectCoverage: true,
  globals: {
    __DEV__: true,
    __TEST__: true,
  },
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx', 'html'],
  coveragePathIgnorePatterns: [
    '__mocks__',
    '__tests__',
    '__fixtures__',
    'scripts',
    '.stories.ts*',
    '.mock.',
    'src/navigation/tabNavigator.tsx',
    'assets/*',
    '.sdkContext.tsx',
    'constants/*',
  ],
  setupFilesAfterEnv: ['./jest.setupAfter.js'],
  setupFiles: [
    ...reactNativeJestPreset.setupFiles,
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest.setup.js',
  ],
  modulePathIgnorePatterns: ['<rootDir>/.*/lib', '<rootDir>/.*/assests'],
  testPathIgnorePatterns: ['.git/.*', 'node_modules/.*'],
  transformIgnorePatterns: [`node_modules/(?!(${transformNodeModules.join('|')})/)`],
  testRegex: '(/__tests__/.*|(\\.|/)test)\\.tsx?$',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage',
        filename: 'jest_html_report.html',
        expand: false,
      },
    ],
  ],
  moduleNameMapper: {
    '\\.html$': '<rootDir>/src/__mocks__/mockHtml.js',
    '^react-native$': 'react-native',
  },
  transform: {
    ...reactNativeJestPreset.transform,
    '^.+\\.(js|ts|tsx|html)$': ['babel-jest'],
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        module: {
          type: 'commonjs',
          strict: true,
        },
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          transform: {
            decoratorVersion: '2022-03',
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  coverageReporters: ['text', 'html', 'json', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'shared/**/*.{js,jsx,ts,tsx}',
    'sdks/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/node_modules/',
    '!<rootDir>/__tests__/Context.tsx',
  ],
};
