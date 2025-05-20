import { renderHook } from '@testing-library/react-hooks';

import { useMenuContext } from '../../context/menu.sdkContext';
import { useGetProfileInfo } from '../useGetProfileInfo';

jest.mock('../../context/menu.sdkContext', () => ({
  useMenuContext: jest.fn(),
}));

const menuInfo = [
  {
    label: 'Support and Assessments',
    openURLInNewTab: true,
    redirectUrl: 'api:assessments?surveyId=63c97a6c-716e-4006-a34c-b7dd202afa51',
    title: 'Support starts here',
    type: 'CardModel',
  },
  {
    label: 'Find a Provider',
    openURLInNewTab: false,
    redirectUrl: 'page:findACounselor.telehealth',
    title: 'Find a counselor',
    type: 'CardModel',
  },
  {
    label: 'Legal Advice',
    openURLInNewTab: false,
    redirectUrl: 'company-demo/find-legal-support',
    title: 'Legal resources',
    type: 'CardModel',
  },
];

describe('useGetProfileInfo', () => {
  const mockNavigate = jest.fn();
  const mockLinkTo = jest.fn();
  const mockUserProfileData = {
    firstName: 'John',
    lastName: 'Doe',
    dob: '01/01/1990',
    gender: 'Male',
    relStatus: 'Single',
    address: {
      state: 'CA',
      city: 'Los Angeles',
      stateCode: 'CA',
      zipcode: '90001',
    },
    communication: {
      mobileNumber: '1234567890',
      consent: true,
    },
    emailAddress: 'john.doe@example.com',
    empStatus: 'Employed',
    jobTitle: 'Software Engineer',
    userType: 'Admin',
  };

  beforeEach(() => {
    (useMenuContext as jest.Mock).mockReturnValue({
      navigation: { navigate: mockNavigate },
      navigationHandler: { linkTo: mockLinkTo },
      userProfileData: mockUserProfileData,
      loggedIn: true,
      menuData: menuInfo,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return fullName correctly', () => {
    const { result } = renderHook(() => useGetProfileInfo());
    expect(result.current.fullName).toBe('John Doe');
  });

  it('should return menuData correctly', () => {
    const { result } = renderHook(() => useGetProfileInfo());
    expect(result.current.menuData).toHaveLength(3);
  });

  it('should return loggedInMenuData correctly when logged in', () => {
    const { result } = renderHook(() => useGetProfileInfo());
    expect(result.current.loggedInMenuData).toHaveLength(1);
  });

  it('should return profileData correctly', () => {
    const { result } = renderHook(() => useGetProfileInfo());
    expect(result.current.profileData).toHaveLength(6);
  });

  it('should call navigation.navigate when onPress is triggered for profile menu items', () => {
    const { result } = renderHook(() => useGetProfileInfo());
    if (result.current.profileData[0].onPress) {
      result.current.profileData[0].onPress();
    }
    expect(mockNavigate).toHaveBeenCalledWith('ProfileDetails', {
      listData: expect.any(Array),
      title: 'profile.personalInfo',
    });
  });
});
