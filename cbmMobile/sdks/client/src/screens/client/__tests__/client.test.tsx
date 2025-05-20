import { render } from '@testing-library/react-native';
import React from 'react';

import { getMockAppContext } from '../../../../../../src/__mocks__/appContext';
import { useAppContext } from '../../../../../../src/context/appContext';
import { ClientMockContextWrapper } from '../../../__mocks__/clientMockContextWrapper';
import { useClientContext } from '../../../context/client.sdkContext';

jest.mock('../../../context/client.sdkContext');

jest.mock('../../../../../../src/util/storage');

jest.mock('../../../../../../src/context/appContext');

jest.mock('../../../../../../src/util/commonUtils');

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { ClientDetails } from '../client';

describe('OrganizationSearch', () => {
  const mockServiceProvider = {
    callService: jest.fn(),
  };
  const mockClientContext = {
    ...getMockAppContext(),
    navigation: {
      navigate: jest.fn(),
    },
    serviceProvider: mockServiceProvider,

    clientsListInfo: [
      {
        clientName: 'company-demo',
        clientUri: 'eap',
        source: 'eap',
        title: 'company-demo',
        id: '0',
      },
    ],
  };

  const mockAppContext = {
    setClient: jest.fn(),
    client: {
      groupId: '',
      logoUrl: '',
      subGroupName: '',
      supportNumber: '888-888-8888',
      userName: 'Company-demo',
    },
  };
  const clientResponse = {
    data: {
      data: mockClientContext.clientsListInfo,
    },
  };

  beforeEach(() => {
    (useClientContext as jest.Mock).mockReturnValue(mockClientContext);
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });

    mockServiceProvider.callService.mockResolvedValue(clientResponse);
  });

  it('renders the main header component', () => {
    render(
      <ClientMockContextWrapper>
        <ClientDetails />
      </ClientMockContextWrapper>
    );
  });

  it('renders the organization search message', () => {
    const { getByTestId } = render(
      <ClientMockContextWrapper>
        <ClientDetails />
      </ClientMockContextWrapper>
    );
    const actionButton = getByTestId('client.search.message');
    expect(actionButton).toBeTruthy();
  });

  it('renders the organization input component', () => {
    const { getByTestId } = render(
      <ClientMockContextWrapper>
        <ClientDetails />
      </ClientMockContextWrapper>
    );
    const actionButton = getByTestId('client.search.input');
    expect(actionButton).toBeTruthy();
  });
});
