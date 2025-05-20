import { API_RESPONSE } from '@anthem/communityadminapi/common';
import { mockResult, mockSearchTermService, mockValidation } from '@anthem/communityadminapi/common/baseTest';
import { SearchTermController } from '../searchTermController';

describe('SearchTermController', () => {
  let controller: SearchTermController;

  beforeEach(() => {
    controller = new SearchTermController(<any>mockSearchTermService, <any>mockResult, <any>mockValidation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockifiedUserContext = jest.fn().mockReturnValue("{\"id\":\"61b21e9c26dbb012b69cf67e\",\"name\":\"az00001\",\"active\":\"true\",\"role\":\"scadmin\",\"iat\":1643012245,\"exp\":1643041045,\"sub\":\"az00001\",\"jti\":\"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433\"}");

  it('Should add new search term: Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          term: 'random',
          id: '610140afe2816167d1dde25b'
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockSearchTermService.addSearchTerm.mockReturnValue(expRes);
    const res = await controller.addSearchTerm('random');
    expect(res).toEqual(expRes);
  });

  it('Should add new search term: Failed', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title:  API_RESPONSE.messages.badData,
          detail:  API_RESPONSE.messages.userDoesNotExist
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.addSearchTerm('random');
    expect(res).toEqual(expRes);
  });

  it('Should add new search term: Exception', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockSearchTermService.addSearchTerm.mockImplementation(() => {
      throw new Error();
    })
    await controller.addSearchTerm('random');
  });
});
