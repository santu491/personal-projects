import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ApiFailError } from '../apiFailError/apiFailError';

describe('ApiFailError', () => {
  it('renders correctly without support number', () => {
    const { getByText, queryByText } = render(<ApiFailError />);

    expect(getByText('errors.appUnavailable.title')).toBeTruthy();
    expect(getByText('errors.appUnavailable.description')).toBeTruthy();
    expect(queryByText('123-456-7890')).toBeNull();
  });

  it('calls onPressContact when support number is pressed', () => {
    const onPressContactMock = jest.fn();
    const { getByTestId } = render(<ApiFailError supportNo="123-456-7890" onPressContact={onPressContactMock} />);

    fireEvent.press(getByTestId('apiFailError.contactNo'));
    expect(onPressContactMock).toHaveBeenCalled();
  });
});
