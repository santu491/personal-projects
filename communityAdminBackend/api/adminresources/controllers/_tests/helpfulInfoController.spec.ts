import { API_RESPONSE } from '@anthem/communityadminapi/common';
import {
  mockArticleSvc,
  mockHelpfulInfoService,
  mockResult,
  mockValidation
} from '@anthem/communityadminapi/common/baseTest';
import {
  HelpfulInfoLibRequest,
  LibraryDetail,
  LibrarySectionRequest
} from 'api/adminresources/models/libraryModel';
import { HelpfulInfoController } from '../helpfulInfoController';

describe('HelpfulInfo Controller', () => {
  let controller: HelpfulInfoController;

  beforeEach(() => {
    controller = new HelpfulInfoController(
      <any>mockHelpfulInfoService,
      <any>mockArticleSvc,
      <any>mockResult,
      <any>mockValidation
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const communityId: string = '5f9ab4ec2ebea500072e6e48';
  const helpfulInfo: string = '5f9ab4ec2ebea500072e6e48';

  // getCommunityLibrary
  it('Should get the content based on the community: Error', async () => {
    const exp = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.incorrectModel
        }
      }
    };

    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(exp);
    const result = await controller.getCommunityLibrary(communityId);
    expect(result).toEqual(exp);
  });

  it('Should get the content based on the community: Success', async () => {
    mockValidation.isHex.mockReturnValue(true);
    mockHelpfulInfoService.getCommunityHelpfulInfo.mockReturnValue(true);
    await controller.getCommunityLibrary(communityId);
  });

  it('Should get the content based on the community: Exception', async () => {
    mockValidation.isHex.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    await controller.getCommunityLibrary(communityId);
  });

  // getLibraryWithId
  it('Should get the Library of the HelpfulInfo: Error', async () => {
    const exp = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(exp);
    const responses = await controller.getLibraryWithId(helpfulInfo);
    expect(responses).toEqual(exp);
  });

  it('Should get the Library of the HelpfulInfo: Success', async () => {
    const exp = {
      data: {
        isSuccess: true,
        isException: false,
        value: {}
      }
    };

    mockValidation.isHex.mockReturnValue(true);
    mockHelpfulInfoService.getHelpfulInfoById.mockReturnValue(exp);
    const responses = await controller.getLibraryWithId(helpfulInfo);
    expect(responses).toEqual(exp);
  });

  it('Should get the Library of the HelpfulInfo: Exception', async () => {
    mockValidation.isHex.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    await controller.getLibraryWithId(helpfulInfo);
  });

  const updateLibraryWithIdPayload: HelpfulInfoLibRequest = {
    en: [],
    es: [],
    helpfulInfoId: helpfulInfo
  };
  // updateLibraryWithId
  it('Should update the library data with given data: Failed', async () => {
    const exp = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(exp);
    const responses = await controller.updateLibraryWithId(
      updateLibraryWithIdPayload
    );
    expect(responses).toEqual(exp);
  });

  it('Should update the library data with given data: Success', async () => {
    const exp = {
      data: {
        isSuccess: true,
        isException: false,
        value: {}
      }
    };

    mockValidation.isHex.mockReturnValue(true);
    mockHelpfulInfoService.updateHelpfulInfo.mockReturnValue(exp);
    const responses = await controller.updateLibraryWithId(
      updateLibraryWithIdPayload
    );
    expect(responses).toEqual(exp);
  });

  it('Should update the library data with given data: Exception', async () => {
    mockValidation.isHex.mockImplementation(() => {
      throw new Error();
    });
    await controller.updateLibraryWithId(updateLibraryWithIdPayload);
  });

  // updateLibrarySectionWithId
  const sectionUpdatePayload: LibrarySectionRequest = {
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
    },
    sectionId: '',
    communityId: ''
  };
  it('Should update the section data with given data: Error', async () => {
    const exp = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(exp);
    const response = await controller.updateLibrarySectionWithId(
      sectionUpdatePayload
    );
    expect(response).toEqual(exp);
  });

  it('Should update the section data with given data: Success', async () => {
    const exp = {
      data: {
        isSuccess: true,
        isException: false,
        value: {}
      }
    };
    mockValidation.isHex.mockReturnValue(true);
    mockHelpfulInfoService.updateLibrarySection.mockReturnValue(exp);
    const response = await controller.updateLibrarySectionWithId(
      sectionUpdatePayload
    );
    expect(response).toEqual(exp);
  });

  it('Should update the section data with given data: Exception', async () => {
    mockValidation.isHex.mockImplementation(() => {
      throw new Error();
    });
    await controller.updateLibrarySectionWithId(sectionUpdatePayload);
  });

  // getCommonLibrary
  it('Shpuld get the community lib', async () => {
    mockHelpfulInfoService.getCommunityHelpfulInfo.mockReturnValue(true);
    controller.getCommonLibrary();
  })

  it('Shpuld get the community lib', async () => {
    mockHelpfulInfoService.getCommunityHelpfulInfo.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(1);
    controller.getCommonLibrary();
  })

  // updateLibraryDetailsWithId
  const payload: LibraryDetail = {
    helpfulInfoId: '',
    en: {
      title: '',
      description: ''
    },
    es: {
      title: '',
      description: ''
    }
  }
  it("Should update lib details with Id", async () => {
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValueOnce(false);
    mockValidation.isNullOrWhiteSpace.mockReturnValueOnce(false);

    await controller.updateLibraryDetailsWithId(payload)
  })

  it("Should update lib details with Id", async () => {
    mockValidation.isHex.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createError.mockReturnValue(true);

    await controller.updateLibraryDetailsWithId(payload)
  })

  it("Should update lib details with Id", async () => {
    mockValidation.isNullOrWhiteSpace.mockReturnValueOnce(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValueOnce(true);
    mockResult.createError.mockReturnValue(true);

    await controller.updateLibraryDetailsWithId(payload)
  })
});
