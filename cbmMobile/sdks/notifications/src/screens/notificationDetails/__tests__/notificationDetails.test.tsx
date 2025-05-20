import { render } from '@testing-library/react-native';
import React from 'react';

import { NotificationMockContextWrapper } from '../../../__mocks__/notificationMockContextWrapper';
import { NotificationDetails } from '../notificationDetails';

jest.mock('@react-navigation/native', () => {
  const navigation = jest.requireActual<typeof import('@react-navigation/native')>('@react-navigation/native');
  return {
    ...navigation,
    useRoute: () => ({
      params: {
        url: 'podcasts/good-sibling-relationships',
      },
    }),
  };
});
jest.mock('../../../../../../shared/src/components/credibleMindComponent');

describe('NotificationDetails', () => {
  it('renders CredibleMindComponent with the correct URL', () => {
    const component = render(
      <NotificationMockContextWrapper>
        <NotificationDetails />
      </NotificationMockContextWrapper>
    );
    expect(component).toBeTruthy();
  });
});
