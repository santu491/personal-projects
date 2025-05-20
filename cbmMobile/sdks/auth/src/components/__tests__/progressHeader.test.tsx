import { render } from '@testing-library/react-native';
import React from 'react';

import { AuthMockContextWrapper } from '../../__mocks__/authMockContextWrapper';
import { ProgressHeader } from '../progressHeader/progressHeader';

describe('ProgressHeader', () => {
  it('does not render left arrow when leftArrow prop is false', () => {
    const { queryByTestId } = render(
      <AuthMockContextWrapper>
        <ProgressHeader leftArrow={false} totalStepsCount={5} progressStepsCount={2} />
      </AuthMockContextWrapper>
    );
    const headerLeftView = queryByTestId('left-arrow-button');
    expect(headerLeftView).toBeNull();
  });
});
