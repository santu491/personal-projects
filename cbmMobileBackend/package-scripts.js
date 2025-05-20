/* eslint-disable @typescript-eslint/no-var-requires */
const args = require('yargs').argv;
const npsUtils = require('nps-utils');

process.env.npm_config_env =
  args.env || process.env.npm_config_env || process.env.env || 'common';

module.exports = {
  scripts: {
    /**
     * Builds the app into the dist directory
     */
    build: {
      script: npsUtils.series(
        `"node_modules/.bin/cpy" ./src/config/${process.env.npm_config_env}.config.json ./dist/config/`,
        `"node_modules/.bin/cpy" ./docker-entrypoint.sh ./dist/`,
        `"node_modules/.bin/cpy" ./src/config/common.config.json ./dist/config/`,
      ),
      description: 'Builds the app into the dist directory',
    },
  },
};
