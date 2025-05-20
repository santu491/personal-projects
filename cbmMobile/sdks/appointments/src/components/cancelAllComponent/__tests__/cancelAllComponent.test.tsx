import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AppointmentMockContextWrapper } from '../../../__mocks__/appoinmentsMockContextWrapper';
import { CancelAllComponent } from '../cancelAllComponent';

const onHandleCancelAll = jest.fn();

describe('cancelAllComponent', () => {
  it('renders the description correctly', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <CancelAllComponent onHandleCancelAll={onHandleCancelAll} />
      </AppointmentMockContextWrapper>
    );
    const title = getByTestId('appointments.pending.cancelDescription');
    expect(title).toBeDefined();
  });

  it('renders the action button correctly', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <CancelAllComponent onHandleCancelAll={onHandleCancelAll} />
      </AppointmentMockContextWrapper>
    );
    const actionButton = getByTestId('appointments.appointmentDetails.cancel');
    expect(actionButton).toBeDefined();
  });

  it('calls onHandleCancelAll when action button is pressed', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <CancelAllComponent onHandleCancelAll={onHandleCancelAll} />
      </AppointmentMockContextWrapper>
    );
    const actionButton = getByTestId('appointments.appointmentDetails.cancel');
    fireEvent.press(actionButton);
    expect(onHandleCancelAll).toHaveBeenCalled();
  });
});
