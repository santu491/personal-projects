import { mockAdminUserService, mockResult, mockValidation } from "@anthem/communityadminapi/common/baseTest";
import { AdminUserController } from '../adminUserController';

describe('AdminUserController', () => {
  let controller: AdminUserController;

  const scAdmin = {
    "role": "scadmin"
  };

  const admin = {
    "role": "scadvocate"
  };

  beforeEach(() => {
    controller = new AdminUserController(<any>mockResult, <any>mockValidation, <any>mockAdminUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return Personal Users: success', async () => {
    const expRes = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": [
          {
            "username": "",
            "isPersona": true
          }
        ]
      }
    }
    mockValidation.checkUserIdentity.mockReturnValue(scAdmin);
    mockAdminUserService.getPersona.mockReturnValue(expRes);
    const resp = await controller.getPersona(false);

    expect(resp).toEqual(expRes);
  });

  it('Should Return Personal Users: User validity Error', async () => {
    const expRes = {
      "data": {
        "isSuccess": false,
        "isException": true,
        "error": [
          {
            "title": "Bad Data",
            "detail": "Not allowed"
          }
        ]
      }
    }
    mockValidation.checkUserIdentity.mockReturnValue(admin);
    mockResult.createError.mockReturnValue(expRes);
    await controller.getPersona(false);
  });

  it('Should Return Personal Users: Exception', async () => {

    mockValidation.checkUserIdentity.mockImplementationOnce(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    await controller.getPersona(false);
  });
});
