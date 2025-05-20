import { render } from '@testing-library/react-native';
import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { getClientDetails } from '../../../../src/util/commonUtils';
import { StatementOfUnderstandingScreen } from '../statementOfUnderstanding/statementOfUnderstanding';

jest.mock('../../../../src/util/commonUtils');

describe('StatementOfUnderstandingScreen', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });
  it('should display StatementOfUnderstanding Text when logged in', async () => {
    render(
      <AppMockContextWapper>
        <StatementOfUnderstandingScreen />
      </AppMockContextWapper>
    );
  });
});
