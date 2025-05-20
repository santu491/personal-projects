import {OpenAPIParam} from 'routing-controllers-openapi';
import {RESPONSE} from '../utils/responseUtil';

export const CreateAppointmentSpec: OpenAPIParam = {
  description: 'Create an appointment for a user',
  requestBody: {
    content: {
      'application/json': {
        example: {
          iamguid: '',
          firstName: '',
          lastName: '',
          dob: '',
          gender: '',
          healthInsuranceCarrier: '',
          email: '',
          phone: '',
          employerType: '',
          groupId: '',
          planName: '',
          clientName: '',
          appointmentType: '',
          memberOptedProvider: undefined,
          isTimingCustomized: false,
          selectedProviders: [],
          clinicalQuestions: '',
        },
      },
    },
  },
  responses: {...RESPONSE},
  parameters: [
    {
      in: 'cookie',
      name: 'secureToken',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
};

export const GetAssessmentRequired: OpenAPIParam = {
  description: 'Get the assessment required status for the user',
  responses: {...RESPONSE},
};

export const GetAppointmentSpec: OpenAPIParam = {
  description: 'Get the appointment details for the user',
  parameters: [
    {
      in: 'cookie',
      name: 'secureToken',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
  responses: {...RESPONSE},
};

export const GetMemberStatus: OpenAPIParam = {
  description: 'Get the member status',
  responses: {...RESPONSE},
  parameters: [
    {
      in: 'cookie',
      name: 'secureToken',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
};

export const GetMemeberDashboardData: OpenAPIParam = {
  description: 'Get the member dashboard data',
  parameters: [
    {
      in: 'query',
      name: 'status',
      required: true,
      schema: {
        type: 'string',
      },
    },
    {
      in: 'cookie',
      name: 'secureToken',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
  responses: {...RESPONSE},
};

export const FetchAppointmentSpec: OpenAPIParam = {
  description: 'Fetch the appointment details for the user',
  responses: {...RESPONSE},
  parameters: [
    {
      in: 'cookie',
      name: 'secureToken',
      required: true,
      schema: {
        type: 'string',
      },
    },
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
};

export const UpdateAppointmentSpec: OpenAPIParam = {
  description: 'Update the appointment details',
  responses: {...RESPONSE},
  parameters: [
    {
      in: 'cookie',
      name: 'secureToken',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
  requestBody: {
    description: 'Update appointment request object',
    required: true,
    content: {
      'application/json': {
        example: {
          id: '5f8b8b5b7e5b4c001f3e3d0b',
          employerType: 'employerType',
          appointmentType: 'appointmentType',
          appointmentDate: '2021-09-01',
          appointmentTime: '10:00',
          appointmentTimezone: 'America/New_York',
          appointmentDuration: 60,
          appointmentNotes: 'appointmentNotes',
          memberNotes: 'memberNotes',
          memberEmail: 'memberEmail',
          memberPhone: 'memberPhone',
          memberFirstName: 'memberFirstName',
          memberLastName: 'memberLastName',
          memberDob: '1980-01-01',
          memberGender: 'member',
        },
      },
    },
  },
};
