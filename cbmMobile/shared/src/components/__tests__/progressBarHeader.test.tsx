import { useNavigation } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React from 'react';

import { ProgressBarHeader } from '../progressBarHeader/progressBarHeader';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('ProgressBarHeader', () => {
  const setOptionsMock = jest.fn();
  const navigationMock = {
    setOptions: setOptionsMock,
  };

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue(navigationMock);
    setOptionsMock.mockClear();
  });

  it('should render ProgressBarHeader with default props', () => {
    render(<ProgressBarHeader progressStepsCount={2} totalStepsCount={5} leftArrow={false} />);

    expect(setOptionsMock).toHaveBeenCalledWith({
      headerLeft: expect.any(Function),
      headerTitle: expect.any(Function),
      headerRight: expect.any(Function),
    });
  });
});
