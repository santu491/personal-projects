import { render } from '@testing-library/react-native';
import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { getClientDetails } from '../../../../src/util/commonUtils';
import { CredibleMindComponent } from '../credibleMindComponent';
jest.mock('../../../../src/util/commonUtils');

jest.mock('@react-navigation/native', () => {
  const navigation = jest.requireActual<typeof import('@react-navigation/native')>('@react-navigation/native');
  return {
    ...navigation,
    setOptions: jest.fn(),
  };
});

jest.mock('@crediblemind/embeddable-react-native', () => 'CMEmbeddable');
jest.mock('react-native-config', () => ({
  CREDIBLEMIND_CLIENT_IDENTIFIER: 'test-client-id',
  CREDIBLEMIND_ENVIRONMENT: 'test-env',
}));

describe('CredibleMindComponent', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });
  it('renders correctly', () => {
    const { queryByText } = render(
      <AppMockContextWapper>
        <CredibleMindComponent url="https://example.com" />
      </AppMockContextWapper>
    );
    expect(queryByText('CMEmbeddable')).toBeNull();
  });
});
