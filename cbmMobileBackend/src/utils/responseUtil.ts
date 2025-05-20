import {APIResponseCodes, Messages} from '../constants';
import {ServiceResponse} from '../types/eapMemberProfileModel';

export class ResponseUtil {
  public createSuccess(
    value: string | unknown,
    statusCode: number = APIResponseCodes.SUCCESS,
  ): ServiceResponse {
    const resultSuccess = {
      data: value,
      statusCode,
    };

    return resultSuccess;
  }

  public createException(
    exception: unknown,
    statusCode: number = APIResponseCodes.INTERNAL_SERVER_ERROR,
    message: string = Messages.somethingWentWrong,
  ): ServiceResponse {
    if (typeof exception !== 'string') {
      exception = this.handleError(exception, message);
    }
    const resultException = {
      errors: this.createErrorObject(exception),
      statusCode,
    };

    return resultException;
  }

  /* public createError(
    errorInfo: unknown,
    statusCode: number = APIResponseCodes.BAD_REQUEST,
  ) {
    const resultError = {
      data: {
        isSuccess: false,
        isException: false,
        errors: createErrorObject(errorInfo),
        statusCode,
      },
    };

    return resultError;
  }

  public createErrorMessage(errorMessage: string): ServiceResponse {
    const resultError: ServiceResponse = {
      data: {
        isSuccess: false,
        isException: false,
        message: errorMessage,
      },
    };
    return resultError;
  } */

  public createErrorObject(error: any) {
    try {
      if (typeof error === 'string') {
        return [{message: error}];
      } else if (Array.isArray(error)) {
        return error;
      } else if (typeof error === 'object') {
        return [error];
      }
    } catch (e) {
      return [{message: Messages.somethingWentWrong}];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleError = (error: any, message: string) => {
    return (
      error?.response?.data?.exceptions ??
      error?.response?.data?.errors ??
      error?.response?.data ??
      error?.message ??
      error ??
      message
    );
  };
}

export const RESPONSE = {
  '200': {
    description: 'Success',
  },
  '400': {
    description: 'Bad Request',
  },
  '401': {
    description: 'Unauthorized',
  },
  '500': {
    description: 'Internal Server Error',
  },
  '502': {
    description: 'Bad Gateway',
  },
  '503': {
    description: 'Service Unavailable',
  },
  '504': {
    description: 'Gateway Timeout',
  },
};
