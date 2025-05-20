import { HttpError } from 'routing-controllers';
import { v4 as uuid } from 'uuid';
import { IAppException } from './interfaces/appException';

export class AppException {
  static throwException(httpErrorCode: number, errors: IAppException[]) {
    throw new HttpError(httpErrorCode, ({
      errors: errors,
      errorUid: uuid()
    } as unknown) as string);
  }

  static getException(httpErrorCode: number, errors: IAppException[]) {
    return new HttpError(httpErrorCode, ({
      errors: errors,
      errorUid: uuid()
    } as unknown) as string);
  }
}
