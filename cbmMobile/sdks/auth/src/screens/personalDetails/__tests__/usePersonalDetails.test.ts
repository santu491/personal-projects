import { act, renderHook } from '@testing-library/react-hooks';

import { userProfileData } from '../../../__mocks__/auth';
import { useUserContext } from '../../../context/auth.sdkContext';
import { Screen } from '../../../navigation/auth.navigationTypes';
import { usePersonalDetails } from '../usePersonalDetails';

jest.mock('../../../context/auth.sdkContext');

describe('usePersonalDetails', () => {
  const mockNavigate = jest.fn();
  const mockSetUserSignUpData = jest.fn();
  const mockUserContext = {
    navigation: { navigate: mockNavigate },
    userSignUpData: userProfileData,
    setUserSignUpData: mockSetUserSignUpData,
  };

  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue(mockUserContext);
  });

  it('should initialize form with default values from user context', () => {
    const { result } = renderHook(() => usePersonalDetails());

    expect(result.current.control._defaultValues).toEqual(userProfileData);
  });

  it('should navigate to login screen when navigateToSignUpScreen is called', () => {
    const { result } = renderHook(() => usePersonalDetails());

    act(() => {
      result.current.navigateToSignUpScreen();
    });

    expect(mockNavigate).toHaveBeenCalledWith(Screen.LOGIN);
  });

  it('should set user sign up data and navigate to account setup screen when handleContinueButton is called', () => {
    const { result } = renderHook(() => usePersonalDetails());

    act(() => {
      result.current.handleContinueButton();
    });

    expect(mockSetUserSignUpData).toHaveBeenCalledWith({
      ...mockUserContext.userSignUpData,
    });
    expect(mockNavigate).toHaveBeenCalledWith(Screen.ACCOUNT_SETUP);
  });

  it('should calculate dateOfBirthMaxDate correctly', () => {
    const { result } = renderHook(() => usePersonalDetails());

    const expectedDate = new Date();
    expectedDate.setFullYear(expectedDate.getFullYear() - 10);

    expect(result.current.dateOfBirthMaxDate).toEqual(expectedDate);
  });
});
