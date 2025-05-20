import { render } from '@testing-library/react-native';
import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { getClientDetails } from '../../../../src/util/commonUtils';
import { PrivacyPolicyScreen } from '../privacyPolicy';

jest.mock('react-native-gesture-handler', () => {});
jest.mock('../../../../src/util/commonUtils');

describe('PrivacyPolicy Screen', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });
  it('should display PrivacyPolicy Text when logged in', async () => {
    render(
      <AppMockContextWapper>
        <PrivacyPolicyScreen />
      </AppMockContextWapper>
    );
  });
});
