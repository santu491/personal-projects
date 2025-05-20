"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("@anthem/communityapi/utils");
require("reflect-metadata");
let config = '';
if (!utils.APP.origConfig) {
    for (let index = 0; index < 10; index++) {
        const element = process.env[`npm_config_appConfig${index}`];
        if (element) {
            config += element;
        }
        else {
            break;
        }
    }
    utils.APP.origConfig = config;
}
utils.APP.config = JSON.parse(utils.APP.origConfig);
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise rejection:', error);
    process.exit(1);
});
//# sourceMappingURL=setup.js.map
