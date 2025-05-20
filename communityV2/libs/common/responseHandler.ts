import {
  BaseResponse,
  ErrorModel
} from 'api/communityresources/models/resultModel';
import { API_RESPONSE } from './constants';

export class Result {
  errorInfo: ErrorModel = {
    id: this.createGuid(),
    errorCode: API_RESPONSE.statusCodes[400],
    title: API_RESPONSE.messages.invalidIdTitle,
    detail: API_RESPONSE.messages.invalidIdDetail
  };

  public createSuccess(value): BaseResponse {
    const resultSuccess = {
      data: {
        isSuccess: true,
        isException: false,
        value: value
      }
    };

    return resultSuccess;
  }

  public createException(exception): BaseResponse {
    const resultException = {
      data: {
        isSuccess: false,
        isException: true,
        exception: exception
      }
    };

    return resultException;
  }

  public createError(errorInfo): BaseResponse {
    const resultError = {
      data: {
        isSuccess: false,
        isException: false,
        errors: errorInfo
      }
    };

    return resultError;
  }

  public createErrorMessage(errorMessage: string): BaseResponse {
    const resultError = {
      data: {
        isSuccess: false,
        isException: false,
        Message: errorMessage
      }
    };
    return resultError;
  }

  public createExceptionWithValue(errorMessage: string, value): BaseResponse {
    const resultError = {
      data: {
        isSuccess: false,
        isException: true,
        message: errorMessage,
        value: value
      }
    };
    return resultError;
  }

  public createGuid(): string {
    // Generates Guid
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }
}
