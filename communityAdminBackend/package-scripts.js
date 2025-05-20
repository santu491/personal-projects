/**
 * Windows: Please do not use trailing comma as windows will fail with token error
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { series, crossEnv, concurrent, rimraf, runInNewWindow } = require('nps-utils');
// const { execSync } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const args = require('yargs').argv;

process.env.npm_config_file = args.file || process.env.npm_config_file || '';
process.env.npm_config_folder = args.folder || process.env.npm_config_folder || '';
process.env.npm_config_app = args.app || process.env.npm_config_app || 'adminresources';
process.env.npm_config_env = args.env || process.env.npm_config_env || 'default';
process.env.npm_config_httpsPort = args.httpsPort || process.env.npm_config_httpsPort || '';
process.env.npm_config_httpPort = args.httpPort || process.env.npm_config_httpPort || '';
process.env.npm_config_debug = args.debug || process.env.npm_config_debug || args.cdebug || process.env.npm_config_cdebug || '';
process.env.npm_config_coverage = args.coverage || process.env.npm_config_coverage || 'true';
process.env.npm_config_fast = args.fast || process.env.npm_config_fast || args.cfast || process.env.npm_config_cfast || 'false';
process.env.npm_config_planId = args.planId || process.env.npm_config_planId;
process.env.npm_config_username = args.username || process.env.npm_config_username;
process.env.npm_config_password = args.password || process.env.npm_config_password;
const pkgName = args.pkgName || process.env.npm_config_pkgName || '@anthem/communityadminapi';
const npmTag = args.npmTag || process.env.npm_config_npmTag || 'develop';
const npmVer = args.npmVer || process.env.npm_config_npmVer || '1.0.0';
const npmPublish = args.npmPublish || process.env.npm_config_npmPublish || '';
const artifactory = args.artifactory || process.env.npm_config_artifactory || '';
process.env.npm_config_sha1 = args.sha1 || process.env.npm_config_sha1 || '';
process.env.npm_config_sha2 = args.sha2 || process.env.npm_config_sha2 || '';
process.env.npm_config_ci = args.ci || process.env.npm_config_ci || '';
process.env.npm_config_controller = args.controller || process.env.npm_config_controller || '';
process.env.npm_config_image = args.image || process.env.npm_config_image || '';
process.env.npm_config_file1 = args.file1 || process.env.npm_config_file1 || '';
process.env.npm_config_svcs = args.svcs || process.env.npm_config_svcs || '';
process.env.npm_config_islocal = args.isLocal || process.env.npm_config_islocal || 'false';

function run(path) {
  return `"node_modules/.bin/ts-node" ${path}`;
}

function runFast(path) {
  return run(`${path}`);
}
function banner(name) {
  return {
    hiddenFromHelp: true,
    silent: true,
    description: `Shows ${name} banners to the console`,
    script: runFast(`./tools/commands/banner.ts ${name}`)
  };
}

function copy(source, target) {
  return `"node_modules/.bin/copyup" ${source} ${target}`;
}

function tslint() {
  return `"node_modules/.bin/tslint" -p ./tsconfig.json -c ./tslint.json "libs/**/*.ts" "app/${process.env.npm_config_app ? process.env.npm_config_app + '/' : ''}**/*.ts" "api/${
    process.env.npm_config_app ? process.env.npm_config_app + '/' : ''
  }**/*.ts" "api/virtual-${process.env.npm_config_app ? process.env.npm_config_app + '/' : ''}**/*.ts" --format stylish`;
}

function eslint() {
  return `"node_modules/.bin/eslint" "libs/**/*.ts" "app/${process.env.npm_config_app ? process.env.npm_config_app + '/' : ''}**/*.ts" "api/${
    process.env.npm_config_app ? process.env.npm_config_app + '/' : ''
  }**/*.ts" "api/virtual-${process.env.npm_config_app ? process.env.npm_config_app + '/' : ''}**/*.ts"`;
}

function jest(file, folder) {
  return '"node_modules/.bin/jest" --testPathPattern=src --coverage';
}

function swagger() {
  process.env.npm_config_swagger = true;
  return 'nps banner.swagger';
}

module.exports = {
  scripts: {
    default: 'nps serve',
    'update-ca-probe': {
      script: `"node_modules/.bin/ts-node" --project ./tsconfig.tools.json ./tools/commands/update-ca-probe.ts --caProbPath=${process.env.npm_config_caProbPath}`,
      description: 'update ca-apm-probe config.json'
    },
    bamboo: {
      script: series('"node_modules/.bin/ts-node" --project ./tsconfig.tools.json ./tools/bamboo/trigger.ts'),
      description: 'Trigger bamboo plan'
    },
    deps: {
      script: series('"node_modules/.bin/ts-node" --project ./tsconfig.tools.json ./tools/deps/affected.ts'),
      description: 'Identify affected app by commits'
    },
    /**
     * Serves the current app and watches for changes to restart it
     */
    serve: {
      script: series(
        'nps banner.serve',
        `nodemon --exec node --experimental-worker --inspect -r tsconfig-paths/register -r ts-node/register/transpile-only ./app/${process.env.npm_config_app}/main.ts --watch app/${process.env.npm_config_app} --watch libs --watch api/${process.env.npm_config_app} --watch api/virtual-${process.env.npm_config_app} `
      ),
      description: 'Serves the current app and watches for changes to restart it'
    },
    /**
     * swagger generation
     */
    swagger: {
      script: series(swagger(), `node --inspect -r tsconfig-paths/register -r ts-node/register/transpile-only ./app/${process.env.npm_config_app}/swaggerMain.ts `),
      description: 'swagger generation'
    },
    /**
     * Builds the app into the dist directory
     */
    build: {
      script: series(
        'nps banner.build',
        // 'nps copy.config',
        runFast(`--transpile-only ./tools/commands/build-presetup.ts --app=${process.env.npm_config_app} `),
        'nps lint',
        'nps swagger',
        'nps clean.dist',
        'nps transpile',
        'nps copy.build',
        'nps copy.buildkeytools',
        'nps copy.buildfiles',
        'nps copy.dbScripts',
        'nps copy.tools',
        'nps copy.swaggers',
        runFast(`--transpile-only ./tools/commands/build-postsetup.ts --app=${process.env.npm_config_app}`)
      ),
      description: 'Builds the app into the dist directory'
    },
    test: {
      script: series(
        `${process.env.npm_config_fast === 'true' ? '' : 'nps lint'}`,
        `node --experimental-worker ${process.env.npm_config_debug ? '--inspect' : ''} \"./node_modules/jest/bin/jest.js\" --runInBand=${process.env.npm_config_debug ? 'true' : 'false'} ${
          process.env.npm_config_coverage === 'true' && process.env.npm_config_fast !== 'true' ? '--coverage' : ''
        } --watch=${process.env.npm_config_debug ? 'true' : 'false'} --ci=${process.env.npm_config_ci ? 'true' : 'false'}`
      ),
      watch: {
        script: 'jest --watch'
      }
    },
    /**
     * Runs TSLint over your project
     */
    lint: {
      default: {
        script: series('nps lint.ts', 'nps lint.path'),
        hiddenFromHelp: true
      },
      ts: {
        script: eslint(),
        hiddenFromHelp: true
      },
      path: {
        script: '"node_modules/.bin/path-linter" --config pathlinter.json',
        hiddenFromHelp: true
      }
    },
    package: {
      script: series('nps clean.dist', 'nps transpile.package', 'nps copy.package', npmPublish ? 'nps npmPublish' : '')
    },
    awsTemplate: {
      script: series(runFast(`--transpile-only ./tools/commands/build-aws-templates.ts --file=${process.env.npm_config_file} --app=${process.env.npm_config_app}`))
    },
    awsImage: {
      script: series(
        runFast(
          `--transpile-only ./tools/commands/build-aws-image.ts --file=${process.env.npm_config_file} --app=${process.env.npm_config_app} --image=${process.env.npm_config_image} --file1=${process.env.npm_config_file1} --svcs="${process.env.npm_config_svcs}"`
        )
      )
    },
    /**
     * Transpile your app into javascript
     */
    transpile: {
      default: {
        script: '"node_modules/.bin/tsc" --project ./tsconfig.build.json',
        hiddenFromHelp: true
      },
      package: {
        script: '"node_modules/.bin/tsc" --project ./tsconfig.libs.json',
        hiddenFromHelp: true
      }
    },
    npmPublish: {
      script: series(
        `"node_modules/.bin/ts-node" --project ./tsconfig.tools.json ./tools/commands/run-npm-publish.ts --cwd=./dist --pkgName=${pkgName || ''} --npmTag=${npmTag || ''} --npmVer=${
          npmVer || ''
        } --artifactory=${artifactory || ''}`
      ),
      description: 'Trigger bamboo plan'
    },
    /**
     * Clean files and folders
     */
    clean: {
      default: {
        script: series('nps banner.clean', 'nps clean.dist'),
        description: 'Deletes the ./dist folder'
      },
      dist: {
        script: rimraf('./dist'),
        hiddenFromHelp: true
      }
    },
    /**
     * Copies static files to the build folder
     */
    copy: {
      config: {
        script: `"node_modules/.bin/cpy" ./app/${process.env.npm_config_app}/config/config.${process.env.npm_config_env || 'local'}.json --rename=config.json ./app/${process.env.npm_config_app}/config`,
        hiddenFromHelp: true
      },
      build: {
        script: `"node_modules/.bin/cpy" ./app/${process.env.npm_config_app}/config/*.json ./dist/`,
        hiddenFromHelp: true
      },
      buildkeytools: {
        script: '"node_modules/.bin/copyfiles" ./libs/security/keystore/**/* ./libs/**/*.pem ./dist',
        hiddenFromHelp: true
      },
      dbScripts: {
        script: '"node_modules/.bin/copyfiles" ./db-scripts/*.js ./dist',
        hiddenFromHelp: true
      },
      buildfiles: {
        script: `"node_modules/.bin/copyfiles" -a ./package.json ./package-lock.json ./process.yml ./process_caapm.yml ./cert.pem ./key.pem -f ./app/${process.env.npm_config_app}/docker/app/docker-entrypoint.sh -f ./dist/`,
        hiddenFromHelp: true
      },
      package: {
        script: '"node_modules/.bin/copyfiles" -u 1 "./libs/**/package.json" "./dist/"',
        hiddenFromHelp: true
      },
      tools: {
        script: '"node_modules/.bin/copyfiles" -u 1 "./tools/**/*.*" "./dist/tools/"',
        hiddenFromHelp: true
      },
      swaggers: {
        script: `"node_modules/.bin/copyfiles" -u 1 "./api/${process.env.npm_config_app}/swagger/*.json" "./dist/api/"`,
        hiddenFromHelp: true
      }
    },
    /**
     * This creates pretty banner to the terminal
     */
    banner: {
      build: banner('build'),
      serve: banner('serve'),
      testUnit: banner('test.unit'),
      clean: banner('clean'),
      swagger: banner('swagger')
    }
  }
};
