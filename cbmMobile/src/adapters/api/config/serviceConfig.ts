import { ServiceConfig } from '../../../../scripts/zx/serviceConfig';
import { Environment } from '../../../models/environments';

export type CarlonEnvironment = Environment.DEV1 | Environment.SIT1 | Environment.UAT1 | Environment.PROD;
export const carelonServiceConfig: Record<CarlonEnvironment, Omit<ServiceConfig, 'headers'>> = {
  [Environment.DEV1]: {
    baseUrl: 'https://dev1.api.mobile.carelon.com/',
    sslPinningDisabled: true,
  },
  [Environment.PROD]: {
    baseUrl: 'https://api.mobile.carelonbehavioralhealth.com/',
    sslPinningDisabled: false,
  },
  [Environment.SIT1]: {
    baseUrl: 'https://sit1.api.mobile.carelon.com/',
    sslPinningDisabled: true,
  },
  [Environment.UAT1]: {
    baseUrl: 'https://uat1.api.mobile.carelon.com/',
    sslPinningDisabled: true,
  },
};
