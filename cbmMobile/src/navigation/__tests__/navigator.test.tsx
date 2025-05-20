/* eslint-disable @typescript-eslint/naming-convention */
import { render } from '@testing-library/react-native';
import React from 'react';

import { ScreenNames } from '../../config';
import { useAppContext } from '../../context/appContext';
import { Navigator } from '../navigator';

jest.mock('../../context/appContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: jest.fn().mockReturnValue({
    Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Screen: ({ component }: { component: React.ReactNode }) => component,
  }),
}));

describe('Navigator', () => {
  it('does not render ClientNavigator when client is exist', () => {
    (useAppContext as jest.Mock).mockReturnValue({ client: { userName: 'Company demo' } });
    const { queryByText } = render(<Navigator />);
    expect(queryByText(ScreenNames.CLIENT_SDK)).toBeNull();
  });

  it('renders TabNavigator', () => {
    (useAppContext as jest.Mock).mockReturnValue({ client: {} });
    const { queryByText } = render(<Navigator />);
    expect(queryByText(ScreenNames.TAB_NAVIAGTION)).toBeNull();
  });

  it('renders AuthNavigator', () => {
    (useAppContext as jest.Mock).mockReturnValue({ client: undefined });
    const { queryByText } = render(<Navigator />);
    expect(queryByText(ScreenNames.AUTH_SDK)).toBeNull();
  });

  it('renders NotificationNavigator', () => {
    (useAppContext as jest.Mock).mockReturnValue({ client: undefined });
    const { queryByText } = render(<Navigator />);
    expect(queryByText(ScreenNames.NOTIFICATION_SDK)).toBeNull();
  });

  it('renders PrivacyPolicyScreen with headerShown', () => {
    (useAppContext as jest.Mock).mockReturnValue({ client: undefined });
    const { queryByText } = render(<Navigator />);
    expect(queryByText(ScreenNames.PRIVACY_POLICY)).toBeNull();
  });

  it('renders TermsOfUseScreen with headerShown', () => {
    (useAppContext as jest.Mock).mockReturnValue({ client: undefined });
    const { queryByText } = render(<Navigator />);
    expect(queryByText(ScreenNames.TERMS_OF_USE)).toBeNull();
  });

  it('renders StatementOfUnderstandingScreen with headerShown', () => {
    (useAppContext as jest.Mock).mockReturnValue({ client: undefined });
    const { queryByText } = render(<Navigator />);
    expect(queryByText(ScreenNames.STATEMENT_OF_UNDERSTANDING)).toBeNull();
  });

  it('renders CrisisSupport with headerShown', () => {
    (useAppContext as jest.Mock).mockReturnValue({ client: undefined });
    const { queryByText } = render(<Navigator />);
    expect(queryByText(ScreenNames.CRISIS_SUPPORT)).toBeNull();
  });
});
