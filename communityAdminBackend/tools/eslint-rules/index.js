'use strict';

module.exports = {
  rules: {
    'prefer-arrow-functions': require('./prefer-arrow-functions'),
    'newline-after-import-section': require('./newline-after-import-section'),
    'no-restricted-imports': require('./no-restricted-imports'),
    'no-restricted-assignments': require('./no-restricted-assignments')
  },
  rulesConfig: {
    'prefer-arrow-functions': [2],
    'newline-after-import-section': [2],
    'no-restricted-imports': [2],
    'no-restricted-assignments': [2]
  }
};
