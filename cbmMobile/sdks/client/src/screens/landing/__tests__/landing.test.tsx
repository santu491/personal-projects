import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ClientMockContextWrapper } from '../../../__mocks__/clientMockContextWrapper';
import { LandingScreen } from '../landing';
import { useLanding } from '../useLanding';

jest.mock('../useLanding', () => ({
  useLanding: jest.fn(),
}));

const mockUseLanding = useLanding as jest.Mock;

describe('LandingScreen', () => {
  beforeEach(() => {
    mockUseLanding.mockReturnValue({
      navigateEapBenefits: jest.fn(),
    });
  });

  it('renders the splash title correctly', () => {
    const { getByTestId } = render(
      <ClientMockContextWrapper>
        <LandingScreen />
      </ClientMockContextWrapper>
    );
    const splashTitle = getByTestId('splash.title');
    expect(splashTitle).toBeTruthy();
  });

  it('navigates to organization search on action button press', async () => {
    const { getByTestId } = render(
      <ClientMockContextWrapper>
        <LandingScreen />
      </ClientMockContextWrapper>
    );
    const actionButton = getByTestId('splash.redirect.organization.search');
    fireEvent.press(actionButton);
    expect(mockUseLanding().navigateEapBenefits).toHaveBeenCalled();
  });
});
