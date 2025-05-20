import { render } from '@testing-library/react-native';
import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { getClientDetails } from '../../../../src/util/commonUtils';
import { TermsOfUseScreen } from '../termsOfUse';

jest.mock('../../../../src/util/commonUtils');

describe('TermsOfUse Screen', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });
  it('should display TermsOfUse Text when logged in', async () => {
    render(
      <AppMockContextWapper>
        <TermsOfUseScreen />
      </AppMockContextWapper>
    );
  });
});
