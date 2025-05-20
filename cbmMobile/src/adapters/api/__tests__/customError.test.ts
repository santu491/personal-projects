import { CustomError } from '../customError';

describe('CustomError', () => {
  it('should create an instance of CustomError with the correct properties', () => {
    const status = 404;
    const error = 'Not Found';
    const customError = new CustomError({ status, error });

    expect(customError).toBeInstanceOf(CustomError);
    expect(customError.status).toBe(status);
    expect(customError.error).toBe(error);
  });

  it('should have a default message property inherited from Error', () => {
    const status = 500;
    const error = 'Internal Server Error';
    const customError = new CustomError({ status, error });

    expect(customError.message).toBe('');
  });

  it('should set the name property to "Error"', () => {
    const status = 400;
    const error = 'Bad Request';
    const customError = new CustomError({ status, error });

    expect(customError.name).toBe('Error');
  });

  it('should handle non-string error values', () => {
    const status = 401;
    const error = { message: 'Unauthorized' };
    const customError = new CustomError({ status, error });

    expect(customError.error).toEqual(error);
  });
});
