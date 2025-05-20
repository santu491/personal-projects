import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { APP_IMAGES } from '../../config/appImages';
import { ChannelContact } from '../../models/mfa';
import { SecurityCodeList } from '../securityCodeList/securityCodeList';

describe('SecurityCodeList', () => {
  const mockHandlePress = jest.fn();
  const mockMfaOptions: ChannelContact[] = [
    {
      channel: 'email',
      image: APP_IMAGES.EMAIL,
      description: 'Email description',
      contactValue: '',
      verifyOtpDesc: '',
    },
    {
      channel: 'sms',
      image: APP_IMAGES.TEXT,
      description: 'SMS description',
      contactValue: '',
      verifyOtpDesc: '',
    },
  ];
  const mockSelectedMfa: ChannelContact = {
    channel: 'email',
    image: APP_IMAGES.EMAIL,
    description: 'Email description',
    contactValue: '',
    verifyOtpDesc: '',
  };

  it('renders the correct number of items', () => {
    const { getAllByTestId } = render(
      <SecurityCodeList mfaOptions={mockMfaOptions} handlePress={mockHandlePress} selectedMfa={mockSelectedMfa} />
    );

    const items = getAllByTestId('auth.mfa.security.option');
    expect(items.length).toBe(mockMfaOptions.length);
  });

  it('calls handlePress with the correct argument when an item is pressed', () => {
    const { getAllByTestId } = render(
      <SecurityCodeList mfaOptions={mockMfaOptions} handlePress={mockHandlePress} selectedMfa={mockSelectedMfa} />
    );

    const items = getAllByTestId('auth.mfa.security.option');
    fireEvent.press(items[0]);
    expect(mockHandlePress).toHaveBeenCalledWith(mockMfaOptions[0]);
  });
});
