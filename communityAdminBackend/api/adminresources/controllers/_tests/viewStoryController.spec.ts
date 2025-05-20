import {
  API_RESPONSE,
  ValidationResponse
} from '@anthem/communityadminapi/common';
import {
  mockRequestValidator,
  mockResult,
  mockValidation,
  mockViewStoryService
} from '@anthem/communityadminapi/common/baseTest';
import { ViewStoryController } from '../viewStoryController';

describe('ViewStoryController', () => {
  let controller: ViewStoryController;
  const reqPayload = {
    communities: [],
    type: 'flagged'
  };
  const pageNumber = 1;
  const pageSize = 10;
  const sort = 1;

  beforeEach(() => {
    controller = new ViewStoryController(
      <any>mockResult,
      <any>mockValidation,
      <any>mockViewStoryService,
      <any>mockRequestValidator
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Get all Story.
  it('Should get stories based on community: Admin user error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist,
        },
      },
    };
    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.getStories(
      reqPayload,
      pageNumber,
      pageSize,
      sort
    );
    expect(res).toEqual(expRes);
  });

  it('Should get stories based on community: Page params validation', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badModelTitle,
          detail: API_RESPONSE.messages.invalidIdDetail,
        },
      },
    };

    const validation: ValidationResponse = {
      validationResult: false,
      reason: '',
    };

    const validation2: ValidationResponse = {
      validationResult: false,
      reason: '',
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockRequestValidator.validCommunityArray.mockReturnValue(validation);
    mockValidation.isValid.mockReturnValue(validation2);
    mockResult.createError.mockReturnValue(expRes);
    await controller.getStories(reqPayload, pageNumber, pageSize, sort);
  });

  it('Should get stories based on community: invalid id error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail,
        },
      },
    };

    const validation: ValidationResponse = {
      validationResult: true,
      reason: '',
    };

    // const id = ['61ee6acdc7422a3a7f484e3'];
    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockRequestValidator.validCommunityArray.mockReturnValue(validation);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.getStories(
      reqPayload,
      pageNumber,
      pageSize,
      sort
    );
    expect(res).toEqual(expRes);
  });

  it('Should get stories based on community: Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        values: {},
      },
    };

    const validation: ValidationResponse = {
      validationResult: true,
      reason: '',
    };

    const validation2: ValidationResponse = {
      validationResult: false,
      reason: '',
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockRequestValidator.validCommunityArray.mockReturnValue(validation2);
    mockValidation.isValid.mockReturnValue(validation);
    mockViewStoryService.getAllStories.mockReturnValue(expRes);
    await controller.getStories(reqPayload, pageNumber, pageSize, sort);
  });

  it('Should get stories based on community: exception', async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    await controller.getStories(reqPayload, pageNumber, pageSize, sort);
  });

  // Get story by Id
  it('Should get the story: Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        values: {},
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockViewStoryService.getStory.mockReturnValue(expRes);

    const response = await controller.getStory('id');
    expect(response).toEqual(expRes);
  });

  it('Should get the story: User Validation', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        error: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist,
        },
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const response = await controller.getStory('id');
    expect(response).toEqual(expRes);
  });

  it('Should get the story: Id Validation', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        error: {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail,
        },
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const response = await controller.getStory('id');
    expect(response).toEqual(expRes);
  });

  it('Should get the story: Id Validation', async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    await controller.getStory('id');
  });
});
