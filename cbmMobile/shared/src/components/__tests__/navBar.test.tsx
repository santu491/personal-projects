import { useNavigation } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React from 'react';

import { useAppContext } from '../../../../src/context/appContext';
import { HeaderTitleView } from '../headerTitleView';
import { NavBar } from '../navBar';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../../../src/context/appContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../../../../src/navigation/hooks/useBackToPrevious', () => ({
  useBackToPrevious: jest.fn(),
}));

jest.mock('../headerRight/headerRightComponent', () => 'HeaderRightComponent');
jest.mock('../headerLeftView', () => 'HeaderLeftView');
jest.mock('../headerTitleView', () => 'HeaderTitleView');

describe('NavBar', () => {
  const setOptionsMock = jest.fn();
  const navigationMock = { setOptions: setOptionsMock };
  const contextMock = {
    loggedIn: false,
    notificationCount: 0,
    navigationHandler: {
      linkTo: jest.fn(),
    },
  };

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue(navigationMock);
    (useAppContext as jest.Mock).mockReturnValue(contextMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set navigation options correctly', () => {
    render(<NavBar leftArrow={true} hideLogin={false} onPressLeftArrow={jest.fn()} />);

    expect(setOptionsMock).toHaveBeenCalledWith({
      headerRight: expect.any(Function),
      headerLeft: expect.any(Function),
      headerTitle: expect.any(Function),
      headerTitleAlign: 'center',
    });
  });

  it('should render HeaderRightComponent with correct props', () => {
    render(<NavBar leftArrow={true} hideLogin={false} onPressLeftArrow={jest.fn()} />);

    const headerRight = setOptionsMock.mock.calls[0][0].headerRight();
    expect(headerRight.props).toEqual({
      isLogin: false,
      isNotifcationIcon: false,
      loginTite: 'createAccount.loginButton',
      navigateToLogin: expect.any(Function),
      navigateToSearch: expect.any(Function),
      naviagteToNotifications: expect.any(Function),
      notificationCount: 0,
    });
  });

  it('should render HeaderLeftView when leftArrow is true', () => {
    render(<NavBar leftArrow={true} hideLogin={false} onPressLeftArrow={jest.fn()} />);

    const headerLeft = setOptionsMock.mock.calls[0][0].headerLeft();
    expect(headerLeft.props.children.props).toEqual({
      onPressLeftArrow: expect.any(Function),
    });
  });

  it('should not render HeaderLeftView when leftArrow is false', () => {
    render(<NavBar leftArrow={false} hideLogin={false} onPressLeftArrow={jest.fn()} />);

    const headerLeft = setOptionsMock.mock.calls[0][0].headerLeft();
    expect(headerLeft).not.toBeNull();
  });

  it('should render HeaderTitleView', () => {
    render(<NavBar leftArrow={true} hideLogin={false} onPressLeftArrow={jest.fn()} />);

    const headerTitle = setOptionsMock.mock.calls[0][0].headerTitle();
    expect(headerTitle.type).toBe(HeaderTitleView);
  });
});
