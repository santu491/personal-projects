import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ClientMockContextWrapper } from '../../../__mocks__/clientMockContextWrapper';
import { useClientContext } from '../../../context/client.sdkContext';
import { Screen } from '../../../navigation/client.navigationTypes';
import { HealthCounselor } from '../healthCounselor';

jest.mock('../../../context/client.sdkContext');

const mockUseClientContext = useClientContext as jest.Mock;

describe('HealthCounselor', () => {
  beforeEach(() => {
    const mockContextValue = {
      navigation: {
        navigate: jest.fn(),
      },
    };
    (useClientContext as jest.Mock).mockReturnValue(mockContextValue);
  });

  it('renders the HealthCounselor component correctly', () => {
    const { getByText } = render(
      <ClientMockContextWrapper>
        <HealthCounselor />
      </ClientMockContextWrapper>
    );

    expect(getByText('eapBenefits.healthCounselor.title')).toBeTruthy();
    expect(getByText('eapBenefits.healthCounselor.description')).toBeTruthy();
  });

  it('navigates to wellness content on next button click', () => {
    const { getByText } = render(
      <ClientMockContextWrapper>
        <HealthCounselor />
      </ClientMockContextWrapper>
    );

    const nextButton = getByText('eapBenefits.next');
    fireEvent.press(nextButton);

    expect(mockUseClientContext().navigation.navigate).toHaveBeenCalledWith(Screen.WELLNESS_CONTENT);
  });

  it('navigates to client search on skip button click', () => {
    const { getByText } = render(
      <ClientMockContextWrapper>
        <HealthCounselor />
      </ClientMockContextWrapper>
    );

    const skipButton = getByText('eapBenefits.skip');
    fireEvent.press(skipButton);

    expect(mockUseClientContext().navigation.navigate).toHaveBeenCalledWith(Screen.CLIENT_SEARCH, {
      showHeaderBackIcon: false,
    });
  });
});
