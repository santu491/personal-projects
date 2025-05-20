import { TranslationLanguage } from "@anthem/communityapi/common";
import { mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from "@anthem/communityapi/logger/mocks/mockILogger";
import { RequestContext } from "@anthem/communityapi/utils";
import { Mockify } from "@anthem/communityapi/utils/mocks/mockify";
import { RecommenededResourcesData } from "api/communityresources/models/searchTermModel";
import { SearchTermService } from "api/communityresources/services/searchTermService";
import { SearchTermController } from "../searchTermController";

describe("AdminController", () => {
  let ctrl: SearchTermController;
  const mockSvc: Mockify<SearchTermService> = {
    getAllSearchTerms: jest.fn(),
    getAllLocalCategoriesByUser: jest.fn(),
    getUserRecommendedResources: jest.fn(),
  };

  beforeEach(() => {
    ctrl = new SearchTermController(
      <any>mockSvc,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRequestContext = jest
    .fn()
    .mockReturnValue(
      '{"name":"~SIT3SBB000008AB","id":"61604cdd33b45d0023d0db61","firstName":"PHOEBE","lastName":"STINSON","active":"true","isDevLogin":"true","iat":1642001503,"exp":1642030303,"sub":"~SIT3SBB000008AB","jti":"bbbf66e5557c0b56cd8747e0cf9942325eef16527e6bb1f331f20131b4565afc66dc3ad5f41e4444baf3db7113eb4019"}'
    );

  it("Should Return sucess with list of search terms", async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            id: "61013eb670dbd030d83c8c5f",
            term: "food",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c60",
            term: "housing",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c61",
            term: "goods",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c62",
            term: "transit",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c63",
            term: "health",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c64",
            term: "money",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c65",
            term: "care",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c66",
            term: "education",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c67",
            term: "work",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c68",
            term: "legal",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
        ],
      },
    };
    mockSvc.getAllSearchTerms.mockReturnValue(expRes);
    const res = await ctrl.getAllSearchTerms(TranslationLanguage.ENGLISH);
    expect(res).toEqual(expRes);
    const data = await ctrl.getAllSearchTerms(null);
    expect(data).toEqual(expRes);
  });

  it("Should Return sucess with list of search terms - Language not defined", async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            id: "61013eb670dbd030d83c8c5f",
            term: "food",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c60",
            term: "housing",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c61",
            term: "goods",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c62",
            term: "transit",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c63",
            term: "health",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c64",
            term: "money",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c65",
            term: "care",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c66",
            term: "education",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c67",
            term: "work",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
          {
            id: "61013eb670dbd030d83c8c68",
            term: "legal",
            createdDate: "2021-07-28T11:25:42.255Z",
          },
        ],
      },
    };
    mockSvc.getAllSearchTerms.mockReturnValue(expRes);
    const res = await ctrl.getAllSearchTerms(null);
    expect(res).toEqual(expRes);
  });

  it("Should Return all local categories by user", async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            id: "61013eb670dbd030d83c8c65",
            category: "care",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c66",
            category: "education",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c5f",
            category: "food",
            isSelected: true,
          },
          {
            id: "61013eb670dbd030d83c8c61",
            category: "goods",
            isSelected: true,
          },
          {
            id: "61013eb670dbd030d83c8c63",
            category: "health",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c60",
            category: "housing",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c68",
            category: "legal",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c64",
            category: "money",
            isSelected: true,
          },
          {
            id: "61013eb670dbd030d83c8c62",
            category: "transit",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c67",
            category: "work",
            isSelected: false,
          },
        ],
      },
    };
    RequestContext.getContextItem = mockRequestContext;
    mockSvc.getAllLocalCategoriesByUser.mockReturnValue(expRes);
    const res = await ctrl.getAllLocalCategoriesByUser(
      TranslationLanguage.ENGLISH
    );
    expect(res).toEqual(expRes);
  });

  it("Should Return all local categories by user - language not defined", async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            id: "61013eb670dbd030d83c8c65",
            category: "care",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c66",
            category: "education",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c5f",
            category: "food",
            isSelected: true,
          },
          {
            id: "61013eb670dbd030d83c8c61",
            category: "goods",
            isSelected: true,
          },
          {
            id: "61013eb670dbd030d83c8c63",
            category: "health",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c60",
            category: "housing",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c68",
            category: "legal",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c64",
            category: "money",
            isSelected: true,
          },
          {
            id: "61013eb670dbd030d83c8c62",
            category: "transit",
            isSelected: false,
          },
          {
            id: "61013eb670dbd030d83c8c67",
            category: "work",
            isSelected: false,
          },
        ],
      },
    };
    RequestContext.getContextItem = mockRequestContext;
    mockSvc.getAllLocalCategoriesByUser.mockReturnValue(expRes);
    const res = await ctrl.getAllLocalCategoriesByUser(null);
    expect(res).toEqual(expRes);
  });

  it("Should Return User Recommended Resources", async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          userId: "60646605a450020007eae236",
          zipcode: 12345,
          resources: [
            {
              title: "Community Resources",
              count: 3,
              children: [
                {
                  id: "5f0e744536b382377497ecef",
                  name: "Anal Cancer",
                  count: "150",
                },
                {
                  id: "5f369ba97b79ea14f85fb0ec",
                  name: "Metastatic or Recurrent Breast Cancer",
                  count: "150",
                },
                {
                  id: "60e2e7277c37b43a668a32f2",
                  name: "Parenting",
                  count: "36",
                },
              ],
            },
            {
              title: "SDOH Resources",
              count: 3,
              children: [
                {
                  id: "61013eb670dbd030d83c8c5f",
                  name: "food",
                  count: "29",
                },
                {
                  id: "61013eb670dbd030d83c8c61",
                  name: "goods",
                  count: "20",
                },
                {
                  id: "61013eb670dbd030d83c8c64",
                  name: "money",
                  count: "11",
                },
              ],
            },
          ],
        },
      },
    };
    RequestContext.getContextItem = mockRequestContext;
    let zipcode = 12345;
    let resource = {
      communities: [
        "Anal Cancer",
        "Metastatic or Recurrent Breast Cancer",
        "Parenting",
      ],
      localResources: ["food", "goods", "money"],
      language: TranslationLanguage.ENGLISH,
      resources: undefined
    };

    mockSvc.getUserRecommendedResources.mockReturnValue(expRes);
    const res = await ctrl.getUserRecommendedResources(
      zipcode,
      resource as RecommenededResourcesData
    );
    expect(res).toEqual(expRes);
  });

  it("Should Return User Recommended Resources - language not defined", async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          userId: "60646605a450020007eae236",
          zipcode: 12345,
          resources: [
            {
              title: "Community Resources",
              count: 3,
              children: [
                {
                  id: "5f0e744536b382377497ecef",
                  name: "Anal Cancer",
                  count: "150",
                },
                {
                  id: "5f369ba97b79ea14f85fb0ec",
                  name: "Metastatic or Recurrent Breast Cancer",
                  count: "150",
                },
                {
                  id: "60e2e7277c37b43a668a32f2",
                  name: "Parenting",
                  count: "36",
                },
              ],
            },
            {
              title: "SDOH Resources",
              count: 3,
              children: [
                {
                  id: "61013eb670dbd030d83c8c5f",
                  name: "food",
                  count: "29",
                },
                {
                  id: "61013eb670dbd030d83c8c61",
                  name: "goods",
                  count: "20",
                },
                {
                  id: "61013eb670dbd030d83c8c64",
                  name: "money",
                  count: "11",
                },
              ],
            },
          ],
        },
      },
    };
    RequestContext.getContextItem = mockRequestContext;
    let zipcode = 12345;
    let resource = {
      communities: [
        "Anal Cancer",
        "Metastatic or Recurrent Breast Cancer",
        "Parenting",
      ],
      localResources: ["food", "goods", "money"],
      language: null,
      resources: undefined
    };

    mockSvc.getUserRecommendedResources.mockReturnValue(expRes);
    const res = await ctrl.getUserRecommendedResources(
      zipcode,
      resource as RecommenededResourcesData
    );
    expect(res).toEqual(expRes);
  });

  it("Should Return Error For Null Zipcode", async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: "3831b1dd-2295-e6da-cf64-ca8affdfeda5",
            errorCode: 400,
            title: "No zipcode",
            detail: "Zipcode is not provided",
          },
        ],
      },
    };
    RequestContext.getContextItem = mockRequestContext;
    let zipcode = null;
    let resource = {
      communities: [
        "Anal Cancer",
        "Metastatic or Recurrent Breast Cancer",
        "Parenting",
      ],
      localResources: ["food", "goods", "money"],
      language: TranslationLanguage.ENGLISH,
      resources: undefined
    };

    mockResult.createError.mockReturnValue(expRes)
    const res = await ctrl.getUserRecommendedResources(
      zipcode,
      resource as RecommenededResourcesData
    );
    expect(res).toEqual(expRes);
  });
});
