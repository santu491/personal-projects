import {ResponseUtil} from '../responseUtil';

describe('ResponseUtil', () => {
  let responseUtil: ResponseUtil;
  beforeEach(() => {
    jest.clearAllMocks();
    responseUtil = new ResponseUtil();
  });

  describe('createSucess', () => {
    it('Should be able to create success response', () => {
      const response = responseUtil.createSuccess('success');
      expect(response.data).toEqual('success');
      expect(response.statusCode).toEqual(200);
    });
  });

  describe('createException', () => {
    it('Should be able to create exception response', () => {
      const response = responseUtil.createException('exception');
      expect(response.errors).toEqual([{message: 'exception'}]);
      expect(response.statusCode).toEqual(500);
    });

    it('Should be able to create exception response with error', () => {
      const response = responseUtil.createException({error: 'exception'});
      expect(response.errors).toEqual([{error: 'exception'}]);
      expect(response.statusCode).toEqual(500);
    });
  });

  describe('createErrorObject', () => {
    it('Should be able to create error object', () => {
      const error = responseUtil.createErrorObject('error');
      expect(error).toEqual([{message: 'error'}]);
    });

    it('Should be able to create error object with error', () => {
      const error = responseUtil.createErrorObject({error: 'error'});
      expect(error).toEqual([{error: 'error'}]);
    });

    it('Should be able to create error object with error message', () => {
      const error = responseUtil.createErrorObject([{message: 'error'}]);
      expect(error).toEqual([{message: 'error'}]);
    });
  });

  describe('handleError', () => {
    it('Should be able to handle error', () => {
      const error = responseUtil.handleError('error', 'error');
      expect(error).toEqual('error');
    });

    it('Should be able to handle error with message', () => {
      const error = responseUtil.handleError({error: 'error'}, 'error');
      expect(error).toEqual({error: 'error'});
    });

    it('Should be able to handle error with message', () => {
      const error = responseUtil.handleError(null, 'error');
      expect(error).toEqual('error');
    });

    it('Should be able to handle error with message', () => {
      const error = responseUtil.handleError(
        {
          response: {
            data: {
              exceptions: 'error',
            },
          },
        },
        'error',
      );
      expect(error).toEqual('error');
    });

    it('Should be able to handle error with message', () => {
      const error = responseUtil.handleError(
        {
          response: {
            data: {
              errors: 'error',
            },
          },
        },
        'error',
      );
      expect(error).toEqual('error');
    });

    it('Should be able to handle error with message', () => {
      const error = responseUtil.handleError(
        {
          response: {
            data: 'error',
          },
        },
        'error',
      );
      expect(error).toEqual('error');
    });
  });
});
