import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../src/util/commonUtils';
import { WellbeingMockContextWrapper } from '../../__mocks__/wellbeingMockContextWrapper';
import { WellbeingDetailsView } from '../wellbeingDetailsView';

jest.mock('../../../../../src/util/commonUtils');

jest.mock('@react-navigation/native', () => {
  const navigation = jest.requireActual<typeof import('@react-navigation/native')>('@react-navigation/native');
  return {
    ...navigation,
    useRoute: () => ({
      params: { url: 'https://example.com' },
    }),
  };
});

describe('WellbeingDetailsView', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });
  it('renders correctly with the given URL', () => {
    const { queryByText } = render(
      <WellbeingMockContextWrapper>
        <WellbeingDetailsView />
      </WellbeingMockContextWrapper>
    );
    expect(queryByText('https://example.com')).toBeNull();
  });
});
