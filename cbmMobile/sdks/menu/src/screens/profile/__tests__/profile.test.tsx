import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { MenuMockContextWrapper } from '../../../__mocks__/menuMockContextWrapper';
import { Profile } from '../profile';

jest.mock('../../../../../../src/util/commonUtils');

describe('Profile', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });
  it('renders without crashing', () => {
    render(
      <MenuMockContextWrapper>
        <Profile />
      </MenuMockContextWrapper>
    );
  });

  it('displays the main header', () => {
    const { getByTestId } = render(
      <MenuMockContextWrapper>
        <Profile />
      </MenuMockContextWrapper>
    );
    const mainHeader = getByTestId('menu.profile.title');
    expect(mainHeader).toBeTruthy();
  });
});
