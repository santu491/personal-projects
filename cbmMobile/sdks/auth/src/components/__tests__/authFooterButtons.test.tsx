import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AuthFooterButtons } from '../authProfile/authFooterButtons';

describe('AuthFooterButtons', () => {
  it('calls onPressPreviousButton when previous button is pressed', () => {
    const onPressContinueButton = jest.fn();
    const onPressPreviousButton = jest.fn();

    const { getByTestId } = render(
      <AuthFooterButtons
        onPressContinueButton={onPressContinueButton}
        onPressPreviousButton={onPressPreviousButton}
        showPreviousButton={true}
        primaryButtonTitle={'continue'}
      />
    );

    const previousButton = getByTestId('authentication.button.previous');
    fireEvent.press(previousButton);

    expect(onPressPreviousButton).toHaveBeenCalled();
    expect(onPressContinueButton).not.toHaveBeenCalled();
  });
});
