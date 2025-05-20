import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { mockProviderInfo } from '../../../__mocks__/mockProviderInfo';
import { ProvidersMockContextWrapper } from '../../../__mocks__/providersMockContextWrapper';
import { ProviderListComponent } from '../providerListComponent';

describe('ProviderListComponent', () => {
  const mockOnPress = jest.fn();
  const onHandleSelectProvider = jest.fn();

  it('renders provider information correctly', () => {
    const { getByTestId } = render(
      <ProvidersMockContextWrapper>
        <ProviderListComponent
          providerInfo={mockProviderInfo}
          onPress={mockOnPress}
          onHandleSelectProvider={onHandleSelectProvider}
        />
      </ProvidersMockContextWrapper>
    );
    expect(getByTestId('profile-title')).toBeTruthy();
  });

  it('calls onPress when provider is pressed', () => {
    const { getByTestId } = render(
      <ProvidersMockContextWrapper>
        <ProviderListComponent
          providerInfo={mockProviderInfo}
          onPress={mockOnPress}
          onHandleSelectProvider={onHandleSelectProvider}
        />
      </ProvidersMockContextWrapper>
    );

    const providerComponent = getByTestId('profile-title');
    fireEvent.press(providerComponent);

    expect(mockOnPress).toHaveBeenCalledWith(mockProviderInfo.id);
  });

  it('renders correctly', () => {
    const { getByTestId } = render(
      <ProvidersMockContextWrapper>
        <ProviderListComponent
          providerInfo={mockProviderInfo}
          onPress={mockOnPress}
          onHandleSelectProvider={jest.fn()}
        />
      </ProvidersMockContextWrapper>
    );
    expect(getByTestId('mainCardView')).toBeTruthy();
  });

  it('should render the component correctly', () => {
    const { getByTestId } = render(
      <ProvidersMockContextWrapper>
        <ProviderListComponent
          providerInfo={mockProviderInfo}
          onPress={mockOnPress}
          onHandleSelectProvider={onHandleSelectProvider}
        />
      </ProvidersMockContextWrapper>
    );

    expect(getByTestId('mainCardView')).toBeTruthy();
  });

  it('should call onPress when the profile title is pressed', () => {
    const { getByTestId } = render(
      <ProvidersMockContextWrapper>
        <ProviderListComponent
          providerInfo={mockProviderInfo}
          onPress={mockOnPress}
          onHandleSelectProvider={onHandleSelectProvider}
        />
      </ProvidersMockContextWrapper>
    );
    expect(getByTestId('profile-title')).toBeTruthy();
  });

  it('should call setSelectedData when favorite button is pressed', () => {
    const { getByTestId } = render(
      <ProvidersMockContextWrapper>
        <ProviderListComponent
          providerInfo={mockProviderInfo}
          onPress={mockOnPress}
          onHandleSelectProvider={jest.fn()}
        />
      </ProvidersMockContextWrapper>
    );

    const selectButton = getByTestId('provider.selectButton');
    fireEvent.press(selectButton);
  });
});
