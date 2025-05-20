import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { getMockHomeContext } from '../../../__mocks__/homeContext';
import { HomeMockContextWrapper } from '../../../__mocks__/homeMockContextWrapper';
import { mockTeleHealthResponse } from '../../../__mocks__/teleHealthInfo';
import { useHomeContext } from '../../../context/home.sdkContext';
import { Telehealth } from '../teleHealth';
jest.mock('../../../../../../src/util/commonUtils');

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: {
      teleHealthData: mockTeleHealthResponse.data.telehealth,
    },
  }),
}));

jest.mock('../../../context/home.sdkContext');

const mockCallService = jest.fn();

describe('Telehealth', () => {
  mockCallService.mockResolvedValue(mockTeleHealthResponse);
  (useHomeContext as jest.Mock).mockReturnValue({
    ...getMockHomeContext(),
    serviceProvider: {
      callService: mockCallService,
    },
  });
  (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  it('should render telehealth component', async () => {
    render(
      <HomeMockContextWrapper>
        <Telehealth />
      </HomeMockContextWrapper>
    );
  });

  it('renders title correctly', () => {
    const { getByTestId } = render(
      <HomeMockContextWrapper>
        <Telehealth />
      </HomeMockContextWrapper>
    );

    expect(getByTestId('home.header')).toBeTruthy();
  });
});
