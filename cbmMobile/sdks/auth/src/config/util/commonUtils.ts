import { dimensionCheck } from '../../../../../src/util/commonUtils';
import { HIGH_DPI_OFFSET, LOW_DPI_OFFSET } from '../constants/auth';

export const keyboardOffSet = () => {
  return dimensionCheck() ? LOW_DPI_OFFSET : HIGH_DPI_OFFSET;
};
export enum MfaOptions {
  EMAIL = 'Email',
  TEXT = 'Text',
  VOICE = 'Voice',
}

export const formatPhoneNumber = (phoneNumber: string | undefined) => {
  if (phoneNumber) {
    const countryCode = phoneNumber.slice(0, 2);
    const mainNumber = phoneNumber.slice(2);
    // Format the phone number
    const formattedMainNumber = mainNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    return `${countryCode} ${formattedMainNumber}`;
  }
  return '';
};
