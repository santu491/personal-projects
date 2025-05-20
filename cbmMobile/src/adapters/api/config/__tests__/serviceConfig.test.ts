import { Environment } from '../../../../models/environments';
import { carelonServiceConfig, CarlonEnvironment } from '../serviceConfig';

describe('carelonServiceConfig', () => {
  it('should have correct configuration for DEV1 environment', () => {
    const config = carelonServiceConfig[Environment.DEV1 as CarlonEnvironment];
    expect(config).toEqual({
      baseUrl: 'https://dev1.api.mobile.carelon.com/',
      sslPinningDisabled: true,
    });
  });

  it('should have correct configuration for PROD environment', () => {
    const config = carelonServiceConfig[Environment.PROD as CarlonEnvironment];
    expect(config).toEqual({
      baseUrl: 'https://api.mobile.carelonbehavioralhealth.com/',
      sslPinningDisabled: false,
    });
  });

  it('should have correct configuration for SIT1 environment', () => {
    const config = carelonServiceConfig[Environment.SIT1 as CarlonEnvironment];
    expect(config).toEqual({
      baseUrl: 'https://sit1.api.mobile.carelon.com/',
      sslPinningDisabled: true,
    });
  });

  it('should have correct configuration for UAT1 environment', () => {
    const config = carelonServiceConfig[Environment.UAT1 as CarlonEnvironment];
    expect(config).toEqual({
      baseUrl: 'https://uat1.api.mobile.carelon.com/',
      sslPinningDisabled: true,
    });
  });
});
