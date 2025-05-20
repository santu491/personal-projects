import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { CustomTooltip } from '../customTooltip/customTooltip';

const popoverContainerStyle = { backgroundColor: 'red' };

describe('CustomTooltip', () => {
  it('hides the tooltip on outside press', () => {
    const setVisibleMock = jest.fn();
    const { getByTestId } = render(
      <CustomTooltip
        tooltipView={<Text>Test Tooltip</Text>}
        popoverPosition={{
          right: 0,
          top: 0,
        }}
        visible={true}
        setVisible={setVisibleMock}
        popoverContainerStyle={popoverContainerStyle}
      />
    );
    const modalOverlay = getByTestId('modal-overlay');

    fireEvent.press(modalOverlay);
    expect(setVisibleMock).toHaveBeenCalledWith(false);
  });

  it('renders the tooltip text correctly', () => {
    const { getByText } = render(
      <CustomTooltip
        tooltipView={<Text>Test Tooltip</Text>}
        popoverPosition={{
          right: 0,
          top: 0,
        }}
        visible={true}
        popoverContainerStyle={popoverContainerStyle}
      />
    );
    const tooltipText = getByText('Test Tooltip');
    expect(tooltipText).toBeTruthy();
  });
});
