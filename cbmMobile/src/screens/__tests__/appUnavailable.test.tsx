import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AppStatus } from '../appInit/appInitContext';
import { AppUnavailable } from '../appUnavailable/appUnavailable';
import { useAppUnavailable } from '../appUnavailable/useAppUnavailable';

jest.mock('../appUnavailable/useAppUnavailable');

describe('AppUnavailable', () => {
  const mockUseAppUnavailable = useAppUnavailable as jest.Mock;

  beforeEach(() => {
    mockUseAppUnavailable.mockReturnValue({
      appUnavailableErrorContext: {
        header: 'Error Header',
        body: 'Error Message',
        preventReload: false,
        buttons: [],
      },
      reloadApp: jest.fn(),
      appStatus: AppStatus.ERROR,
    });
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<AppUnavailable />);
    expect(getByTestId('splash-header-icon')).toBeTruthy();
    expect(getByText('Error Header')).toBeTruthy();
    expect(getByText('Error Message')).toBeTruthy();
  });

  it('calls reloadApp when retry button is pressed', () => {
    const reloadAppMock = jest.fn();
    mockUseAppUnavailable.mockReturnValueOnce({
      appUnavailableErrorContext: {
        header: 'Error Header',
        body: 'Error Message',
        preventReload: false,
        buttons: [],
      },
      reloadApp: reloadAppMock,
      appStatus: AppStatus.ERROR,
    });

    const { getByTestId } = render(<AppUnavailable />);
    fireEvent.press(getByTestId('coldstate.appUnavailable.reloadButton'));
    expect(reloadAppMock).toHaveBeenCalled();
  });

  it('does not show retry button when preventReload is true', () => {
    mockUseAppUnavailable.mockReturnValueOnce({
      appUnavailableErrorContext: {
        header: 'Error Header',
        body: 'Error Message',
        preventReload: true,
        buttons: [],
      },
      reloadApp: jest.fn(),
      appStatus: AppStatus.ERROR,
    });

    const { queryByTestId } = render(<AppUnavailable />);
    expect(queryByTestId('coldstate.appUnavailable.reloadButton')).toBeNull();
  });

  it('renders additional buttons if provided', () => {
    const buttonProps = { title: 'Extra Button', onPress: jest.fn() };
    mockUseAppUnavailable.mockReturnValueOnce({
      appUnavailableErrorContext: {
        header: 'Error Header',
        body: 'Error Message',
        preventReload: false,
        buttons: [buttonProps],
      },
      reloadApp: jest.fn(),
      appStatus: AppStatus.ERROR,
    });

    const { getByText } = render(<AppUnavailable />);
    expect(getByText('Extra Button')).toBeTruthy();
  });
});
