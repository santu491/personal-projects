import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { MenuMockContextWrapper } from '../../../__mocks__/menuMockContextWrapper';
import { WellnessTopics } from '../wellnessTopics';
jest.mock('../../../../../../src/util/commonUtils');

jest.mock('../../../../../../src/hooks/usePushNotification', () => ({
  reLoginEnablePushNotifications: jest.fn(),
  disablePushNotiofications: jest.fn(),
  usePushNotification: () => ({
    getRNPermissions: () => true,
    requestNotificationPermissionAndroid: jest.fn(),
    enablePushNotifications: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native', () => {
  const navigation = jest.requireActual<typeof import('@react-navigation/native')>('@react-navigation/native');
  return {
    ...navigation,
    useRoute: () => ({
      params: {
        selectedTopicsList: [],
        topicsList: [],
      },
    }),
  };
});

describe('WellnessTopics', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });
  const wellnessTopicsWrapper = (
    <MenuMockContextWrapper>
      <WellnessTopics />
    </MenuMockContextWrapper>
  );

  it('renders the component without errors', () => {
    const { getByTestId } = render(wellnessTopicsWrapper);
    expect(getByTestId('profile-wellnessTopics')).toBeTruthy();
    expect(getByTestId('profile-wellnessTopics-description')).toBeTruthy();
  });
});
