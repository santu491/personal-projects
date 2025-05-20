export enum Environment {
  DEV1 = 'dev1',
  PROD = 'prod',
  SIT1 = 'sit1',
  UAT1 = 'uat1',
}

const evironmentValues = Object.values<string>(Environment);
export function isEnvironment(environment: string): environment is Environment {
  return evironmentValues.includes(environment);
}
