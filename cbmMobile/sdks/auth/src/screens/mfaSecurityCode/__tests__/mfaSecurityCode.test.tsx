import { render } from '@testing-library/react-native';
import React from 'react';

import { AuthMockContextWrapper } from '../../../__mocks__/authMockContextWrapper';
import { MFASecurityCode } from '../mfaSecurityCode';

describe('MFASecurityCode', () => {
  it('Display  title and subtitle', async () => {
    const { getByTestId } = render(
      <AuthMockContextWrapper>
        <MFASecurityCode />
      </AuthMockContextWrapper>
    );
    const actionButton = getByTestId('auth.mfa.profile.title');
    expect(actionButton).toBeTruthy();
  });
});
