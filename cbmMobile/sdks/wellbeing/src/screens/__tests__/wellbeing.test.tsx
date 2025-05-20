import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../src/util/commonUtils';
import { WellbeingMockContextWrapper } from '../../__mocks__/wellbeingMockContextWrapper';
import { useWellbeing } from '../useWellbeing';
import { Wellbeing } from '../wellbeing';

// Mock the hooks
jest.mock('../useWellbeing');
jest.mock('../../../../../src/util/commonUtils');

describe('Wellbeing Screen', () => {
  const mockNavigateToWellbeingPages = jest.fn();

  beforeEach(() => {
    (useWellbeing as jest.Mock).mockReturnValue({
      welllbeingData: [
        {
          label: 'Test Label',
          action: {
            screenName: 'TestScreen',
            imagePath: 'test/path/to/image',
          },
        },
      ],
      navigateToWellbeingPages: mockNavigateToWellbeingPages,
      scrollRef: React.createRef(),
    });
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('renders correctly', () => {
    const { getByTestId } = render(
      <WellbeingMockContextWrapper>
        <Wellbeing />
      </WellbeingMockContextWrapper>
    );
    expect(getByTestId('wellbeing.label')).toBeTruthy();
    expect(getByTestId('wellbeing.viewAll')).toBeTruthy();
  });

  it('navigates to the correct screen on card press', () => {
    const { getByText } = render(
      <WellbeingMockContextWrapper>
        <Wellbeing />
      </WellbeingMockContextWrapper>
    );
    const card = getByText('Test Label');
    fireEvent.press(card);
    expect(mockNavigateToWellbeingPages).toHaveBeenCalledWith('TestScreen');
  });

  it('displays the correct translated text', () => {
    const { getByText } = render(
      <WellbeingMockContextWrapper>
        <Wellbeing />
      </WellbeingMockContextWrapper>
    );
    expect(getByText('wellbeing.titleHeader')).toBeTruthy();
    expect(getByText('wellbeing.titleSubHeader')).toBeTruthy();
    expect(getByText('wellbeing.wellBeingTitle')).toBeTruthy();
    expect(getByText('wellbeing.viewAll')).toBeTruthy();
  });
});
