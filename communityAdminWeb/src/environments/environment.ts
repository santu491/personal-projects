// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  value: 'dev'
};

// Environments
export const env = {
  dev: "https://dev.admin.sydney-community.com",
  sit: "https://sit.admin.sydney-community.com",
  uat: "https://uat.admin.sydney-community.com",
  perf: "https://perf.admin.sydney-community.com",
  prod_internal: "https://prod.admin.sydney-community.com",
  prod: "https://admin.sydney-community.com",
  dr: "https://dr-admin.sydney-community.com",
};

// Selected Environment
export const baseURL = env.dev;

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 * // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
 */
