import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AuthMockContextWrapper } from '../../../__mocks__/authMockContextWrapper';
import { useUserContext } from '../../../context/auth.sdkContext';
import { Screen } from '../../../navigation/auth.navigationTypes';
import { AccountSetUp } from '../accountSetUp';

const response = {
  status: 201,
  data: {
    isSuccess: true,
    message: 'User exceeded the validation limit. Sorry account will be blocked!!',
  },
};

jest.mock('../../../../../../src/util/commonUtils', () => ({
  tokenIntegration: () => Promise.resolve('token'),
  isIOS: () => true,
  isAndroid: () => true,
  dimensionCheck: () => true,
  convertApiResponse: () => Promise.resolve(response),
}));
jest.mock('../../../context/auth.sdkContext');

describe('AccountSetUp', () => {
  const accountSetupWrapper = (
    <AuthMockContextWrapper>
      <AccountSetUp />
    </AuthMockContextWrapper>
  );

  beforeEach(() => {
    global.fetch = jest.fn();
    (useUserContext as jest.Mock).mockReturnValue({
      navigation: { navigate: jest.fn() },
    });
  });

  it('should display the sign-up title', async () => {
    const { getByTestId } = render(accountSetupWrapper);
    expect(getByTestId('auth.signUp.title')).toBeTruthy();
  });

  it('should navigate to sign-in screen when link is pressed', async () => {
    const { getByText } = render(accountSetupWrapper);
    const signInLink = getByText('login.title');
    fireEvent.press(signInLink);
    const navigateTo = jest.spyOn(useUserContext().navigation, 'navigate');

    expect(navigateTo).toHaveBeenCalledWith(Screen.LOGIN);
  });
});
