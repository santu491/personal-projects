import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { MenuMockContextWrapper } from '../../../__mocks__/menuMockContextWrapper';
import { DeleteAccount } from '../deleteAccount';
import { useDeleteAccount } from '../useDeleteAccount';

// Mock the hooks
jest.mock('../useDeleteAccount');
jest.mock('../../../../../../src/util/commonUtils');

describe('DeleteAccount', () => {
  const mockUseDeleteAccount = useDeleteAccount as jest.Mock;

  beforeEach(() => {
    mockUseDeleteAccount.mockReturnValue({
      setShowBottomSheet: jest.fn(),
      showBottomSheet: false,
      handleDeleteAccount: jest.fn(),
      handleCheckboxConfirmation: jest.fn(),
      handleCancel: jest.fn(),
      enableDeleteButton: false,
      showAlert: false,
      navigateToHome: jest.fn(),
      handleDeleteAccountBottomSheet: jest.fn(),
    });
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('renders correctly', () => {
    const deleteAccount = render(
      <MenuMockContextWrapper>
        <DeleteAccount />
      </MenuMockContextWrapper>
    );
    expect(deleteAccount).toBeTruthy();
  });

  it('opens bottom sheet when delete button is pressed', () => {
    const handleDeleteAccountBottomSheet = jest.fn();
    mockUseDeleteAccount.mockReturnValueOnce({
      ...mockUseDeleteAccount(),
      handleDeleteAccountBottomSheet,
    });

    const { getByTestId } = render(
      <MenuMockContextWrapper>
        <DeleteAccount />
      </MenuMockContextWrapper>
    );
    fireEvent.press(getByTestId('profile.deleteAccountPage.deleteaccount.button'));
    expect(handleDeleteAccountBottomSheet).toHaveBeenCalled();
  });

  it('shows alert when showAlert is true', () => {
    mockUseDeleteAccount.mockReturnValueOnce({
      ...mockUseDeleteAccount(),
      showAlert: true,
    });

    render(
      <MenuMockContextWrapper>
        <DeleteAccount />
      </MenuMockContextWrapper>
    );
    expect(screen.getByText('profile.deleteAccountPage.deletedTitle')).toBeTruthy();
    expect(screen.getByText('profile.deleteAccountPage.deletedMessage')).toBeTruthy();
    expect(screen.getByText('profile.deleteAccountPage.deletedMessage')).toBeTruthy();
  });

  it('navigates to home when alert primary button is pressed', () => {
    const navigateToHome = jest.fn();
    mockUseDeleteAccount.mockReturnValueOnce({
      ...mockUseDeleteAccount(),
      showAlert: true,
      navigateToHome,
    });

    render(
      <MenuMockContextWrapper>
        <DeleteAccount />
      </MenuMockContextWrapper>
    );
    fireEvent.press(screen.getByText('providers.continue'));
    expect(navigateToHome).toHaveBeenCalled();
  });
});
