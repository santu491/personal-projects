import { act, renderHook } from '@testing-library/react-hooks';

import { useUserContext } from '../../context/auth.sdkContext';
import { UserProfileResponseDTO } from '../../models/profile';
import { useProfileDetails } from '../useProfileDetails';

jest.mock('../../context/auth.sdkContext');

describe('useProfileDetails', () => {
  const mockSetUserProfileData = jest.fn();
  const mockCallService = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserContext as jest.Mock).mockReturnValue({
      serviceProvider: {
        callService: mockCallService,
      },
      setUserProfileData: mockSetUserProfileData,
    });
  });

  it('should fetch and set user profile details successfully', async () => {
    const mockResponse: UserProfileResponseDTO = {
      data: {
        status: 'Success',
        data: {
          id: '66b30c9643211e64f81d7c1b',
          iamguid: '7ca3589a-2ac5-4c8b-884a-f34ae35a0b8b',
          employerType: 'BEACON',
          userRole: 'DFDMEMBER',
          firstName: 'xxx',
          lastName: 'yyy',
          emailAddress: 'abc@xxx.com',
          isEmailVerified: true,
          dob: '05/14/2000',
          gender: 'Male',
          relStatus: 'Never Married',
          empStatus: 'Full Time',
          jobTitle: 'Technical',
          userType: 'Household',
          communication: {
            mobileNumber: '9988776655',
            consent: true,
          },
          address: {
            city: 'Alexandria',
            zipcode: '22301',
            state: 'Virginia',
            addressTwo: 'LA',
            stateCode: 'AL',
            addressOne: 'mirrorgraphics',
          },
          departmentName: 'newDepartment',
          clientName: 'company-demo',
          clientGroupId: 'DEMO1',
          pingRiskId: '',
          lastLoginDateTime: '2025-04-25T09:25:42.364Z',
          groupName: 'Company Demo',
          notificationCount: 10,
        },
      },
    };

    mockCallService.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useProfileDetails());

    await act(async () => {
      await result.current.getProfileDetails();
    });

    expect(mockCallService).toHaveBeenCalledWith(
      expect.any(String), // API endpoint
      'GET',
      null
    );
    expect(mockSetUserProfileData).toHaveBeenCalledWith(mockResponse.data.data);
  });

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Network error');
    mockCallService.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useProfileDetails());

    await act(async () => {
      await result.current.getProfileDetails();
    });

    expect(mockCallService).toHaveBeenCalled();
    expect(mockSetUserProfileData).not.toHaveBeenCalled();
    // You can also check if the error was logged
    // For example, spy on console.info if needed
  });
});
