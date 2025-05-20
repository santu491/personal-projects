import { render } from '@testing-library/react-native';
import React from 'react';

import { AppContextWapper } from '../../../../src/context/appContextWrapper';
import { HeaderTitleView } from '../headerTitleView';

describe('HeaderTitleView', () => {
  it('renders correctly when user is logged in and immediate assist is enabled', () => {
    const { getByTestId } = render(
      <AppContextWapper>
        <HeaderTitleView />
      </AppContextWapper>
    );

    const headerLogo = getByTestId('header-logo');
    expect(headerLogo).toBeTruthy();
  });
});
