import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { AuthMockContextWrapper } from '../../../__mocks__/authMockContextWrapper';
import { AccountRecovery } from '../accountRecovery';
jest.mock('../../../../../../src/util/commonUtils');

describe('AccountRecovery', () => {
  (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  it('renders the component without errors', () => {
    render(
      <AuthMockContextWrapper>
        <AccountRecovery />
      </AuthMockContextWrapper>
    );
    // Add your assertion here
  });

  it('navigates to reset secret screen when the button is pressed', () => {
    const { getByTestId } = render(
      <AuthMockContextWrapper>
        <AccountRecovery />
      </AuthMockContextWrapper>
    );
    const button = getByTestId('auth.profile.account.recovery');
    fireEvent.press(button);
    // Add your assertion here
  });

  // Add more test cases as needed
});
