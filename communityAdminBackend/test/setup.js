"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@anthem/communityadminapi/utils");
require("reflect-metadata");
let config = '';
if (!utils_1.APP.origConfig) {
    for (let index = 0; index < 10; index++) {
        const element = process.env[`npm_config_appConfig${index}`];
        if (element) {
            config += element;
        }
        else {
            break;
        }
    }
    utils_1.APP.origConfig = config;
}
utils_1.APP.config = JSON.parse(utils_1.APP.origConfig);
//APP.config = JSON.parse(process.env.npm_config_appConfig);
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise rejection:', error);
    process.exit(1);
});
//# sourceMappingURL=setup.js.map