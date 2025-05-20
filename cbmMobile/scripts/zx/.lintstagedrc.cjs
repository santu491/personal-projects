const { isCI } = require('ci-info');

module.exports = {
  '*.ts': (files) => [
    `prettier ${isCI ? '--check' : '--write'} ${files.join(' ')}`,
    'tsc -p tsconfig.json --pretty --noEmit',
    `eslint ${isCI ? '' : '--fix'} ${files.join(' ')}`,
  ],
  '*.md': [`prettier ${isCI ? '--check' : '--write'}`],
};
