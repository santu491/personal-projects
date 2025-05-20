import { render } from '@testing-library/react-native';
import React from 'react';

import { MenuMockContextWrapper } from '../../../__mocks__/menuMockContextWrapper';
import { ViewTopics } from '../viewTopics';

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

describe('ViewTopics', () => {
  const viewTopicsWrapper = (
    <MenuMockContextWrapper>
      <ViewTopics />
    </MenuMockContextWrapper>
  );

  it('renders correctly', () => {
    render(viewTopicsWrapper);
  });
});
