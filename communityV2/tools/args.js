var args = require('yargs').argv;
process.env.npm_config_file = args.file || process.env.npm_config_file || '';
process.env.npm_config_folder = args.folder || process.env.npm_config_folder || '';
process.env.npm_config_env = args.env || process.env.npm_config_env || 'local';
process.env.npm_config_debug = (args.debug || process.env.npm_config_debug) ? 'true' : 'false';
process.env.npm_config_app = args.app || process.env.npm_config_app || 'irx';
process.env.npm_config_planId = args.planId || process.env.npm_config_planId;
process.env.npm_config_username = args.username || process.env.npm_config_username;
process.env.npm_config_password = args.password || process.env.npm_config_password;
console.log(process.env.npm_config_env)
