import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { ProvidersMockContextWrapper } from '../../../__mocks__/providersMockContextWrapper';
import { CounselorScreen } from '../findCounselor';
import { useFindCounselor } from '../useFindCounselor';

jest.mock('../useFindCounselor', () => ({
  useFindCounselor: jest.fn(),
}));
jest.mock('../../../../../../src/util/commonUtils');

const mockUseFindCounselor = useFindCounselor as jest.Mock;

describe('CounselorScreen', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('renders the main header and titles correctly', () => {
    mockUseFindCounselor.mockReturnValue({
      isDisclaimerVisisble: false,
      setIsDisclaimerVisisble: jest.fn(),
      handleDisclaimerClick: jest.fn(),
      closeDisclaimerModal: jest.fn(),
    });

    // Render the component
    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <CounselorScreen />
      </ProvidersMockContextWrapper>
    );

    // Assertions to check if the main components are rendered
    expect(getByText('providers.findAProvider')).toBeTruthy();
    expect(getByText('providers.disclaimer')).toBeTruthy();
  });
});
