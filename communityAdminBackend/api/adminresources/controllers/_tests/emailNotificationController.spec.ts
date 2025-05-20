import { mockEmailNotificationFunction, mockResult, mockValidation } from "@anthem/communityadminapi/common/baseTest";
import { EmailNotificationController } from "../emailNotificationController";

describe('AdminUserController', () => {
  let controller: EmailNotificationController;

  const scAdmin = {
    "role": "scadmin"
  };

  beforeEach(() => {
    controller = new EmailNotificationController(<any>mockResult, <any>mockEmailNotificationFunction, <any>mockValidation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should trigger the mass email to users: success', async () => {
    const expRes = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": [
          {
            "isPersona": true
          }
        ]
      }
    }
    mockValidation.checkUserIdentity.mockReturnValue(scAdmin);
    mockEmailNotificationFunction.triggerMassEmail.mockReturnValue(expRes);
    const data = await controller.privacyEmailNotification();
    expect(data).toEqual(expRes);
  });

  it('Should trigget the mass email to users: Error', async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    await controller.privacyEmailNotification();
  });

  it("Should return email Info", async () => {
    mockEmailNotificationFunction.touMassEmailInfo.mockReturnValue(true);
    controller.touMassEmailInfo();
  })

  it("Should return email Info", async () => {
    mockEmailNotificationFunction.touMassEmailInfo.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    controller.touMassEmailInfo();
  })
});
