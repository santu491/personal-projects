import { mockLogger, mockMongo, mockResult } from '@anthem/communityadminapi/common/baseTest';
import { AdminUserService } from '../adminUserService';

describe('adminUserService', () => {
  let service: AdminUserService;

  beforeEach(() => {
    service = new AdminUserService(<any>mockMongo, <any>mockResult, <any>mockLogger)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const expRes = {
    "data": {
      "isSuccess": true,
      "isException": false,
      "value": [
        {
          "username": "",
          "createdAt": "2022-08-22T12:27:38.516Z",
          "updatedAt": "2022-08-22T12:27:38.516Z",
          "role": "scadvocate",
          "firstName": "Julia",
          "lastName": "H",
          "aboutMe": "",
          "displayName": "Julia",
          "displayTitle": "Community Advocate",
          "interests": "",
          "location": "",
          "profileImage": "",
          "communities": [
            "6214e8959aa982c0d09b40f5"
          ],
          "active": true,
          "isPersona": true,
          "id": "6303763a02e508eba10872d1"
        },
        {
          "username": "",
          "createdAt": "2022-08-22T12:27:38.516Z",
          "updatedAt": "2022-08-22T12:27:38.516Z",
          "role": "scadvocate",
          "firstName": "Amelia",
          "lastName": "A",
          "aboutMe": "",
          "displayName": "Amelia",
          "displayTitle": "Community Advocate",
          "interests": "",
          "location": "",
          "profileImage": "",
          "communities": [
            "607e7c99d0a2b533bb2ae3d2"
          ],
          "active": true,
          "isPersona": true,
          "id": "6303763a02e508eba10872d2"
        },
        {
          "username": "",
          "createdAt": "2022-08-22T12:27:38.516Z",
          "updatedAt": "2022-08-22T12:27:38.516Z",
          "role": "scadvocate",
          "firstName": "Omar",
          "lastName": "H",
          "aboutMe": "",
          "displayName": "Amelia",
          "displayTitle": "Community Advocate",
          "interests": "",
          "location": "",
          "profileImage": "",
          "communities": [
            "60a358bc9c336e882b19bbf0"
          ],
          "active": true,
          "isPersona": true,
          "id": "6303763a02e508eba10872d3"
        }
      ]
    }
  };

  it('Should Return Persona: Success', async () => {
    mockMongo.readAllByValue.mockReturnValue(expRes);
    mockResult.createSuccess.mockReturnValue(expRes);

    const data = await service.getPersona();
    expect(data).toEqual(expRes);
  });

  it('Should Return Persona: Empty error', async () => {
    mockMongo.readAllByValue.mockReturnValue([]);
    mockResult.createError.mockReturnValue(true);
    await service.getPersona();
  });

  it('Should Return Persona: Ecxeption', async () => {
    mockMongo.readAllByValue.mockImplementation(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await service.getPersona();
  });

});
