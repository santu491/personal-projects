import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AppContextWapper } from '../../../../src/context/appContextWrapper';
import { HeaderRightComponent } from '../headerRight/headerRightComponent';

describe('HeaderRightComponent', () => {
  it('renders without crashing', () => {
    render(
      <AppContextWapper>
        <HeaderRightComponent isLogin={true} isNotifcationIcon={false} />
      </AppContextWapper>
    );
  });

  it('navigates to search when search icon is pressed', () => {
    const navigateToSearch = jest.fn();
    const { getByTestId } = render(
      <AppContextWapper>
        <HeaderRightComponent
          isLogin={true}
          navigateToSearch={navigateToSearch}
          isNotifcationIcon={false}
          isSearchIcon={true}
        />
      </AppContextWapper>
    );

    fireEvent.press(getByTestId('header.search.icon'));

    expect(navigateToSearch).toHaveBeenCalled();
  });

  it('does not render search icon when searchIconVisible is false', () => {
    const { queryByTestId } = render(
      <AppContextWapper>
        <HeaderRightComponent isLogin={true} isNotifcationIcon={false} isSearchIcon={false} />{' '}
      </AppContextWapper>
    );

    expect(queryByTestId('header.search.icon')).toBeNull();
  });

  it('does render notification icon when notificationIcon is true', () => {
    const { queryByTestId } = render(
      <AppContextWapper>
        <HeaderRightComponent isLogin={true} isNotifcationIcon={true} />{' '}
      </AppContextWapper>
    );

    expect(queryByTestId('notification.button.icon')).toBeTruthy();
  });
});
