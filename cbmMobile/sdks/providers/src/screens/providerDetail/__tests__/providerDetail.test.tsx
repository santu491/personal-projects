import { render } from '@testing-library/react-native';
import React from 'react';

import { useAppContext } from '../../../../../../src/context/appContext';
import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { contacts, providerData, providerDetailResponse } from '../__mocks__/mockProviderDetails';
import { ProviderDetailScreen } from '../providerDetail';
import { useProviderDetail } from '../useProviderDetail';

jest.mock('../useProviderDetail');
jest.mock('../../../../../../src/context/appContext');
jest.mock('../../../../../../src/util/commonUtils');

let mockAppContext;

describe('ProviderDetailScreen', () => {
  const mockUseProviderDetail = useProviderDetail as jest.Mock;

  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
    mockUseProviderDetail.mockReturnValue({
      providerDetailResponse,
      onPressRequestAppointment: jest.fn(),
      isAlertEnabled: false,
      alertInfo: null,
      onPressContact: jest.fn(),
      data: providerData,
      contacts,
    });

    mockAppContext = {
      setMemberAppointStatus: jest.fn(),
      setNavigateScreen: jest.fn(),
      navigateScreen: undefined,
      navigationHandler: {
        linkTo: jest.fn(),
      },
      serviceProvider: {
        callService: jest.fn(),
      },
    };
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
  });

  it('renders the contacts section correctly', () => {
    const { getByText } = render(<ProviderDetailScreen />);
    expect(getByText(contacts.sectionTitle)).toBeTruthy();
    contacts.data.forEach((contact) => {
      expect(getByText(contact.title)).toBeTruthy();
    });
  });
});
