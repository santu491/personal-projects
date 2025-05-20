import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { callNumber } from '../../utils/utils';
import { FullScreenError } from '../fullScreenError/fullScreenError';

jest.mock('../../utils/utils', () => ({
  callNumber: jest.fn(),
}));

describe('FullScreenError', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<FullScreenError />);

    expect(getByText('errors.fullScreenError.title')).toBeTruthy();
    expect(getByText('credibleMind.immediateAssistance.phoneNumber')).toBeTruthy();
    expect(getByText('errors.fullScreenError.primaryButton')).toBeTruthy();
  });

  it('renders correctly with custom props', () => {
    const { getByText } = render(
      <FullScreenError title="Custom Title" description="Custom Description" buttonTitle="Custom Button" />
    );

    expect(getByText('Custom Title')).toBeTruthy();
    expect(getByText('Custom Button')).toBeTruthy();
  });

  it('calls onPressTryAgain when button is pressed', () => {
    const onPressTryAgainMock = jest.fn();
    const { getByText } = render(<FullScreenError onPressTryAgain={onPressTryAgainMock} />);

    fireEvent.press(getByText('errors.fullScreenError.primaryButton'));
    expect(onPressTryAgainMock).toHaveBeenCalled();
  });

  it('calls callNumber when phone number is pressed', () => {
    const { getByText } = render(<FullScreenError />);

    fireEvent.press(getByText('credibleMind.immediateAssistance.phoneNumber'));
    expect(callNumber).toHaveBeenCalledWith('1-888-445-4436');
  });
});
