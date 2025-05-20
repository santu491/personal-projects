import { mockMongo, mockResult } from "@anthem/communityadminapi/common/baseTest";
import { mockILogger } from "@anthem/communityadminapi/logger/mocks/mockILogger";
import { PartnersService } from "../partnersService";

describe('PartnersService', () => {
  let service: PartnersService;

  beforeEach(() => {
    service = new PartnersService(<any>mockResult, <any>mockMongo, <any>mockILogger)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createPartner - success with image file', async () => {
    const partnerId = "63dbce32dfb6140a07c9ae90";
    const expectedResult = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": {
          "title": "March of Dimes",
          "logoImage": "base64 images",
          "active": true,
          "id": partnerId
        }
      }
    };
    const input = {
      "title": "March of Dimes",
      "logoImage": "base64 images",
      "active": true
    };
    mockMongo.insertValue.mockReturnValue({
      ...expectedResult.data.value,
      _id: partnerId
    });
    mockResult.createSuccess.mockReturnValue(expectedResult);
    const actualResult = await service.createPartner(input);
    expect(expectedResult).toBe(actualResult);
  });

  it('getPartners - should return all partners', async () => {
    const expectedResult = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": [
          {
            "title": "March of Dimes 2",
            "logoImage": "https://d3w18b4j7q8gb5.cloudfront.net/716370774.jpg",
            "id": "63dbc4d6d2064346d31e5433"
          },
          {
            "title": "March of Dimes",
            "logoImage": "https://d3w18b4j7q8gb5.cloudfront.net/716370774.jpg",
            "id": "63dbc0535fe9ae266803d942"
          }
        ]
      }
    };
    mockResult.createSuccess.mockReturnValue(expectedResult);
    await service.getPartners(false);
    expect(mockMongo.readAll.mock.calls.length).toBe(1);
  });

  it('getPartners - should return active partners', async () => {
    const expectedResult = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": [
          {
            "title": "March of Dimes 2",
            "logoImage": "https://d3w18b4j7q8gb5.cloudfront.net/716370774.jpg",
            "id": "63dbc4d6d2064346d31e5433"
          },
          {
            "title": "March of Dimes",
            "logoImage": "https://d3w18b4j7q8gb5.cloudfront.net/716370774.jpg",
            "id": "63dbc0535fe9ae266803d942"
          }
        ]
      }
    };
    mockResult.createSuccess.mockReturnValue(expectedResult);
    await service.getPartners(true);
    expect(mockMongo.readAllByValue.mock.calls.length).toBe(1);
  });

  it('createPartner - success with image link', async () => {
    const partnerId = "63dbce32dfb6140a07c9ae90";
    const expectedResult = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": {
          "title": "March of Dimes edited",
          "logoImage": "base64",
          "active": true,
          "id": partnerId
        }
      }
    };
    const input = {
      "title": "March of Dimes edited",
      "logoImage": "base64",
      "active": true
    };
    mockMongo.updateByQuery.mockReturnValue(1);
    mockMongo.readByID.mockReturnValue({
      ...input,
      "title": "March of Dimes"
    });
    mockResult.createSuccess.mockReturnValue(expectedResult);
    const actualResult = await service.updatePartner(partnerId, input);
    expect(expectedResult).toBe(actualResult);
    expect(mockMongo.readByID.mock.calls.length).toBe(1);
  });

  it('createPartner - error for Id', async () => {
    const partnerId = "63dbce32dfb6140a07c9ae90";
    const expectedResult = {
      "data": {
        "isSuccess": false,
        "isException": false,
        "errors": [
          {
            "errorCode": 400,
            "title": "Bad data",
            "detail": "Incorrect id"
          }
        ]
      }
    };
    const input = {
      "title": "March of Dimes",
      "logoImage": "base64",
      "active": true
    };
    mockMongo.readByID.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expectedResult);
    const actualResult = await service.updatePartner(partnerId, input);
    expect(expectedResult).toBe(actualResult);
    expect(mockMongo.readByID.mock.calls.length).toBe(1);
  });

  it('getPartnerById - success', async () => {
    mockMongo.readByID.mockReturnValue({
      id: 'partnerId',
      title: 'mod',
      logoImage: 'base64 image'
    })
    await service.getPartnerById('partnerId');
    expect(mockMongo.readByID.mock.calls.length).toBe(1);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('getPartnerById - error', async () => {
    mockMongo.readByID.mockReturnValue(null)
    await service.getPartnerById('partnerId');
    expect(mockMongo.readByID.mock.calls.length).toBe(1);
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });
});
