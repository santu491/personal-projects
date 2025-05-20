import { API_RESPONSE, TranslationLanguage } from '@anthem/communityapi/common';
import {
  mockCommunity,
  mockRequestContext,
  mockResult,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { RequestContext } from '@anthem/communityapi/utils';
import { PageParam } from 'api/communityresources/models/pageParamModel';
import { CommunitiesController } from '../communitiesController';

describe('CommunitiesController', () => {
  let ctrl: CommunitiesController;

  beforeEach(() => {
    ctrl = new CommunitiesController(
      <any>mockCommunity,
      <any>mockValidation,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // getAllCommunity
  it('Should Return all Community List: Success', async () => {
    const pageParams: PageParam = { pageNumber: 1, pageSize: 10, sort: -1 };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: []
      }
    };
    mockValidation.isValid.mockReturnValue({validationResult: true});
    mockCommunity.getAllCommunities.mockReturnValue(expRes);
    const response = await ctrl.getAllCommunity(pageParams.pageNumber, pageParams.pageSize, pageParams.sort, null);

    expect(response).toEqual(expRes);
  });

  it('Should Return Error while retrieving Community List', async () => {
    const pageParams = { pageNumber: 1, pageSize: 10, sort: 2 };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'd1904a20-47d3-e0d0-ed17-5a3cc4f1b59e',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badModelTitle,
            detail: 'Sort can be 1 or -1'
          }
        ]
      }
    };
    mockValidation.isValid.mockReturnValue({validationResult: false});
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getAllCommunity(pageParams.pageNumber, pageParams.pageSize, pageParams.sort, 'en');
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving Community List', async () => {
    const pageParams = { pageNumber: 1, pageSize: 10, sort: 2 };
    mockValidation.isValid.mockImplementation(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await ctrl.getAllCommunity(pageParams.pageNumber, pageParams.pageSize, pageParams.sort, 'en');
  });

 // getAllCommunitiesNested
  it('Should return success with nested Community object', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
        ]
      }
    };

    mockCommunity.getAllCommunitiesNested.mockReturnValue(expRes);
    const data = await ctrl.getAllCommunitiesNested(
      TranslationLanguage.ENGLISH
    );

    expect(data).toEqual(expRes);
  });

  it('Should return error with nested Community object', async () => {
    mockCommunity.getAllCommunitiesNested.mockImplementationOnce(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await ctrl.getAllCommunitiesNested(
     null
    );
  });

  // getAllCategories
  it('Should Return Specific Community', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            category: 'Breast Cancer',
            categoryId: '5f8759cf54fdb7a2c9ae9d0e',
            parent: 'Cancer',
            communities: [
              {
                title: 'Metastatic or Recurrent Breast Cancer',
                type: 'clinical',
                parent: 'Cancer',
                createdAt: '2020-08-14T14:11:53.296Z',
                updatedAt: '2021-08-10T12:48:34.701Z',
                id: '5f369ba97b79ea14f85fb0ec'
              },
              {
                title: 'Male Breast Cancer',
                type: 'clinical',
                parent: 'Cancer',
                createdAt: '2020-07-30T14:38:14.831Z',
                updatedAt: '2021-08-10T12:48:34.701Z',
                id: '5f22db56a374bc4e80d80a9b'
              },
              {
                title: 'Breast Cancer',
                type: 'clinical',
                parent: 'Cancer',
                createdAt: '2020-07-09T00:00:00.000Z',
                updatedAt: '2021-08-10T12:48:34.702Z',
                id: '5f0753f6c12e0c22d00f5d23'
              }
            ]
          },
          {
            category: 'Colorectal Cancer',
            categoryId: '5f875a0354fdb7a2c9ae9d12',
            parent: 'Cancer',
            communities: [
              {
                title: 'Colorectal Cancer',
                type: 'clinical',
                parent: 'Cancer',
                createdAt: '2020-07-22T20:03:44.748Z',
                updatedAt: '2021-08-10T12:48:34.701Z',
                id: '5f189ba00d5f552cf445b8c2'
              },
              {
                title: 'Metastatic or Recurrent Colorectal Cancer',
                type: 'clinical',
                parent: 'Cancer',
                createdAt: '2020-08-19T13:51:05.095Z',
                updatedAt: '2021-08-10T12:48:34.702Z',
                id: '5f3d2eef5617cc2e401b8adf'
              }
            ]
          },
          {
            category: 'Anal Cancer',
            categoryId: '5f8759fc54fdb7a2c9ae9d11',
            parent: 'Cancer',
            communities: [
              {
                title: 'Anal Cancer',
                type: 'clinical',
                parent: 'Cancer',
                createdAt: '2020-07-14T00:00:00.000Z',
                updatedAt: '2021-08-10T12:48:34.701Z',
                id: '5f0e744536b382377497ecef'
              }
            ]
          },
          {
            category: 'Diabetes',
            categoryId: '607e7c92d0a2b533bb2ae3d1',
            parent: 'Diabetes',
            communities: [
              {
                title: 'Diabetes',
                type: 'clinical',
                parent: 'Diabetes',
                createdAt: '2021-04-20T07:02:42.587Z',
                updatedAt: '2021-08-10T12:48:34.702Z',
                id: '607e7c99d0a2b533bb2ae3d2'
              }
            ]
          },
          {
            category: 'Weight Management',
            categoryId: '60a3589d9c336e882b19bbef',
            parent: 'Weight Management',
            communities: [
              {
                title: 'Weight Management',
                type: 'non-clinical',
                parent: 'Weight Management',
                createdAt: '2021-05-18T06:03:32.976Z',
                updatedAt: '2021-08-10T12:48:34.702Z',
                id: '60a358bc9c336e882b19bbf0'
              }
            ]
          },
          {
            category: 'Parenting',
            categoryId: '60ed47c4fd042c828fca117e',
            parent: 'Parenting',
            communities: [
              {
                title: 'Parenting',
                type: 'non-clinical',
                parent: 'Parenting',
                createdAt: '2021-07-05T11:03:22.835Z',
                updatedAt: '2021-08-10T12:48:34.702Z',
                id: '60e2e7277c37b43a668a32f2'
              }
            ]
          },
          {
            category: 'Oral Cancer',
            categoryId: '5f8759dc54fdb7a2c9ae9d0f',
            parent: 'Cancer',
            communities: [
              {
                title: 'Oral Cancer',
                type: 'clinical',
                parent: 'Cancer',
                createdAt: '2020-07-09T00:00:00.000Z',
                updatedAt: '2021-08-10T12:48:34.702Z',
                id: '5f0753b7c12e0c22d00f5d22'
              }
            ]
          },
          {
            category: 'Lung Cancer',
            categoryId: '5f8759ea54fdb7a2c9ae9d10',
            parent: 'Cancer',
            communities: [
              {
                title: 'Lung Cancer',
                type: 'clinical',
                parent: 'Cancer',
                createdAt: '2020-07-09T00:00:00.000Z',
                updatedAt: '2021-08-10T12:48:34.702Z',
                id: '5f07537bc12e0c22d00f5d21'
              }
            ]
          },
          {
            category: 'Prostate Cancer',
            categoryId: '5f875a0854fdb7a2c9ae9d13',
            parent: 'Cancer',
            communities: [
              {
                title: 'Advanced or Metastatic Prostate Cancer',
                type: 'clinical',
                parent: 'Cancer',
                createdAt: '2020-05-31T16:53:14.477Z',
                updatedAt: '2021-08-10T12:48:34.702Z',
                id: '5f245386aa271e24b0c6fd89'
              },
              {
                title: 'Prostate Cancer',
                type: 'clinical',
                parent: 'Cancer',
                createdAt: '2020-05-31T16:53:14.477Z',
                updatedAt: '2021-08-10T12:48:34.702Z',
                id: '5f245386aa271e24b0c6fd88'
              }
            ]
          }
        ]
      }
    };

    mockCommunity.getAllCategories.mockResolvedValue(expRes);
    const data = await ctrl.getAllCategories(null);
    expect(data).toEqual(expRes);
  });

  it('Should Return Specific Community', async () => {
    mockCommunity.getAllCategories.mockImplementation(() => {
      throw new Error()
    });
    await ctrl.getAllCategories(null);
  });

  // getCommunityById
  it('Should Return Specific Community', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          _id: '5f369ba97b79ea14f85fb0ec',
          CreatedBy: 'Laura',
          Title: 'Metastatic or Recurrent Breast Cancer',
          Category: 'Breast Cancer',
          CategoryId: '5f8759cf54fdb7a2c9ae9d0e',
          CreatedDate: '2020-08-14T14:11:53.296Z',
        }
      }
    };

    mockValidation.isHex.mockReturnValueOnce(true);

    mockCommunity.getCommunityById.mockResolvedValue(expRes);
    const data = await ctrl.getCommunityById('5f369ba97b79ea14f85fb0ec', null);
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while fetching Specific Community', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: []
      }
    };

    mockValidation.isHex.mockReturnValueOnce(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getCommunityById(
      'xxxxx',
      null
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while fetching Specific Community', async () => {
    mockValidation.isHex.mockImplementation(() => {
     throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await ctrl.getCommunityById(
      'xxxxx',
      null
    );
  });

  // getMyCommunities
  it('Should Return all Community List', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: []
      }
    };

    RequestContext.getContextItem = mockRequestContext;
    mockCommunity.getMyCommunities.mockResolvedValue(expRes);
    const data = await ctrl.getMyCommunities(null);
    expect(data).toEqual(expRes);
  });

  it('Should Return all Community List', async () => {
    RequestContext.getContextItem = mockRequestContext;
    mockCommunity.getMyCommunities.mockImplementation(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await ctrl.getMyCommunities(TranslationLanguage.ENGLISH);
  });

  // getActivePageForCommunity
  it('Should Return Active Community', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          "6214e8959aa982c0d09b40f5": "STORY"
        }
      }
    };
    mockValidation.isHex.mockReturnValueOnce(true);
    mockCommunity.getActivePageForCommunity.mockResolvedValue(expRes);
    const communityId = '6214e8959aa982c0d09b40f5';
    const data = await ctrl.getActivePageForCommunity(communityId);
    expect(data.data.value).toHaveProperty(communityId);
  });

  it('Should Return Error for invalid community id', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '4d8cf75c-3766-0f37-637b-d67a2eceaffc',
            errorCode: 400,
            title: 'Incorrect model',
            detail: 'Community Id is not a 24 hex string'
          }
        ]
      }
    };

    mockValidation.isValid.mockReturnValueOnce({
      validationResult: false
    });

    mockResult.createError.mockReturnValue(expRes);
    mockValidation.isHex.mockReturnValueOnce(false);
    const data = await ctrl.getActivePageForCommunity(undefined);
    expect(data).toEqual(expRes);
  });

  it('Should Return Error for invalid community id', async () => {
    mockValidation.isHex.mockImplementationOnce(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await ctrl.getActivePageForCommunity(undefined);
  });

  /**
   * It should get the communities Images based on the community id.
   */
  it('Should Return community Image', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: 'id',
          imagebase64: 'base64String'
        }
      }
    };

    mockValidation.isHex.mockReturnValue(true);
    mockCommunity.getCommunityImage.mockReturnValue(expRes);
    const data = await ctrl.getCommunityImage('communityId');
    expect(data).toEqual(expRes);
  });

  it('Should Return community Image: Error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '4d8cf75c-3766-0f37-637b-d67a2eceaffc',
            errorCode: 400,
            title: 'Incorrect model',
            detail: 'Community Id is not a 24 hex string'
          }
        ]
      }
    };

    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes)
    const data = await ctrl.getCommunityImage('communityId');
    expect(data).toEqual(expRes);
  });

});
