import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ClientMockContextWrapper } from '../../../__mocks__/clientMockContextWrapper';
import { useClientContext } from '../../../context/client.sdkContext';
import { Screen } from '../../../navigation/client.navigationTypes';
import { EapBenefits } from '../eapBenefits';

jest.mock('../../../context/client.sdkContext');

const mockUseClientContext = useClientContext as jest.Mock;

describe('EapBenefits', () => {
  beforeEach(() => {
    const mockContextValue = {
      navigation: {
        navigate: jest.fn(),
      },
    };
    (useClientContext as jest.Mock).mockReturnValue(mockContextValue);
  });

  it('renders the EapBenefits component correctly', () => {
    const { getByText } = render(
      <ClientMockContextWrapper>
        <EapBenefits />
      </ClientMockContextWrapper>
    );

    expect(getByText('eapBenefits.benefits.title')).toBeTruthy();
    expect(getByText('eapBenefits.benefits.description')).toBeTruthy();
  });

  it('navigates to health counselor on next button click', () => {
    const { getByText } = render(
      <ClientMockContextWrapper>
        <EapBenefits />
      </ClientMockContextWrapper>
    );

    const nextButton = getByText('eapBenefits.next');
    fireEvent.press(nextButton);

    expect(mockUseClientContext().navigation.navigate).toHaveBeenCalledWith(Screen.HEALTH_COUNSELOR);
  });

  it('navigates to client search on skip button click', () => {
    const { getByText } = render(
      <ClientMockContextWrapper>
        <EapBenefits />
      </ClientMockContextWrapper>
    );

    const skipButton = getByText('eapBenefits.skip');
    fireEvent.press(skipButton);

    expect(mockUseClientContext().navigation.navigate).toHaveBeenCalledWith(Screen.CLIENT_SEARCH, {
      showHeaderBackIcon: false,
    });
  });
});
