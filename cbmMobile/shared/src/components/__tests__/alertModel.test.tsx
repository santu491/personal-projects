import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AlertModel } from '../alertModel/alertModel';

describe('AlertModel Component', () => {
  const defaultProps = {
    modalVisible: true,
    title: 'Test Title',
    subTitle: 'Test Subtitle',
    primaryButtonTitle: 'Primary',
    onHandlePrimaryButton: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<AlertModel {...defaultProps} />);
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Subtitle')).toBeTruthy();
    expect(getByText('Primary')).toBeTruthy();
  });

  it('calls onHandlePrimaryButton when primary button is pressed', () => {
    const { getByText } = render(<AlertModel {...defaultProps} />);
    fireEvent.press(getByText('Primary'));
    expect(defaultProps.onHandlePrimaryButton).toHaveBeenCalled();
  });

  it('renders secondary button when secondaryButtonTitle is provided', () => {
    const props = {
      ...defaultProps,
      secondaryButtonTitle: 'Secondary',
      onHandleSecondaryButton: jest.fn(),
    };
    const { getByText } = render(<AlertModel {...props} />);
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('calls onHandleSecondaryButton when secondary button is pressed', () => {
    const props = {
      ...defaultProps,
      secondaryButtonTitle: 'Secondary',
      onHandleSecondaryButton: jest.fn(),
    };
    const { getByText } = render(<AlertModel {...props} />);
    fireEvent.press(getByText('Secondary'));
    expect(props.onHandleSecondaryButton).toHaveBeenCalled();
  });

  it('renders error icon when isError is true', () => {
    const props = {
      ...defaultProps,
      isError: true,
      errorIndicatorIconColor: 'red',
    };
    const { getByTestId } = render(<AlertModel {...props} />);
    expect(getByTestId('alert.error.icon')).toBeTruthy();
  });

  it('renders success icon when isSuccess is true', () => {
    const props = {
      ...defaultProps,
      isSuccess: true,
    };
    const { getByTestId } = render(<AlertModel {...props} />);
    expect(getByTestId('alert.success.icon')).toBeTruthy();
  });

  it('does not render indicator icon when showIndicatorIcon is false', () => {
    const props = {
      ...defaultProps,
      showIndicatorIcon: false,
    };
    const { queryByTestId } = render(<AlertModel {...props} />);
    expect(queryByTestId('error-icon')).toBeNull();
    expect(queryByTestId('success-icon')).toBeNull();
    expect(queryByTestId('default-icon')).toBeNull();
  });
});
