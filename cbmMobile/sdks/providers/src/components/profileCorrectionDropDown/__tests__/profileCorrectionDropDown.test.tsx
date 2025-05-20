import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ProfileCorrectionDropDown } from '../profileCorrectionDropDown';

describe('ProfileCorrectionDropDown', () => {
  it('should render all options passed as props', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const { getByText } = render(
      <ProfileCorrectionDropDown options={options} onSelect={jest.fn()} onClose={jest.fn()} />
    );

    options.forEach((option) => {
      expect(getByText(option)).toBeTruthy();
    });
  });

  it('should call onSelect when an option is pressed', () => {
    const onSelectMock = jest.fn();
    const onCloseMock = jest.fn();
    const options = ['Option 1'];

    const { getByTestId } = render(
      <ProfileCorrectionDropDown options={options} onSelect={onSelectMock} onClose={onCloseMock} />
    );

    fireEvent.press(getByTestId('Option 1'));

    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the overlay is pressed', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(
      <ProfileCorrectionDropDown options={['Option 1']} onSelect={jest.fn()} onClose={onCloseMock} />
    );
    fireEvent.press(getByTestId('overlay'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
