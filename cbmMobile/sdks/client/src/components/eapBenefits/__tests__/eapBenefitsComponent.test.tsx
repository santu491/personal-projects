import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { EapBenefitsComponent, EapBenefitsComponentProps } from '../eapBenefitsComponent';

describe('EapBenefitsComponent', () => {
  const defaultProps: EapBenefitsComponentProps = {
    description: 'Test description',
    imageSource: { uri: 'test-image' },
    onPressNextButton: jest.fn(),
    progressStepsCount: 1,
    onPressSkipButton: jest.fn(),
    title: 'Test Title',
  };

  it('renders correctly', () => {
    const { getByText } = render(<EapBenefitsComponent {...defaultProps} />);
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test description')).toBeTruthy();
  });

  it('calls onPressSkipButton when skip button is pressed', () => {
    const { getByText } = render(<EapBenefitsComponent {...defaultProps} />);
    const skipButton = getByText('eapBenefits.skip');
    fireEvent.press(skipButton);
    expect(defaultProps.onPressSkipButton).toHaveBeenCalled();
  });

  it('calls onPressNextButton when next button is pressed', () => {
    const { getByText } = render(<EapBenefitsComponent {...defaultProps} />);
    const nextButton = getByText('eapBenefits.next');
    fireEvent.press(nextButton);
    expect(defaultProps.onPressNextButton).toHaveBeenCalled();
  });

  it('renders the skip button with correct text', () => {
    const { getByText } = render(<EapBenefitsComponent {...defaultProps} />);
    expect(getByText('eapBenefits.skip')).toBeTruthy();
  });

  it('renders the next button with correct text', () => {
    const { getByText } = render(<EapBenefitsComponent {...defaultProps} />);
    expect(getByText('eapBenefits.next')).toBeTruthy();
  });

  it('renders the description correctly', () => {
    const { getByText } = render(<EapBenefitsComponent {...defaultProps} />);
    expect(getByText('Test description')).toBeTruthy();
  });

  it('renders the titles correctly', () => {
    const { getByText } = render(<EapBenefitsComponent {...defaultProps} />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders the DotPagination component', () => {
    const { getByTestId } = render(<EapBenefitsComponent {...defaultProps} />);
    expect(getByTestId('dot-pagination')).toBeTruthy();
  });

  it('renders the correct number of dots in DotPagination', () => {
    const { getAllByTestId } = render(<EapBenefitsComponent {...defaultProps} />);
    const dots = getAllByTestId('dot-item');
    expect(dots.length).toBe(3);
  });
});
