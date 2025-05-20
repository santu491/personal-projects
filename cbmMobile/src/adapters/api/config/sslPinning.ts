/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Buffer } from 'buffer';
import { parse as parseUrl } from 'url';

import { disableSslPinning, initializeSslPinning, PinningOptions } from 'react-native-ssl-public-key-pinning';

import { Environment } from '../../../models/environments';
import { certs as defaultCerts } from './certs';
import { carelonServiceConfig } from './serviceConfig';

export const setUpPinning = async (environment: Environment): Promise<void> => {
  const serviceConfig = carelonServiceConfig[environment];
  if (!serviceConfig) {
    throw new Error(`Service configuration for environment ${environment} not found`);
  }
  const { sslPinningDisabled, baseUrl } = serviceConfig;
  const { hostname } = parseUrl(baseUrl);
  if (!hostname) {
    throw new Error(`‼️ failed to parse url ${baseUrl}`);
  }
  const certs = defaultCerts[hostname];
  if (!certs) {
    throw new Error(`Certificates for hostname ${hostname} not found`);
  }

  const pinningOptions = { [hostname]: certs };
  await (sslPinningDisabled ? disableSslPinning() : initializeSslPinning(ensureMultipleCerts(pinningOptions)));
};

function ensureMultipleCerts(certs: PinningOptions): PinningOptions {
  return Object.fromEntries(
    Object.entries(certs).map(([key, value]) => [
      key,
      {
        ...value,
        publicKeyHashes:
          new Set(value.publicKeyHashes).size > 1
            ? value.publicKeyHashes
            : [...value.publicKeyHashes, ...new Array(2).fill(undefined).map(randomCert)],
      },
    ])
  );
}

function randomCert(): string {
  return Buffer.from(global.crypto.getRandomValues(new Uint8Array(32))).toString('base64');
}
