import { API_RESPONSE } from '@anthem/communityapi/common';
import {
  mockManageProfileSvc,
  mockRequestContext,
  mockResult,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { RequestContext } from '@anthem/communityapi/utils';
import { ManageProfileController } from '../manageProfileController';

describe('ManageProfileController', () => {
  let controller: ManageProfileController;

  beforeEach(() => {
    controller = new ManageProfileController(
      <any>mockManageProfileSvc,
      <any>mockValidation,
      <any>mockResult
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should delete user profile: success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: '',
      },
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockManageProfileSvc.deleteProfile.mockReturnValue(expRes);
    const response = await controller.deleteProfile();
    expect(response).toEqual(expRes);
  });

  it('Should delete user profile: failure', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: 'ab5d9974-a4ce-cc2f-c319-cc10efe48bfc',
          errorCode: 400,
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail,
        },
      },
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const response = await controller.deleteProfile();
    expect(response).toEqual(expRes);
  });
});
