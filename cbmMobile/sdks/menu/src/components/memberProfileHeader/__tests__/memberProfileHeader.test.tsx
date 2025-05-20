import { render } from '@testing-library/react-native';
import React from 'react';

import { MemberProfileHeader } from '../memberProfileHeader';

describe('MemberProfileHeader', () => {
  it('renders title correctly', () => {
    const { getByTestId } = render(<MemberProfileHeader title="Test Title" testID="title" />);
    const titleElement = getByTestId('title');
    expect(titleElement.props.children).toBe('Test Title');
  });
});
