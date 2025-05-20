import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { MenuMockContextWrapper } from '../../../__mocks__/menuMockContextWrapper';
import { AnalyticsLog } from '../analyticsLog';

describe('AnalyticsLog', () => {
  it('should render the MainHeaderComponent', () => {
    const { getByText } = render(
      <MenuMockContextWrapper>
        <AnalyticsLog />
      </MenuMockContextWrapper>
    );
    expect(getByText('Please enter session URL below and tap on Start Session.')).toBeTruthy();
  });

  it('should render the session input field', () => {
    const { getByTestId } = render(
      <MenuMockContextWrapper>
        <AnalyticsLog />
      </MenuMockContextWrapper>
    );
    const input = getByTestId('debug.analytics.session-input');
    expect(input).toBeTruthy();
  });

  it('should call onSessionURLChange when text is entered in the input field', () => {
    const { getByTestId } = render(
      <MenuMockContextWrapper>
        <AnalyticsLog />
      </MenuMockContextWrapper>
    );
    const input = getByTestId('debug.analytics.session-input');
    fireEvent.changeText(input, 'https://example.com');
    expect(input.props.value).toBe('https://example.com');
  });

  it('should render the Start Session button', () => {
    const { getByTestId } = render(
      <MenuMockContextWrapper>
        <AnalyticsLog />
      </MenuMockContextWrapper>
    );
    const button = getByTestId('menu.session.button');
    expect(button).toBeTruthy();
  });
});
