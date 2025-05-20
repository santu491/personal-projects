import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { ProvidersMockContextWrapper } from '../../../__mocks__/providersMockContextWrapper';
import { ProviderSearch } from '../providerSearch';

jest.mock('../../../../../../src/util/commonUtils');

describe('ProviderSearch', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });
  const onSubmitCounselor = jest.fn();
  const onSubmitLocation = jest.fn();
  it('renders the ActionButton when hasSearchButton is true', () => {
    const { getByTestId } = render(
      <ProvidersMockContextWrapper>
        <ProviderSearch
          hasSearchButton={true}
          onSubmitCounselor={onSubmitCounselor}
          onSubmitLocation={onSubmitLocation}
        />
      </ProvidersMockContextWrapper>
    );

    expect(getByTestId('find.search.button')).toBeTruthy();
  });

  it('does not render the ActionButton when hasSearchButton is false', () => {
    const { queryByTestId } = render(
      <ProvidersMockContextWrapper>
        <ProviderSearch hasSearchButton={false} />
      </ProvidersMockContextWrapper>
    );

    expect(queryByTestId('find.search.button')).toBeNull();
  });
});
