import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import { AppMockContextWapper } from '../../../__mocks__/appMockContextWrapper';
import { getClientDetails } from '../../../util/commonUtils';
import { CrisisSupport } from '../crisisSupport';
import { useCrisisSupport } from '../useCrisisSupport';

jest.mock('../../../util/commonUtils');

jest.mock('../useCrisisSupport', () => ({
  useCrisisSupport: jest.fn(),
}));

describe('CrisisSupport', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  const mockUseCrisisSupport = useCrisisSupport as jest.Mock;

  const crisisSupportWrapper = (
    <AppMockContextWapper>
      <CrisisSupport />
    </AppMockContextWapper>
  );

  it('renders loading state correctly', async () => {
    mockUseCrisisSupport.mockReturnValue({
      loading: false,
      isServerError: true,
      onPressTryAgain: jest.fn(),
    });

    const { getByText } = render(crisisSupportWrapper);
    await waitFor(() => expect(getByText('errors.fullScreenError.title')).toBeTruthy());
  });

  it('renders crisis support data correctly', () => {
    const mockData = [
      {
        sectionTitle: 'Section 1',
        crisisSupportDetails: [],
      },
    ];

    mockUseCrisisSupport.mockReturnValue({
      loading: false,
      crisisSupportData: mockData,
      isServerError: false,
      onPressTryAgain: jest.fn(),
    });

    render(crisisSupportWrapper);
    expect(screen.getByText('credibleMind.immediateAssistance.crisisHotlinesTitle')).toBeTruthy();
    expect(screen.getByText('credibleMind.immediateAssistance.crisisHotlinesDescription')).toBeTruthy();
    expect(screen.getByText('Section 1')).toBeTruthy();
  });

  it('renders server error state correctly', async () => {
    const mockOnPressTryAgain = jest.fn();

    mockUseCrisisSupport.mockReturnValue({
      loading: false,
      crisisSupportData: [],
      isServerError: true,
      onPressTryAgain: mockOnPressTryAgain,
    });

    const { getByText } = render(crisisSupportWrapper);
    expect(getByText('credibleMind.immediateAssistance.crisisHotlinesTitle')).toBeTruthy();
  });
});
