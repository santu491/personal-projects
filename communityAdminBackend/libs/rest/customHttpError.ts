import { generateErrorSerial } from '@anthem/communityadminapi/utils';

export function getErrorMessage(errorCode: string): { code: string; serial: string } {
  try {
    return {
      code: errorCode,
      serial: generateErrorSerial()
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`CustomHttpError: ${error.message || error.stack}`);
  }

  return {
    code: 'unknown',
    serial: 'unknown'
  };
}
