import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { SourceType } from '../../../../../../src/constants/constants';
import { ProvidersMockContextWrapper } from '../../../__mocks__/providersMockContextWrapper';
import { SearchProvider } from '../../../model/providerSearchResponse';
import { TeleHealthCard } from '../teleHealthCard';
import { useTeleHelathCard } from '../useTeleHealthCard';

jest.mock('../useTeleHealthCard', () => ({
  useTeleHelathCard: jest.fn(),
}));

const mockOnHandleVisitWebSite = jest.fn();
const mockUseTeleHealthCard = {
  onHandleVisitWebSite: mockOnHandleVisitWebSite,
  client: { source: SourceType.EAP },
  modelVisible: false,
  showError: false,
  handleTryAgain: jest.fn(),
};

const mockProviderInfo: SearchProvider = {
  title: 'Test Provider',
  description: 'Description line 1\n\nDescription line 2',
  visitButton: {
    label: 'Visit Website',
    ariaLabel: 'Visit Test Provider Website',
    href: 'https://example.com',
    isExternal: true,
    openAsSSP: false,
  },
  logo: {
    dmUrl: '',
    src: 'https://example.com',
  },
};

describe('TeleHealthCard', () => {
  beforeEach(() => {
    (useTeleHelathCard as jest.Mock).mockReturnValue(mockUseTeleHealthCard);
  });

  it('renders the SVG logo when the logo source ends with .svg', () => {
    const { getByTestId } = render(
      <ProvidersMockContextWrapper>
        <TeleHealthCard providerInfo={mockProviderInfo} />
      </ProvidersMockContextWrapper>
    );
    expect(getByTestId('home.provider.teleHealthCard')).toBeTruthy();
  });

  it('renders the title when client source is EAP', () => {
    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <TeleHealthCard providerInfo={mockProviderInfo} />
      </ProvidersMockContextWrapper>
    );
    expect(getByText('Test Provider')).toBeTruthy();
  });

  it('renders multiple descriptions when description contains multiple lines', () => {
    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <TeleHealthCard providerInfo={mockProviderInfo} />
      </ProvidersMockContextWrapper>
    );
    expect(getByText('Description line 1')).toBeTruthy();
    expect(getByText('Description line 2')).toBeTruthy();
  });

  it('calls onHandleVisitWebSite when the visit button is pressed', () => {
    const { getByTestId } = render(
      <ProvidersMockContextWrapper>
        <TeleHealthCard providerInfo={mockProviderInfo} />
      </ProvidersMockContextWrapper>
    );
    fireEvent.press(getByTestId('provider.visit.button'));
    expect(mockOnHandleVisitWebSite).toHaveBeenCalled();
  });
});
