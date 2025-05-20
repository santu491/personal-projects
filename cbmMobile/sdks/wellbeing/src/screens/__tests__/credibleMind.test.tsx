import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../src/util/commonUtils';
import { WellbeingMockContextWrapper } from '../../__mocks__/wellbeingMockContextWrapper';
import { CredibleMind } from '../credibleMind';
jest.mock('../../../../../src/util/commonUtils');

jest.mock('@react-navigation/native', () => {
  const navigation = jest.requireActual<typeof import('@react-navigation/native')>('@react-navigation/native');
  return {
    ...navigation,
    useRoute: () => ({
      params: {
        url: 'https://crediblemind.com',
      },
    }),
  };
});

describe('CredibleMind', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });
  it('Display CredibleMind details', async () => {
    const { queryByText } = render(
      <WellbeingMockContextWrapper>
        <CredibleMind />
      </WellbeingMockContextWrapper>
    );
    expect(queryByText('Specific Detail')).toBeNull();
  });
});
