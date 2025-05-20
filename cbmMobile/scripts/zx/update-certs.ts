#!/usr/bin/env -S npx tsx

import 'zx/globals';

import { fileURLToPath, parse as parseUrl } from 'url';

import { ServiceConfig } from './serviceConfig';
import { spinner } from './spinners';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appPath = path.resolve(__dirname, '../../src');

const AKAMAI_STAGING_DOMAIN_SUFFIX = '.edgekey-staging.net';

const serviceConfigsOutput =
  await $`npx ts-node -O '{"isolatedModules": false}' -e 'import { carelonServiceConfig } from "./src/adapters/api/config/serviceConfig"; console.log(JSON.stringify({ carelonServiceConfig }));'`;

type ServiceConfigs = Record<string, ServiceConfig>;

const serviceConfigs = JSON.parse(serviceConfigsOutput.stdout) as {
  carelonServiceConfig: ServiceConfigs;
};

console.log(serviceConfigs);

async function fetchCert(folder: string, connect: string, servername: string = connect) {
  const tmpFile = `${folder}/${connect}.pem`;
  await spinner(
    `connecting to ${connect}...`,
    () => $`echo "" | openssl s_client -connect ${connect}:443 -servername ${servername} | openssl x509 > ${tmpFile}`
  );

  const sha256 = (
    await $`openssl x509 -pubkey -inform pem -in ${tmpFile} \\
    | openssl rsa -pubin -outform der \\
    | openssl dgst -sha256 -binary \\
    | openssl enc -base64`
  ).stdout.replace(/^\s+|\s+$/gm, '');

  console.log(`✅ fetched cert for ${connect}: ${sha256}`);
  return {
    sha256,
  };
}

interface DomainOptions {
  /**
   * Whether all subdomains of the specified domain should also be pinned.
   * @default false
   */
  includeSubdomains?: boolean;
  /**
   * An array of SSL pins, where each pin is the base64-encoded SHA-256 hash of a certificate's Subject Public Key Info.
   * Note that at least two pins are needed per domain on iOS.
   */
  publicKeyHashes: string[];
}

type PinningOptions = Record<string, DomainOptions>;

const certs: PinningOptions = {};

const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'carelon-certs-'));
console.log(`using tmp dir ${folder}`);

const prodUrls = new Set<string>();
const allUrls = new Set<string>();
Object.entries(serviceConfigs).forEach(([, envConfigs]) => {
  Object.entries(envConfigs).forEach(([env, serviceConfig]) => {
    if (env.includes('PROD')) {
      prodUrls.add(serviceConfig.baseUrl);
    }
    if (env !== 'LOCAL') {
      allUrls.add(serviceConfig.baseUrl);
    }
  });
});

try {
  await Promise.all(
    [...allUrls].map(async (baseUrl) => {
      console.log(`processing cert for`, baseUrl);

      const { hostname } = parseUrl(baseUrl);
      if (!hostname) {
        throw new Error(`‼️ failed to parse url ${baseUrl}`);
      }

      certs[hostname] = { publicKeyHashes: [] };

      try {
        // download cert for domain
        const { sha256 } = await fetchCert(folder, hostname);
        certs[hostname].publicKeyHashes.push(sha256);
      } catch (err) {
        console.error(`‼️ failed to process cert for ${hostname}`, err);
        return;
      }

      try {
        if (prodUrls.has(baseUrl)) {
          // then download from akamai staging as well
          const { sha256 } = await fetchCert(folder, `${hostname}${AKAMAI_STAGING_DOMAIN_SUFFIX}`, hostname);

          if (certs[hostname].publicKeyHashes.includes(sha256)) {
            console.warn(`Akamai staging cert same as prod for ${hostname}, skipping duplicate`);
            return;
          }

          certs[hostname].publicKeyHashes.push(sha256);
        }
      } catch (err) {
        console.error(`⚠️ failed to process Akamai cert for ${hostname}`, err);
      }
    })
  );
} finally {
  await $`rm -rf ${folder}`;
}

const orderedCerts = Object.keys(certs)
  .sort()
  .reduce<PinningOptions>((obj, key) => {
    obj[key] = certs[key];
    return obj;
  }, {});

console.log(`saving certs data`, orderedCerts);

const template = `// DO NOT MODIFY, THIS FILE IS GENERATED AUTOMATICALLY
// USE updateCerts.ts TO UPDATE THIS FILE
import { PinningOptions } from 'react-native-ssl-public-key-pinning';
export const certs: PinningOptions = ${JSON.stringify(orderedCerts, undefined, 2)};`;

fs.writeFileSync(path.join(appPath, 'adapters/api/config/certs.ts'), template);
await $`yarn prettier --write ${appPath}/adapters/api/config/certs.ts`;
console.log(`✅ certs updated, commit changes and any new cert files added`);
