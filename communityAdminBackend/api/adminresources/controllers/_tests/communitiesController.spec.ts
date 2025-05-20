import { API_RESPONSE, ValidationResponse } from '@anthem/communityadminapi/common';
import { mockCommunityService, mockResult, mockValidation } from "@anthem/communityadminapi/common/baseTest";
import { CommunityModel } from 'api/adminresources/models/communitiesModel';
import { CommunitiesController } from '../communityController';

describe('CommunitiesController', () => {
  let controller: CommunitiesController;

  const mockifiedUserContext = jest.fn().mockReturnValue("{\"id\":\"61b21e9c26dbb012b69cf67e\",\"name\":\"az00001\",\"active\":\"true\",\"role\":\"scadmin\",\"iat\":1643012245,\"exp\":1643041045,\"sub\":\"az00001\",\"jti\":\"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433\"}")

  beforeEach(() => {
    controller = new CommunitiesController(<any>mockResult, <any>mockCommunityService, <any>mockValidation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return Community after creation: success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          data: {
            isSuccess: true,
            isException: false,
            value: {
              'createdBy': '61b21e9c26dbb012b69cf67e',
              'createdDate': new Date(),
              'title': 'Test',
              'color': '#D30CA7',
              'category': 'Cancer',
              'categoryId': '5f8759cf54fdb7a2c9ae9d0e',
              'type': 'clinical',
            }
          }
        }
      }
    };
    const model: CommunityModel = {
      'title': 'Test',
      'category': 'Cancer',
      'color': '#D30CA7',
      'type': 'clinical',
      'isNew': false,
      'id': '',
      'updatedDate': new Date(),
      'updatedBy': '',
      'displayName': {
        'en': 'Test',
        'es': 'Test Es'
      },
      'active': false,
      image: ''
    }

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockCommunityService.createCommunity.mockReturnValue(expRes);
    const resp = await controller.createCommunity(model);

    expect(resp).toEqual(expRes);
  });

  it('Should Return Community after creation: exception', async () => {
    const model: CommunityModel = {
      'title': 'Test',
      'category': 'Cancer',
      'color': '#D30CA7',
      'type': 'clinical',
      'isNew': false,
      'id': '',
      'updatedDate': new Date(),
      'updatedBy': '',
      'displayName': {
        'en': 'Test',
        'es': 'Test Es'
      },
      'active': false,
      image: ''
    }

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockCommunityService.createCommunity.mockImplementation(() => {
      throw new Error();
    });

    await controller.createCommunity(model);

  })

  it('Should Return all Communities: Success', async () => {
    const expRes = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": [
          {
            "createdBy": "5f99844130b711000703cd74",
            "title": "Diabetes",
            "category": "Diabetes",
            "categoryId": "607e7c92d0a2b533bb2ae3d1",
            "color": "#286CE2",
            "type": "clinical",
            "parent": "Diabetes",
            "createdDate": "2021-04-20T07:02:42.587Z",
            "__v": 0,
            "createdAt": "2021-08-10T11:23:36.413Z",
            "updatedAt": "2021-08-10T11:23:36.413Z",
            "displayName": {
              "en": "Diabetes",
              "es": "Diabetes"
            },
            "id": "607e7c99d0a2b533bb2ae3d2"
          },
          {
            "createdBy": "5f99844130b711000703cd74",
            "title": "Weight Management",
            "category": "Weight Management",
            "categoryId": "60a3589d9c336e882b19bbef",
            "color": "#286CE2",
            "type": "non-clinical",
            "parent": "Weight Management",
            "createdDate": "2021-05-18T06:03:32.976Z",
            "__v": 0,
            "createdAt": "2021-08-10T11:23:36.414Z",
            "updatedAt": "2021-08-10T11:23:36.414Z",
            "displayName": {
              "en": "Weight Management",
              "es": "Control de peso"
            },
            "id": "60a358bc9c336e882b19bbf0"
          },
          {
            "createdBy": "5f99844130b711000703cd74",
            "title": "Parenting",
            "category": "Parenting",
            "categoryId": "60ed47c4fd042c828fca117e",
            "color": "#286CE2",
            "type": "non-clinical",
            "parent": "Parenting",
            "createdDate": "2021-07-05T11:03:22.835Z",
            "__v": 0,
            "createdAt": "2021-08-10T11:23:36.414Z",
            "updatedAt": "2021-08-10T11:23:36.414Z",
            "displayName": {
              "en": "Parenting",
              "es": "Crianza"
            },
            "id": "60e2e7277c37b43a668a32f2"
          },
          {
            "createdBy": "5f99844130b711000703cd74",
            "title": "Cancer",
            "category": "Cancer",
            "categoryId": "5f8759dc54fdb7a2c9ae9d0f",
            "color": "#286CE2",
            "type": "non-clinical",
            "parent": "Cancer",
            "createdDate": "2022-01-24T09:01:01.395Z",
            "__v": 0,
            "createdAt": "2022-01-24T09:01:01.395Z",
            "updatedAt": "2022-01-24T09:01:01.395Z",
            "displayName": {
              "en": "Cancer",
              "es": "Cáncer"
            },
            "id": "61ee6acdc7422a3a7f484e3c"
          }
        ]
      }
    };

    const validate: ValidationResponse = {
      validationResult: true,
      reason: ''
    }

    mockValidation.isValid.mockReturnValue(validate);
    mockCommunityService.getAllCommunities.mockReturnValue(expRes);
    const response = await controller.getAllCommunity(1, 10, 1, true, true);
    expect(response).toEqual(expRes);
  });

  it('Should Return all Communities: Page Number Error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'd1904a20-47d3-e0d0-ed17-5a3cc4f1b59e',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.pageNumberMissing
          }
        ]
      }
    };

    const validate: ValidationResponse = {
      validationResult: false,
      reason: API_RESPONSE.messages.pageNumberMissing
    }

    mockValidation.isValid.mockReturnValue(validate);
    mockResult.createError.mockReturnValue(expRes);
    const response = await controller.getAllCommunity(-5, 10, 1, true, true);
    expect(response).toEqual(expRes);
  });

  it('Should Return all Communities: Sort Error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'd1904a20-47d3-e0d0-ed17-5a3cc4f1b59e',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.sortInvalid
          }
        ]
      }
    };

    const validate: ValidationResponse = {
      validationResult: false,
      reason: API_RESPONSE.messages.sortInvalid
    }

    mockValidation.isValid.mockReturnValue(validate);
    mockResult.createError.mockReturnValue(expRes);
    const response = await controller.getAllCommunity(1, 10, -5, true, true);
    expect(response).toEqual(expRes);
  });

  it('Should Return all Communities: Page Size Error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'd1904a20-47d3-e0d0-ed17-5a3cc4f1b59e',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.pageSizeMissing
          }
        ]
      }
    };

    const validate: ValidationResponse = {
      validationResult: false,
      reason: API_RESPONSE.messages.pageSizeMissing
    }

    mockValidation.isValid.mockReturnValue(validate);
    mockResult.createError.mockReturnValue(expRes);
    const response = await controller.getAllCommunity(1, -5, 1, true, true);
    expect(response).toEqual(expRes);
  });

  it('Should Return all Communities: Exception', async () => {
    const validate: ValidationResponse = {
      validationResult: true,
      reason: ''
    }

    mockValidation.isValid.mockReturnValue(validate);
    mockCommunityService.getAllCommunities.mockImplementation(() => {
      throw new Error();
    });
    await controller.getAllCommunity(1, 10, 1, true, true);
  });

  it('Should Return Sub Communities: Error - Bad Data', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'd1904a20-47d3-e0d0-ed17-5a3cc4f1b59e',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.pageSizeMissing
          }
        ]
      }
    };
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const actualRes = await controller.getSubCommunities('');
    expect(actualRes).toEqual(expRes);
  });

  it('Should Return Sub Communities: Success', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        value: [
          {
            "id": "",
            "title": "Select One",
            "type": "select"
          },
          {
            "id": "5f0e744536b382377497ecef",
            "title": "Anal Cancer",
            "type": "cancer"
          },
          {
            "id": "5f0753f6c12e0c22d00f5d23",
            "title": "Breast Cancer",
            "type": "cancer"
          },
          {
            "id": "5f22db56a374bc4e80d80a9b",
            "title": "Male Breast Cancer",
            "type": "cancer"
          },
          {
            "id": "5f369ba97b79ea14f85fb0ec",
            "title": "Metastatic or Recurrent Breast Cancer",
            "type": "cancer"
          },
          {
            "id": "5f189ba00d5f552cf445b8c2",
            "title": "Colorectal Cancer",
            "type": "cancer"
          },
          {
            "id": "5f3d2eef5617cc2e401b8adf",
            "title": "Metastatic or Recurrent Colorectal Cancer",
            "type": "cancer"
          },
          {
            "id": "5f07537bc12e0c22d00f5d21",
            "title": "Lung Cancer",
            "type": "cancer"
          },
          {
            "id": "5f0753b7c12e0c22d00f5d22",
            "title": "Oral Cancer",
            "type": "cancer"
          },
          {
            "id": "5f245386aa271e24b0c6fd88",
            "title": "Prostate Cancer",
            "type": "cancer"
          },
          {
            "id": "5f245386aa271e24b0c6fd89",
            "title": "Advanced or Metastatic Prostate Cancer",
            "type": "cancer"
          },
          {
            "id": "6206698f6aa0f2002f172ee2",
            "title": "Other",
            "type": "otherCancer"
          }
        ]
      }
    };
    mockValidation.isHex.mockReturnValue(true);
    mockCommunityService.getSubCommunities.mockReturnValue(expRes);
    const actualRes = await controller.getSubCommunities('6214e8959aa982c0d09b40f5');
    expect(actualRes).toEqual(expRes);
  });

  it('Should Return all Communities: Exception', async () => {
    const validate: ValidationResponse = {
      validationResult: true,
      reason: ''
    }

    mockValidation.isValid.mockReturnValue(validate);
    mockCommunityService.getSubCommunities.mockImplementation(() => {
      throw new Error();
    });
    await controller.getSubCommunities('6214e8959aa982c0d09b40f5');
  });

  describe("getCommunityAdmins", async () => {
    it("success", async () => {
      mockValidation.isHex.mockReturnValue(true);
      mockCommunityService.getCommunityAdmins.mockReturnValue(true);

      await controller.getCommunityAdmins('communityId');
    });

    it("error", async () => {
      mockValidation.isHex.mockReturnValue(false);
      mockResult.createError.mockReturnValue(1);

      await controller.getCommunityAdmins('communityId');
    });

    it("exception", async () => {
      mockValidation.isHex.mockImplementation(() => {
        throw new Error();
      });
      mockResult.createException.mockReturnValue(1);

      await controller.getCommunityAdmins('communityId');
    });
  });
});
