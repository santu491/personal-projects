import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AppStatus } from '../../../../../../src/screens/appInit/appInitContext';
import { useAppInitInner } from '../../../../../../src/screens/appInit/useAppInitInner';
import { ProvidersMockContextWrapper } from '../../../__mocks__/providersMockContextWrapper';
import { ReviewDetails } from '../reviewDetails';
import { useReviewDetails } from '../useReviewDetails';

jest.mock('../../../../../../src/screens/appInit/useAppInitInner', () => ({
  useAppInitInner: jest.fn(),
}));

jest.mock('../useReviewDetails', () => ({
  useReviewDetails: jest.fn(),
}));

const mockUseReviewDetails = useReviewDetails as jest.Mock;

describe('ReviewDetails', () => {
  const mockOnPressContinue = jest.fn();
  const mockOnPressPreviousButton = jest.fn();

  const defaultProps = {
    onPressContinue: mockOnPressContinue,
    onPressPreviousButton: mockOnPressPreviousButton,
    reviewDetails: [],
    // Add other props as needed
  };

  beforeEach(() => {
    mockUseReviewDetails.mockReturnValue(defaultProps);
  });

  it('should render correctly', () => {
    (useAppInitInner as jest.Mock).mockReturnValue({
      appStatus: AppStatus.READY,
      contextValue: {},
    });
    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <ReviewDetails />
      </ProvidersMockContextWrapper>
    );
    expect(getByText('appointment.reviewDetails.title')).toBeTruthy();
    expect(getByText('appointment.reviewDetails.description')).toBeTruthy();
  });

  it('should call onPressContinue when the continue button is pressed', () => {
    (useAppInitInner as jest.Mock).mockReturnValue({
      appStatus: AppStatus.READY,
      contextValue: {},
    });
    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <ReviewDetails />
      </ProvidersMockContextWrapper>
    );
    const continueButton = getByText('appointment.continue');
    fireEvent.press(continueButton);
    expect(mockOnPressContinue).toHaveBeenCalled();
  });

  it('should display review details correctly', () => {
    const reviewDetails = [
      { question: 'Question 1', answer: 'Answer 1' },
      { question: 'Question 2', answer: 'Answer 2' },
    ];
    mockUseReviewDetails.mockReturnValue({ ...defaultProps, reviewDetails });

    (useAppInitInner as jest.Mock).mockReturnValue({
      appStatus: AppStatus.READY,
      contextValue: {},
    });

    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <ReviewDetails />
      </ProvidersMockContextWrapper>
    );

    expect(getByText('Question 1')).toBeTruthy();
    expect(getByText('Answer 1')).toBeTruthy();
    expect(getByText('Question 2')).toBeTruthy();
    expect(getByText('Answer 2')).toBeTruthy();
  });
});
