import { render } from '@testing-library/react-native';
import React from 'react';

import { AuthMockContextWrapper } from '../../../__mocks__/authMockContextWrapper';
import { MFAVerifyOTP } from '../mfaVerifyOtp';

jest.mock('@react-navigation/native', () => {
  const navigation = jest.requireActual<typeof import('@react-navigation/native')>('@react-navigation/native');
  return {
    ...navigation,
    useRoute: () => ({
      params: {
        channelName: 'email',
        otpDescription: 'Enter the OTP sent to your email address',
      },
    }),
  };
});

describe('MFA Verify OTP', () => {
  it('Display MFA OTP title', async () => {
    const { getByTestId } = render(
      <AuthMockContextWrapper>
        <MFAVerifyOTP />
      </AuthMockContextWrapper>
    );
    expect(getByTestId('auth.mfa.verify.otp.title')).toBeTruthy();
  });
});
