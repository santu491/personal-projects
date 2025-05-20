import { mockMongo, mockResult } from "@anthem/communityapi/common/baseTest";
import { Admin } from "api/communityresources/models/adminUserModel";
import { AdminService } from "../adminService";

describe('AdminService', () => {
  const admin: Admin = {
    id: "",
    createdAt: undefined,
    updatedAt: undefined,
    role: "",
    username: "",
    category: "",
    firstName: "",
    lastName: "",
    displayName: "",
    displayTitle: "",
    profileImage: "",
    password: ""
  }

  let service;
  beforeEach(() => {
    service = new AdminService(<any>mockMongo, <any>mockResult);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Get Admin Profile
  it("Should return the Admin details: Success", async () => {
    mockMongo.readByID.mockReturnValue(admin);
    mockResult.createSuccess.mockReturnValue(admin);
    service.getAdminProfile('userId');
  })

  it("Should return the Admin details: User not found", async () => {
    mockMongo.readByID.mockReturnValue(null);
    mockResult.createError.mockReturnValue(true);
    service.getAdminProfile('userId');
  })


  it("Should return the Admin details: Exception", async () => {
    mockMongo.readByID.mockImplementation(() => {
      throw new Error();
    })
    mockResult.createException.mockReturnValue(true);
    service.getAdminProfile('userId');
  })

  // Get Admin Image
  it("Should return the Admin Image: Success", async () => {
    mockMongo.readByValue.mockReturnValue(admin);
    mockResult.createSuccess.mockReturnValue(admin);
    service.getAdminImage('userId');
  })

  it("Should return the Admin Image: Image not found", async () => {
    mockMongo.readByValue.mockReturnValue(null);
    mockResult.createError.mockReturnValue(true);
    service.getAdminImage('userId');
  })


  it("Should return the Admin Image: Exception", async () => {
    mockMongo.readByValue.mockImplementation(() => {
      throw new Error();
    })
    mockResult.createException.mockReturnValue(true);
    service.getAdminImage('userId');
  })


});
