import { mockPartnersSvc, mockResult, mockValidation } from "@anthem/communityadminapi/common/baseTest";
import { PartnersController } from "../partnersController";

describe('PartnersController', () => {
  let controller: PartnersController;

  beforeEach(() => {
    controller = new PartnersController(<any>mockResult, <any>mockValidation, <any>mockPartnersSvc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('addPartners - success', async () => {
    const expectedResult = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": {
          "title": "March of Dimes",
          "imageLink": "https://d3w18b4j7q8gb5.cloudfront.net/716370774.jpg",
          "id": "63dbc4d6d2064346d31e5433"
        }
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockPartnersSvc.createPartner.mockReturnValue(expectedResult);
    const actualResult = await controller.addPartners({
      title: "March of Dimes",
      logoImage: "https://d3w18b4j7q8gb5.cloudfront.net/716370774.jpg",
      active: true
    });
    expect(actualResult).toBe(expectedResult);
  });

  it('addPartners - error', async () => {
    const expectedResult = {
      "data": {
        "isSuccess": false,
        "isException": false,
        "errors": [
            {
                "errorCode": 400,
                "title": "Bad data",
                "detail": "Incorrect Model"
            }
        ]
    }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expectedResult);
    const actualResult = await controller.addPartners({
      title: "   ",
      logoImage: "https://d3w18b4j7q8gb5.cloudfront.net/716370774.jpg",
      active: true
    });
    expect(actualResult).toBe(expectedResult);
  });

  it('getPartners - success', async () => {
    const expectedResult = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": [
          {
            "title": "March of Dimes 2",
            "imageLink": "https://d3w18b4j7q8gb5.cloudfront.net/716370774.jpg",
            "id": "63dbc4d6d2064346d31e5433"
          },
          {
            "title": "March of Dimes",
            "imageLink": "https://d3w18b4j7q8gb5.cloudfront.net/716370774.jpg",
            "id": "63dbc0535fe9ae266803d942"
          }
        ]
      }
    };
    mockPartnersSvc.getPartners.mockReturnValue(expectedResult);
    const actualResult = await controller.getPartners(true);
    expect(actualResult).toBe(expectedResult);
  });

  it('updatePartner - success', async () => {
    const expectedResult = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": true
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockPartnersSvc.updatePartner.mockReturnValue(expectedResult);
    const actualResult = await controller.updatePartner(
      "63dbc4d6d2064346d31e5433",
      {
        title: "March of Dimes",
        logoImage: "https://d3w18b4j7q8gb5.cloudfront.net/716370774.jpg",
        active: false
      });
    expect(actualResult).toBe(expectedResult);
  });

  it('updatePartner - error', async () => {
    const expectedResult = {
      "data": {
        "isSuccess": false,
        "isException": false,
        "errors": [
          {
            "errorCode": 400,
            "title": "Bad data",
            "detail": "Incorrect Model"
          }
        ]
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expectedResult);
    const actualResult = await controller.updatePartner(
      "63dbc4d6d2064346d31e5433",
      {
        title: "   ",
        logoImage: "https://d3w18b4j7q8gb5.cloudfront.net/716370774.jpg",
        active: false
      });
    expect(actualResult).toBe(expectedResult);
  });

  it('getPartnerById - fail', async () => {
    mockValidation.isHex.mockReturnValue(false);
    await controller.getPartnerById('communityId');
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  it('getPartnerById - success', async () => {
    mockValidation.isHex.mockReturnValue(true);
    await controller.getPartnerById('communityId');
    expect(mockPartnersSvc.getPartnerById.mock.calls.length).toBe(1);
  });
});
