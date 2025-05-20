import {OpenAPIParam} from 'routing-controllers-openapi';
import {RESPONSE} from '../utils/responseUtil';

export const MemberLookupSpec: OpenAPIParam = {
  summary: 'Get member lookup status',
  description: 'Get member lookup status',
  tags: ['Member Profile'],
  responses: {...RESPONSE},
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
    {
      name: 'userName',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
};

export const MemberProfileSpec: OpenAPIParam = {
  summary: 'Create a member profile',
  description: 'Create a member profile',
  tags: ['Member Profile'],
  responses: {...RESPONSE},
  requestBody: {
    content: {
      'application/json': {
        example: {
          employerType: 'employerType',
          userRole: 'userRole',
          firstName: 'firstName',
          lastName: 'lastName',
          dob: 'dob',
        },
      },
    },
  },
};

export const AuthenticateMemberProfileSpec: OpenAPIParam = {
  summary: 'Authenticate member profile',
  description: 'Authenticate member profile',
  tags: ['Member Profile'],
  responses: {...RESPONSE},
  requestBody: {
    content: {
      'application/json': {
        example: {
          userName: 'userName',
        },
      },
    },
  },
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
    {
      name: 'cookie',
      in: 'header',
      required: false,
      schema: {type: 'string'},
    },
  ],
};

export const InvalidateMemberSession: OpenAPIParam = {
  summary: 'Invalidate member session',
  description: 'Invalidate member session',
  tags: ['Member Profile'],
  responses: {...RESPONSE},
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
};

export const RemoveMemberProfile: OpenAPIParam = {
  summary: 'Delete a member profile',
  description: 'Delete a member profile',
  tags: ['Member Profile'],
  responses: {...RESPONSE},
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
};

export const SetMemberProfileStatus: OpenAPIParam = {
  summary: 'Set the status of a user',
  description: 'Set the status of a user',
  tags: ['Member Profile'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
    {
      name: 'iamguid',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
    {
      name: 'status',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
    {
      name: 'clientName',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
};

export const GetMemberContactDetails: OpenAPIParam = {
  summary: 'Get member contact details',
  description: 'Get member contact details',
  tags: ['Member Profile'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
    {
      name: 'userName',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
    {
      name: 'isEmailVerified',
      in: 'query',
      required: false,
      schema: {type: 'boolean'},
    },
  ],
};

export const GetMemberProfile: OpenAPIParam = {
  summary: 'Get member profile',
  description: 'Get member profile',
  tags: ['Member Profile'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
};

export const UpdateMemberProfile: OpenAPIParam = {
  summary: 'Update member profile',
  description: 'Update member profile',
  tags: ['Member Profile'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
    {
      name: 'secureToken',
      in: 'cookie',
      required: true,
      schema: {type: 'string'},
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        example: {
          iamguid: 'iamguid',
          employerType: 'type',
          communication: 'communication',
        },
      },
    },
    required: true,
  },
};

export const SendOTP: OpenAPIParam = {
  summary: 'Send OTP to the user',
  description: 'Send OTP to the user',
  tags: ['MFA'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
  requestBody: {
    description: 'Send OTP to the user',
    required: true,
    content: {
      'application/json': {
        example: {
          channel: 'email',
          userName: 'userName',
          pingRiskId: 'XXXX-XXXX-XXXX',
        },
      },
    },
  },
};

export const ValidateOTP: OpenAPIParam = {
  summary: 'Validate OTP',
  description: 'Validate OTP',
  tags: ['MFA'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
  requestBody: {
    description: 'Validate OTP',
    required: true,
    content: {
      'application/json': {
        example: {
          otp: '323020',
          rememberDevice: 'N',
          userName: 'testingcbhm09@mail.com',
          pingRiskId: '3f5793f0-9e2e-4735-80f4-0f94173e6bbe',
          pingDeviceId: 'd245a0ab-590a-4598-9f8d-b2fec8452ca4',
          pingUserId: '81cd1b94-3d25-46f5-ba21-838f7450db85',
          flowName: 'forgotPassword',
        },
      },
    },
  },
};

export const forgotPassword: OpenAPIParam = {
  summary: 'Forgot Password',
  description: 'Forgot Password',
  tags: ['MFA'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
  requestBody: {
    description: 'Forgot Password',
    required: true,
    content: {
      'application/json': {
        example: {
          channel: 'email',
          userName: 'userName',
          dob: 'dob',
          email: 'email',
        },
      },
    },
  },
};

export const UpdatePassword: OpenAPIParam = {
  summary: 'Change Password',
  description: 'Change Password',
  tags: ['MFA'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
    {
      name: 'cookie',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
  requestBody: {
    description: 'Change Password',
    required: true,
    content: {
      'application/json': {
        example: {
          userName: 'userName',
        },
      },
    },
  },
};

export const forgotUserName: OpenAPIParam = {
  summary: 'Forgot UserName',
  description: 'Forgot UserName',
  tags: ['MFA'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
  requestBody: {
    description: 'Forgot UserName',
    required: true,
    content: {
      'application/json': {
        example: {
          channel: 'email',
          userName: 'userName',
          dob: 'dob',
          email: 'email',
        },
      },
    },
  },
};

export const RememberDeviceSpec: OpenAPIParam = {
  summary: 'Remember Device',
  description: 'Remember Device',
  tags: ['MFA'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
    {
      name: 'secureToken',
      in: 'cookie',
      required: true,
      schema: {type: 'string'},
    },
  ],
};

export const FetchMemberPreferences: OpenAPIParam = {
  summary: 'Fetch member details',
  description: 'Fetch member details',
  tags: ['Member Profile'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
};

export const ValidateMemberOAuthPayloadSpec: OpenAPIParam = {
  summary: 'Save member preferences',
  description: 'Save member preferences',
  tags: ['Member Profile'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
  requestBody: {
    description: 'Member preferences',
    required: true,
    content: {
      'application/json': {
        example: {
          pushNotifications: {
            isEnabled: true,
            topics: true,
          },
        },
      },
    },
  },
};

export const RefreshAuthSpec: OpenAPIParam = {
  summary: 'Refresh member authentication',
  description: 'Refresh member authentication',
  tags: ['Member Profile'],
  responses: RESPONSE,
  parameters: [
    {
      name: 'source',
      in: 'header',
      required: true,
      schema: {type: 'string'},
    },
  ],
};
