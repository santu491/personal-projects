// import { fireEvent, render } from '@testing-library/react-native';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { mockProviderInfo } from '../../../../../sdks/providers/src/__mocks__/mockProviderInfo';
import { ProfileTitleComponent } from '../profileTitleComponent';

describe('ProfileTitleComponent', () => {
  it('calls the onPress function when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<ProfileTitleComponent profileTitleData={mockProviderInfo} onPress={onPress} />);
    const container = getByTestId('profile-title');

    fireEvent.press(container);

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
