import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AppointmentMockContextWrapper } from '../../../__mocks__/appoinmentsMockContextWrapper';
import { NoRequests } from '../noRequests';

const onPressGetStarted = jest.fn();

describe('NoRequests', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <NoRequests onPressGetStarted={onPressGetStarted} />
      </AppointmentMockContextWrapper>
    );
    const title = getByText('appointments.noRequests.title');
    expect(title).toBeDefined();
  });

  it('renders the description correctly', () => {
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <NoRequests onPressGetStarted={onPressGetStarted} />
      </AppointmentMockContextWrapper>
    );
    const description = getByText('appointments.noRequests.description');
    expect(description).toBeDefined();
  });

  it('renders the action button correctly', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <NoRequests onPressGetStarted={onPressGetStarted} />
      </AppointmentMockContextWrapper>
    );
    const actionButton = getByTestId('appointments.find.button');
    expect(actionButton).toBeDefined();
  });

  it('calls onPressGetStarted when action button is pressed', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <NoRequests onPressGetStarted={onPressGetStarted} />
      </AppointmentMockContextWrapper>
    );
    const actionButton = getByTestId('appointments.find.button');
    fireEvent.press(actionButton);
    expect(onPressGetStarted).toHaveBeenCalled();
  });
});
