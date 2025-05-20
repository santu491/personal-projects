const conArgs = {
  specFile: (process.env.npm_config_file || '').replace('.spec.ts', '').replace('.spec.js', ''),
  specFolder: process.env.npm_config_folder || '',
  app: process.env.npm_config_app || '',
  api: process.env.npm_config_api || '',
  debug: process.env.npm_config_debug || process.env.npm_config_cdebug || ''
};

console.log(JSON.stringify(conArgs));
let testRegex = '\\.spec\\.(ts|tsx|js)$';
const coverageArr = [
  '!app/**/*.ts',
  '!app/**/*.js',
  '!api/**/*.d.ts',
  '!libs/**/*.d.ts',
  '!**/types/*.ts',
  '!**/hapi/*.ts',
  '!**/mocks/*.ts',
  '!**/index.ts',
  '!**/enums/*.ts',
  '!**/interfaces/*.ts',
  '!**/decorators/*.ts',
  '!api/virtual-irx/**/*',
  '!**/demo/**/*.ts',
  '!**/demo-secure/**/*.ts',
  '!**/(bufferStream).ts',
  '!libs/loaders/**/*.ts',
  '!libs/bootstrap/**/*.ts'
];
const coverageReporters = ['json', 'lcov', 'clover'];
if (conArgs.specFile) {
  testRegex = `${conArgs.specFile}\\.spec\\.(ts|tsx|js)$`;
  coverageArr.push(`app/${conArgs.app}/**/${conArgs.specFile}.{ts,js}`);
  coverageArr.push(`api/${conArgs.app}/**/${conArgs.specFile}.{ts,js}`);
  coverageArr.push(`libs/**/${conArgs.specFile}.{ts,js}`);
  coverageReporters.push('text');
} else if (conArgs.specFolder) {
  testRegex = `(\\/|\\\\)${conArgs.specFolder}(\\/|\\\\).*\\.spec\\.(ts|tsx|js)$`;
  coverageArr.push(`app/**/${conArgs.specFolder}/**/*.ts,js}`);
  coverageArr.push(`api/**/${conArgs.specFolder}/**/*.{ts,js}`);
  coverageArr.push(`libs/**/${conArgs.specFolder}/**/*.{ts,js}`);
  coverageReporters.push('text');
} else if (conArgs.api) {
  testRegex = `(\\/|\\\\)(api\\/${conArgs.app}\\/${conArgs.api}|libs)(\\/|\\\\).*\\.spec\\.(ts|tsx|js)$`;
  coverageArr.push(`app/${conArgs.app}/**/*.{ts,js}`);
  coverageArr.push(`api/${conArgs.app}/${conArgs.api}/**/*.{ts,js}`);
  coverageArr.push('libs/**/*.{ts,js}');
} else if (conArgs.app) {
  testRegex = `(\\/|\\\\)(${conArgs.app}|libs)(\\/|\\\\).*\\.spec\\.(ts|tsx|js)$`;
  coverageArr.push(`app/${conArgs.app}/**/*.{ts,js}`);
  coverageArr.push(`api/${conArgs.app}/**/*.{ts,js}`);
  coverageArr.push('libs/**/*.{ts,js}');
} else {
  testRegex = '(\\/|\\\\)(api|libs)(\\/|\\\\).*\\.spec\\.(ts|tsx|js)$';
  coverageArr.push('app/**/*.{ts,js}');
  coverageArr.push('api/**/*.{ts,js}');
  coverageArr.push('libs/**/*.{ts,js}');
}

module.exports = {
  watch: true,
  verbose: false,
  transform: {
    //'.(ts|tsx)': '<rootDir>/test/preprocessor.js'
    '.(ts|tsx)': 'ts-jest'
  },
  testRegex: testRegex,
  reporters: [
    conArgs.debug ? 'default' : '<rootDir>/test/custom-reporter.js',
    [
      'jest-junit',
      {
        outputDirectory: './log',
        outputName: 'test-results.xml'
      }
    ]
  ],
  /*jestSonar: {
    reportPath: "./log/coverage",
    reportFile: "ut_report.xml"
  },*/
  testResultsProcessor: 'jest-sonar-reporter',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testPathIgnorePatterns: ['.git/.*', 'node_modules/.*'],
  transformIgnorePatterns: ['node_modules/.*', 'dist/.*', '.*\\.js'],
  testEnvironment: 'node',
  globalSetup: './test/globalSetup.js',
  setupFilesAfterEnv: ['./test/setup.ts'],
  coverageDirectory: './log',
  collectCoverageFrom: coverageArr,
  coverageReporters: coverageReporters,
  //testPathPattern: '(app|libs|api)',
  moduleNameMapper: {
    '^@anthem/communityapi/(.*)$': '<rootDir>/libs/$1',
    '^@/(.*)$': '<rootDir>/api/$1'
  },
  cacheDirectory: '<rootDir>/.cache/',
  modulePaths: [
    '<rootDir>'
  ]
};
