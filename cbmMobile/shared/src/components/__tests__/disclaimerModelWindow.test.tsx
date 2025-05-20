import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { DisclaimerModelWindow } from '../disclaimerPopup/disclaimerModelWindow';

const setModalVisible = jest.fn();

describe('CopyRights Model Popup Window', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<DisclaimerModelWindow modalVisible={true} setModalVisible={setModalVisible} />);

    expect(getByTestId('copy-rights-model-title')).toBeTruthy();
  });

  it('should call setModalVisible when the button is pressed', () => {
    const { getByTestId } = render(<DisclaimerModelWindow modalVisible={true} setModalVisible={setModalVisible} />);

    fireEvent.press(getByTestId('copyrights-ok-button'));

    expect(setModalVisible).toHaveBeenCalledTimes(1);
    expect(setModalVisible).toHaveBeenCalledWith(false);
  });
});
