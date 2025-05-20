import { API_RESPONSE } from '@anthem/communityapi/common';
import {
  mockInactiveRequestContext,
  mockRequestContext,
  mockResult,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { RequestContext } from '@anthem/communityapi/utils';
import { mockUserAttrSvc } from '@anthem/communityapi/utils/mocks/mockUserServices';
import { CommunityInfoRequest } from 'api/communityresources/models/userModel';
import { UserAttributesController } from '../userAttributesController';

describe('UserController', () => {
  let controller;

  beforeEach(() => {
    controller = new UserAttributesController(
      <any>mockResult,
      <any>mockUserAttrSvc,
      <any>mockValidation,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updateStoryPromotion - success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: true
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockUserAttrSvc.updateStoryPromotion.mockReturnValue(expRes);
    const res = await controller.updateStoryPromotion(true);
    expect(res).toBe(expRes);
  });

  it('updateStoryPromotion - Inactive User', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '54e23572-14e9-413d-a123-3c06a5243ac8',
            title: API_RESPONSE.messages.userNotActiveTitle,
            detail: API_RESPONSE.messages.userNotActiveMessage
          }
        ]
      }
    };
    RequestContext.getContextItem = mockInactiveRequestContext;
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.updateStoryPromotion(true);
    expect(res).toBe(expRes);
  });

  it('updateUserCommunityDetails - success', async () => {
    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        data: true
      }
    };
    const input: CommunityInfoRequest = {
      communityId: 'communityId',
      doNotAskAgain: false,
      dueDate: 'dueDate',
      isPregnant: false,
      tryingToConceive: false
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockUserAttrSvc.updateCommunityInfo.mockReturnValue(expected);
    const response = await controller.updateUserCommunityDetails(input);
    expect(response).toBe(expected);
  });

  it('updateUserCommunityDetails - failure', async () => {
    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        data: false
      }
    };
    const input: CommunityInfoRequest = {
      communityId: 'communityId',
      doNotAskAgain: false,
      dueDate: 'dueDate',
      isPregnant: false,
      tryingToConceive: false
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expected);
    const response = await controller.updateUserCommunityDetails(input);
    expect(response).toBe(expected);
  });

  it('updateUserCommunityVisitCount - success', async () => {
    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        data: true
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockUserAttrSvc.updateCommunityVisit.mockReturnValue(expected);
    const response = await controller.updateUserCommunityVisitCount(
      'communityId'
    );
    expect(response).toBe(expected);
  });

  it('updateUserCommunityVisitCount - failure', async () => {
    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        data: false
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expected);
    const response = await controller.updateUserCommunityVisitCount(
      'communityId'
    );
    expect(response).toBe(expected);
  });
});
