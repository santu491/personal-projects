import { RequestCurrentStatus } from '../models/appointments';

export const mockSelectedProvidersData = [
  {
    providerId: '1',
    appointmentId: '123',
    currentStatus: RequestCurrentStatus.ACCEPTED,
    isNewTimeProposed: false,
    distance: '10',
    providerPrefferedDateAndTime: '2023-10-10T10:00:00Z',
    memberApprovedTimeForEmail: '10:00',
    firstName: 'John',
    lastName: 'Doe',
    title: 'Dr.',
    providerType: 'General',
    clinicalQuestions: { questionnaire: [{ presentingProblem: 'Headache' }] },
  },
];

export const mockSelectedProvidersListData = [
  {
    providerId: '1',
    currentStatus: RequestCurrentStatus.APPROVED,
    distance: 10,
    providerType: 'Type1',
    firstName: 'John',
    lastName: 'Doe',
    title: 'Dr.',
    dateOfInitiation: '',
    isNewTimeProposed: false,
    providerPrefferedDateAndTime: '2023-01-02T10:00:00Z',
  },
];
