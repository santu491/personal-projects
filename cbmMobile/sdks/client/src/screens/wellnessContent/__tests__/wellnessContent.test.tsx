import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ClientMockContextWrapper } from '../../../__mocks__/clientMockContextWrapper';
import { useClientContext } from '../../../context/client.sdkContext';
import { Screen } from '../../../navigation/client.navigationTypes';
import { WellnessContent } from '../wellnessContent';

jest.mock('../../../context/client.sdkContext');

const mockUseClientContext = useClientContext as jest.Mock;

describe('WellnessContent', () => {
  beforeEach(() => {
    const mockContextValue = {
      navigation: {
        navigate: jest.fn(),
      },
    };
    (useClientContext as jest.Mock).mockReturnValue(mockContextValue);
  });

  it('renders the wellness content correctly', () => {
    const { getByText } = render(
      <ClientMockContextWrapper>
        <WellnessContent />
      </ClientMockContextWrapper>
    );

    expect(getByText('eapBenefits.wellnessContent.title')).toBeTruthy();
    expect(getByText('eapBenefits.wellnessContent.description')).toBeTruthy();
  });

  it('navigates to client search on next button click', () => {
    const { getByText } = render(
      <ClientMockContextWrapper>
        <WellnessContent />
      </ClientMockContextWrapper>
    );

    const nextButton = getByText('eapBenefits.next');
    fireEvent.press(nextButton);

    expect(mockUseClientContext().navigation.navigate).toHaveBeenCalledWith(Screen.CLIENT_SEARCH, {
      showHeaderBackIcon: false,
    });
  });

  it('navigates to client search on skip button click', () => {
    const { getByText } = render(
      <ClientMockContextWrapper>
        <WellnessContent />
      </ClientMockContextWrapper>
    );

    const skipButton = getByText('eapBenefits.skip');
    fireEvent.press(skipButton);

    expect(mockUseClientContext().navigation.navigate).toHaveBeenCalledWith(Screen.CLIENT_SEARCH, {
      showHeaderBackIcon: false,
    });
  });
});
