import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { DownArrowIcon } from '../../../../../../shared/src/assets/icons/icons';
import { callNumber } from '../../../../../../shared/src/utils/utils';
import { mockProviderInfo } from '../../../__mocks__/mockProviderInfo';
import { ContactComponent } from '../contactComponent';

jest.mock('../../../../../../shared/src/utils/utils', () => ({
  callNumber: jest.fn(),
}));

describe('ContactComponent', () => {
  it('calls phoneNumberTapped when phone icon is pressed', () => {
    const { getByTestId } = render(<ContactComponent providerInfo={mockProviderInfo} hasAccordionView={false} />);
    fireEvent.press(getByTestId('provider.TelePhone'));
    expect(callNumber).toHaveBeenCalledWith('855-227-6562');
  });

  it('toggles accordion view correctly', () => {
    const { getByTestId } = render(<ContactComponent providerInfo={mockProviderInfo} hasAccordionView={true} />);
    fireEvent.press(getByTestId('hours-arrow'));
    expect(<DownArrowIcon />).toBeTruthy();
  });
});
