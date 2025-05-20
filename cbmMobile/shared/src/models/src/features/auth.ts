export interface Address {
  addressOne: string;
  addressTwo: string;
  city: string;
  state: string;
  stateCode: string;
  zipcode: string;
}

export interface Communication {
  consent: boolean;
  mobileNumber: string;
}

export interface ProfileData {
  address?: Address;
  clientGroupId: string;
  clientName: string;
  communication: Communication;
  departmentName: string;
  dob: string;
  emailAddress: string;
  empStatus: string;
  employerType: string;
  firstName: string;
  gender: string;
  groupName: string;
  iamguid: string;
  id: string;
  isEmailVerified: boolean;
  jobTitle: string;
  lastLoginDateTime: string;
  lastName: string;
  notificationCount: number;
  pingRiskId: string;
  relStatus: string;
  userRole: string;
  userType: string;
}
