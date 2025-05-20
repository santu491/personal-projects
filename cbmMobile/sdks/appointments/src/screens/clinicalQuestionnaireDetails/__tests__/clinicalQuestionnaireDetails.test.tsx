/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { AppointmentMockContextWrapper } from '../../../__mocks__/appoinmentsMockContextWrapper';
import { ClinicalQuestionnaireDetails } from '../clinicalQuestionnaireDetails';

jest.mock('../../../../../../src/util/commonUtils');

describe('ClinicalQuestionnaireDetails', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('renders without crashing', () => {
    render(
      <AppointmentMockContextWrapper>
        <ClinicalQuestionnaireDetails />
      </AppointmentMockContextWrapper>
    );
  });

  it('displays the main header component', () => {
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <ClinicalQuestionnaireDetails />
      </AppointmentMockContextWrapper>
    );
    expect(getByText('credibleMind.immediateAssistance.crisisSupport')).toBeTruthy();
  });

  it('displays the member profile header with correct title', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <ClinicalQuestionnaireDetails />
      </AppointmentMockContextWrapper>
    );
    expect(getByTestId('appointments.appointmentDetails.clinicalQuestionnaire')).toBeTruthy();
  });

  it('displays clinical questionnaire details when clinicalInfo is available', () => {
    const mockDetails = [
      { question: 'Question 1', answer: 'Answer 1' },
      { question: 'Question 2', answer: 'Answer 2' },
    ];
    jest.spyOn(require('../useClinicalQuestionnaireDetails'), 'useClinicalQuestionnaireDetails').mockReturnValue({
      clinicalQuestionnaireDetails: mockDetails,
      clinicalInfo: true,
    });

    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <ClinicalQuestionnaireDetails />
      </AppointmentMockContextWrapper>
    );

    expect(getByText('Question 1')).toBeTruthy();
    expect(getByText('Answer 1')).toBeTruthy();
    expect(getByText('Question 2')).toBeTruthy();
    expect(getByText('Answer 2')).toBeTruthy();
  });

  it('displays NoRequests component when clinicalInfo is not available', () => {
    jest.spyOn(require('../useClinicalQuestionnaireDetails'), 'useClinicalQuestionnaireDetails').mockReturnValue({
      clinicalQuestionnaireDetails: [],
      clinicalInfo: false,
    });

    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <ClinicalQuestionnaireDetails />
      </AppointmentMockContextWrapper>
    );

    expect(getByText('appointments.noRequests.title')).toBeTruthy();
  });
});
