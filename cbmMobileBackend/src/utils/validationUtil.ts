import {isHexadecimal} from 'class-validator';

export class ValidationUtil {
  public isNullOrEmpty(value: string) {
    return (
      value === undefined || value === null || value.match(/^ *$/) !== null
    );
  }

  public isValidString(value: string) {
    return /[a-zA-Z0-9]/.test(value) && !/[@%*#${}\/]/.test(value);
  }

  public isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  public isHexId(value: string) {
    return isHexadecimal(value) && value.length === 24;
  }
}
