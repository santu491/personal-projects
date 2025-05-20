import { mockLogger, mockMongo, mockResult } from "@anthem/communityadminapi/common/baseTest";
import { LibSectionService } from "../libSectionService";

describe('Lib Section Service', () => {
  let service: LibSectionService;

  beforeEach(() => {
    service = new LibSectionService(<any>mockResult, <any>mockMongo, <any>mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('editSectionDetails - success', async () => {
    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        value: true
      }
    };
    mockMongo.readAll.mockReturnValue([
      {
        content: {
          helpfulInfo: '1.0.0'
        }
      }
    ]);
    mockMongo.updateByQuery.mockReturnValueOnce(1).mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expected);

    const actual = await service.editSectionDetails({
      sectionIndex: 1,
      communityId: 'communityId',
      subSectionId: undefined,
      subSectionIndex: undefined,
      en: {
        title: 'Title',
        description: 'Description',
        content: [],
        type: '',
        backgroundColor: '',
        sectionId: "",
        subSection: []
      },
      es: {
        title: 'Title',
        description: 'Description',
        content: [],
        type: '',
        backgroundColor: '',
        sectionId: "",
        subSection: []
      }
    });

    expect(actual).toBe(expected);
  });

  it('editSunSectionDetails - success for section without bucket', async () => {
    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        value: true
      }
    };
    mockMongo.readAll.mockReturnValue([
      {
        content: {
          helpfulInfo: '1.0.0'
        }
      }
    ]);
    mockMongo.updateByQuery.mockReturnValueOnce(1).mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expected);

    const actual = await service.editSubSectionDetails({
      sectionIndex: 1,
      communityId: 'communityId',
      subSectionId: undefined,
      subSectionIndex: 1,
      en: {
        title: 'Title',
        description: 'Description',
        content: [],
        type: '',
        backgroundColor: '',
        sectionId: "",
        subSection: []
      },
      es: {
        title: 'Title',
        description: 'Description',
        content: [],
        type: '',
        backgroundColor: '',
        sectionId: "",
        subSection: []
      }
    });

    expect(actual).toBe(expected);
  });

  it('editSunSectionDetails - success for section with bucket', async () => {
    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        value: true
      }
    };
    mockMongo.readAll.mockReturnValue([
      {
        content: {
          helpfulInfo: '1.0.0'
        }
      }
    ]);
    mockMongo.updateByQuery.mockReturnValueOnce(1).mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expected);

    const actual = await service.editSubSectionDetails({
      sectionIndex: 1,
      communityId: 'communityId',
      subSectionId: 'subSectionId',
      subSectionIndex: 1,
      en: {
        title: 'Title',
        description: 'Description',
        content: [],
        type: '',
        backgroundColor: '',
        sectionId: "",
        subSection: []
      },
      es: {
        title: 'Title',
        description: 'Description',
        content: [],
        type: '',
        backgroundColor: '',
        sectionId: "",
        subSection: []
      }
    });

    expect(actual).toBe(expected);
  });
});
