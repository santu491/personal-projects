import { disableSslPinning, initializeSslPinning } from 'react-native-ssl-public-key-pinning';

import { Environment } from '../../../../models/environments';
import { setUpPinning } from '../sslPinning';

jest.mock('../serviceConfig', () => ({
  carelonServiceConfig: {
    dev1: { baseUrl: 'https://dev.example.com', sslPinningDisabled: false },
    prod: { baseUrl: 'https://prod.example.com', sslPinningDisabled: true },
  },
}));

jest.mock('../certs', () => ({
  certs: {
    'dev.example.com': { publicKeyHashes: ['hash1', 'hash2'] },
    'prod.example.com': { publicKeyHashes: ['hash3'] },
  },
}));

describe('setUpPinning', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize SSL pinning for environment with SSL pinning enabled', async () => {
    await setUpPinning('dev1' as Environment);
    expect(initializeSslPinning).toHaveBeenCalled();
    expect(disableSslPinning).not.toHaveBeenCalled();
  });

  it('should disable SSL pinning for environment with SSL pinning disabled', async () => {
    await setUpPinning('prod' as Environment);
    expect(disableSslPinning).toHaveBeenCalled();
    expect(initializeSslPinning).not.toHaveBeenCalled();
  });
});
