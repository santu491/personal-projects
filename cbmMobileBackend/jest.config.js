module.exports = {
  watch: false,
  verbose: true,
  preset: 'ts-jest',
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        outputPath: './reports/test-report.html',
        pageTitle: 'Carelon Behaviour Health',
        includeFailureMsg: true,
        expand: true,
        openReport: true,
      },
    ],
  ],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testResultsProcessor: 'jest-sonar-reporter',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testPathIgnorePatterns: ['.git/.*', 'node_modules/.*'],
  transformIgnorePatterns: ['node_modules/.*', 'dist/.*', '.*\\.js'],
  testEnvironment: 'node',
  coverageDirectory: './log',
  cacheDirectory: '<rootDir>/.cache/',
  modulePaths: ['<rootDir>'],
  testRegex: '\\.spec\\.(ts|tsx|js)$',
};
