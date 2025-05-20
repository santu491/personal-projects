import { render } from '@testing-library/react-native';
import React from 'react';

import { ContentWindow } from '../contentWindow';

const sourceUrl = 'https://www.google.com';

describe('ContentWindow render', () => {
  it('renders correctly with children', () => {
    const { getByTestId } = render(<ContentWindow sourceUrl={sourceUrl} testID={'content-window'} />);
    expect(getByTestId('content-window')).toBeTruthy();
  });
});
