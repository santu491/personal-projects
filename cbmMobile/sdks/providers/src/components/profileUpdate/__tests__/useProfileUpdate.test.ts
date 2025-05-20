import { act } from '@testing-library/react-hooks';
import { renderHook } from '@testing-library/react-native';

import { useProfileUpdate } from '../useProfileUpdate';

describe('useProfileUpdate', () => {
  const mockCloseModal = jest.fn();
  const mockHandleProfileSubmit = jest.fn();
  const mockProfileInfo = {
    providerName: 'Test Provider',
    profileOptions: [
      { id: 1, name: 'Option 1', label: 'Label 1', selected: false },
      { id: 2, name: 'Option 2', label: 'Label 2', selected: true },
    ],
  };

  const setup = () => {
    const { result } = renderHook(() =>
      useProfileUpdate({
        closeModal: mockCloseModal,
        handleProfileSubmit: mockHandleProfileSubmit,
        profileInfo: mockProfileInfo,
      })
    );
    return result;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default options from profileInfo', () => {
    const result = setup();
    expect(result.current.options).toEqual(mockProfileInfo.profileOptions);
  });

  it('should toggle the selected state of a profile option', () => {
    const result = setup();
    act(() => {
      result.current.onProfileOptionChange(mockProfileInfo.profileOptions[0]);
    });
    expect(result.current.options).toEqual([
      { id: 1, name: 'Option 1', label: 'Label 1', selected: true },
      { id: 2, name: 'Option 2', label: 'Label 2', selected: true },
    ]);
  });

  it('should call handleProfileSubmit and closeModal on handleSubmit', () => {
    const result = setup();
    act(() => {
      result.current.handleSubmit();
    });
    expect(mockHandleProfileSubmit).toHaveBeenCalledWith({
      emailAddress: '',
      firstName: '',
      comments: '',
      labels: [{ id: 2, name: 'Option 2', label: 'Label 2' }],
    });
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('should call closeModal on handleCancel', () => {
    const result = setup();
    act(() => {
      result.current.handleCancel();
    });
    expect(mockCloseModal).toHaveBeenCalled();
  });
});
