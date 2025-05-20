import { API_RESPONSE } from '@anthem/communityadminapi/common';
import { mockLibraryService, mockLibSectionSvc, mockResult, mockValidation } from '@anthem/communityadminapi/common/baseTest';
import { SectionEditRequest } from 'api/adminresources/models/libraryModel';
import { LibraryController } from '../libraryController';

describe('LibraryController', () => {
  let controller: LibraryController;

  beforeEach(() => {
    controller = new LibraryController(<any>mockLibraryService, <any>mockResult, <any>mockValidation, <any>mockLibSectionSvc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockifiedUserContext = jest.fn().mockReturnValue("{\"id\":\"61b21e9c26dbb012b69cf67e\",\"name\":\"az00001\",\"active\":\"true\",\"role\":\"scadmin\",\"iat\":1643012245,\"exp\":1643041045,\"sub\":\"az00001\",\"jti\":\"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433\"}");

  it('Should Return library with communityId: Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          headerTitle: "Library",
          headerDescription: "Carefully selected content for you.",
          communityId: "5f245386aa271e24b0c6fd89",
          title: "Advanced or Metastatic Prostate Cancer",
          sections: [],
          __v: 0,
          id: "5f870c3b326b36caf1dd2c42"
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(true);
    mockLibraryService.getLibraryByCommunityId.mockReturnValue(expRes);

    const res = await controller.getLibraryByCommunityId('5f245386aa271e24b0c6fd86');
    expect(res).toEqual(expRes);
  });

  it('Should Return library with communityId: Auth Error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        value: {
          title : API_RESPONSE.messages.badData,
          detail : API_RESPONSE.messages.userDoesNotExist
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);

    const res = await controller.getLibraryByCommunityId('5f245386aa271e24b0c6fd86');
    expect(res).toEqual(expRes);
  });

  it('Should Return library with communityId: Invalid Community Id', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title : API_RESPONSE.messages.invalidIdTitle,
          detail : API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.getLibraryByCommunityId('5f245386aa271e24b0c6fd86');
    expect(res).toEqual(expRes);
  });

  it('Should Return library with communityId: Expection', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(true);
    mockLibraryService.getLibraryByCommunityId.mockImplementation(() => {
      throw new Error();
    });

    await controller.getLibraryByCommunityId('5f245386aa271e24b0c6fd86');
  });

  it('createSection - return success', async () => {
    mockValidation.isHex.mockReturnValue(true);
    mockLibraryService.createCommunitySection.mockReturnValue(true);

    const result = await controller.createSection({
      section: {
        en: {
          communityId: 'communityId',
          helpfulInfoId: 'id',
          headerDescription: 'test',
          headerTitle: 'test',
          title: 'test',
          description: 'test',
          subDescription: null,
          sections: [],
          isCommon: false
        },
        es: {
          communityId: 'communityId',
          helpfulInfoId: 'id',
          headerDescription: 'test',
          headerTitle: 'test',
          title: 'test',
          description: 'test',
          subDescription: null,
          sections: [],
          isCommon: false
        }
      },
      subSections: []
    });
    expect(result).toBe(true);
  });

  it('createSection - return error', async () => {
    const expectedResult = {
      isSuccess: false,
      errors: {
        title: API_RESPONSE.messages.invalidIdTitle,
        detail: API_RESPONSE.messages.invalidCommentId
      }
    }
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expectedResult)

    const result = await controller.createSection({
      section: {
        en: {
          communityId: 'communityId',
          helpfulInfoId: 'id',
          headerDescription: 'test',
          headerTitle: 'test',
          title: 'test',
          description: 'test',
          subDescription: null,
          sections: [],
          isCommon: false
        },
        es: {
          communityId: 'communityId',
          helpfulInfoId: 'id',
          headerDescription: 'test',
          headerTitle: 'test',
          title: 'test',
          description: 'test',
          subDescription: null,
          sections: [],
          isCommon: false
        }
      },
      subSections: []
    });
    expect(result).toBe(expectedResult);
  });

  it('getArticle - return success for healthwise', async () => {
    const expectedResult = {
      data: {
        isSuccess: true,
        value: {
          en: {
            title: "How can you help prevent colorectal cancer?",
            type: "HWReference",
            communityId: "",
            contentId: "",
            description: "",
            link: "/v2/healthWise/articleTopic/acg0360",
            video: "",
            thumbnail: ""
          },
          es: {
            title: "¿Cómo puede ayudar a prevenir el cáncer colorrectal?",
            type: "HWReference",
            communityId: "",
            contentId: "",
            description: "",
            link: "/v2/healthWise/articleTopic/acg0360",
            video: "",
            thumbnail: ""
          }
        }
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockLibraryService.getHealthwiseArticle.mockReturnValue(expectedResult);
    const result = await controller.getArticle({
      articleId: 'articleId',
      provider: 'healthwise'
    });
    expect(result).toBe(expectedResult);
  });


  it('getArticle - return success for meredith', async () => {
    const expectedResult = {
      data: {
        isSuccess: true,
        value: {
          en: {
            title: "How can you help prevent colorectal cancer?",
            type: "HWReference",
            communityId: "",
            contentId: "articleId",
            description: "",
            link: "https://www.eatingwell.com/article/7867303/sleep-might-be-the-reason-you-re-not-losing-weight/",
            video: "",
            thumbnail: "",
            copyright: "© Meredith Operations Corporation. All rights reserved. Used with permission.",
            brandLogo: "http://deliveries.foundry360.com/deliveries/xml/brand-logos/20190912/EatingWell-Logo-COLOR.png",
            brand: "EatingWell"
          },
          es: {
            title: "¿Cómo puede ayudar a prevenir el cáncer colorrectal?",
            type: "HWReference",
            communityId: "",
            contentId: "articleId",
            description: "",
            link: "https://www.eatingwell.com/article/7867303/sleep-might-be-the-reason-you-re-not-losing-weight/",
            video: "",
            thumbnail: "",
            copyright: "© Meredith Operations Corporation. All rights reserved. Used with permission.",
            brandLogo: "http://deliveries.foundry360.com/deliveries/xml/brand-logos/20190912/EatingWell-Logo-COLOR.png",
            brand: "EatingWell"
          }
        }
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockLibraryService.getMeredithArticle.mockReturnValue(expectedResult);
    const result = await controller.getArticle({
      articleId: 'articleId',
      provider: 'meredith'
    });
    expect(result).toBe(expectedResult);
  });

  it('getArticle - return white space error on article id', async () => {
    const expectedResult = {
      data: {
        isSuccess: false,
        errors: {
          errorCode: 400,
          title: "Bad data",
          detail: "Incorrect id"
        }
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expectedResult);
    const result = await controller.getArticle({
      articleId: ' ',
      provider: 'meredith'
    });
    expect(result).toBe(expectedResult);
  });

  it('getArticle - return error on invalid type', async () => {
    const expectedResult = {
      data: {
        isSuccess: false,
        errors: {
          errorCode: 400,
          title: "Bad data",
          detail: "Invalid Article Provider"
        }
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expectedResult);
    const result = await controller.getArticle({
      articleId: 'articleId',
      provider: 'notValid'
    });
    expect(result).toBe(expectedResult);
  });

  const requestData: SectionEditRequest = {
    sectionIndex: 0,
    subSectionIndex: 0,
    subSectionId: '',
    communityId: '',
    en: {
    title: '',
    sectionId: '',
    description: '',
    backgroundColor: '',
    content: [],
    subSection: []
  },
    es: {
    title: '',
    sectionId: '',
    description: '',
    backgroundColor: '',
    content: [],
    subSection: []
  }
  }

  it('editSection - return section edit success', async () => {
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockLibSectionSvc.editSectionDetails.mockReturnValue(true);

    await controller.editSection(requestData);
  });

  it('editSection - return sub section edit success', async () => {
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockLibSectionSvc.editSubSectionDetails.mockReturnValue(true);

    const result = await controller.editSection(requestData);
    expect(result).toBe(true);
  });

  it('editSection - return error - invalid community Id', async () => {
    const expectedResult = {
      isSuccess: false,
      errors: {
        title: API_RESPONSE.messages.invalidIdTitle,
        detail: API_RESPONSE.messages.invalidCommentId
      }
    }
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expectedResult)

    const result = await controller.editSection(requestData);
    expect(result).toBe(expectedResult);
  });

  it('editSection - return error - invalid Title', async () => {
    const expectedResult = {
      isSuccess: false,
      errors: {
        title: API_RESPONSE.messages.badData,
        detail: API_RESPONSE.messages.badModelTitle
      }
    }
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValueOnce(false).mockReturnValue(true);
    mockResult.createError.mockReturnValue(expectedResult)

    const result = await controller.editSection(requestData);
    expect(result).toBe(expectedResult);
  });
});
