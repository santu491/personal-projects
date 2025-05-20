import { render } from '@testing-library/react-native';
import React from 'react';

import { ClientMockContextWrapper } from '../../__mocks__/clientMockContextWrapper';
import { ClientSearch } from '../clientSearch/clientSearch';

describe('ClientSearch', () => {
  const onBlurClientInput = jest.fn();
  const onChangeClientName = jest.fn();
  const onFocusClientInput = jest.fn();
  const onPressClientName = jest.fn();

  it('does not render the ActionButton when isClientFocused is false', () => {
    const { queryByTestId } = render(
      <ClientMockContextWrapper>
        <ClientSearch
          clientsList={undefined}
          isClientFocused={false}
          onBlurClientInput={onBlurClientInput}
          onChangeClientName={onChangeClientName}
          onFocusClientInput={onFocusClientInput}
          onPressClientName={onPressClientName}
          searchError={undefined}
          searchText={''}
        />
      </ClientMockContextWrapper>
    );

    expect(queryByTestId('find.search.button')).toBeNull();
  });

  it('displays error message when searchError is provided', () => {
    const { getByTestId } = render(
      <ClientMockContextWrapper>
        <ClientSearch
          clientsList={[]}
          isClientFocused={false}
          onBlurClientInput={onBlurClientInput}
          onChangeClientName={onChangeClientName}
          onFocusClientInput={onFocusClientInput}
          onPressClientName={onPressClientName}
          searchError={'Error occurred'}
          searchText={''}
        />
      </ClientMockContextWrapper>
    );

    expect(getByTestId('client.search.error.message')).toBeTruthy();
  });
});
