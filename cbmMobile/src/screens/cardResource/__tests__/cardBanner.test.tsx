import { render } from '@testing-library/react-native';
import React from 'react';

import { CardBannerInfo } from '../../../models/cardResource';
import { CardBanner } from '../components/cardBanner';

describe('CardBanner', () => {
  const mockData: CardBannerInfo = {
    image: 'https://example.com/image.jpg',
    title: 'Test Title',
    description: 'Test Description',
  };

  // const mockBannerButtons: BannerButtonsData[] = [{ label: 'Button 1' }, { label: 'Button 2' }];

  const mockOnPressBannerButton = jest.fn();

  it('renders the image, title, and description correctly', () => {
    const { getByText } = render(
      <CardBanner data={mockData} bannerButtons={[]} onPressBannerButton={mockOnPressBannerButton} />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  // it('renders ActionButton for each item in bannerButtons', () => {
  //   const { getByText } = render(
  //     <CardBanner data={mockData} bannerButtons={mockBannerButtons} onPressBannerButton={mockOnPressBannerButton} />
  //   );

  //   // expect(getByText('Button 1')).toBeTruthy();
  //   expect(getByText('Button 2')).toBeTruthy();
  // });

  // it('calls onPressBannerButton when an ActionButton is pressed', () => {
  //   const { getByText } = render(
  //     <CardBanner data={mockData} bannerButtons={mockBannerButtons} onPressBannerButton={mockOnPressBannerButton} />
  //   );

  //   // fireEvent.press(getByText('Button 1'));
  //   // expect(mockOnPressBannerButton).toHaveBeenCalledWith(mockBannerButtons[0]);

  //   fireEvent.press(getByText('Button 2'));
  //   expect(mockOnPressBannerButton).toHaveBeenCalledWith(mockBannerButtons[1]);
  // });
});
