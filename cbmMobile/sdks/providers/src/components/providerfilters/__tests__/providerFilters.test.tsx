import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ProviderFilters } from '../providerFilters';

describe('ProviderFilters', () => {
  const mockOnCloseModal = jest.fn();
  const mockOnPressFilterOption = jest.fn();
  const mockOnPressFilterSection = jest.fn();
  const mockOnPressResults = jest.fn();
  const mockDistanceFn = jest.fn();

  const filtersList = [
    {
      attribute: 'testAttribute',
      name: 'Test Section',
      isOpened: true,
      data: [
        {
          attribute: 'testAttribute',
          title: 'Test Item',
          isSelected: false,
          count: 20,
        },
      ],
    },
  ];

  const distanceList = [
    {
      id: 1,
      label: 'lable',
      query: 'query',
    },
  ];

  it('renders the modal when isVisible is true', () => {
    const { getByTestId } = render(
      <ProviderFilters
        filtersList={filtersList}
        onCloseModal={mockOnCloseModal}
        onPressFilterOption={mockOnPressFilterOption}
        onPressFilterSection={mockOnPressFilterSection}
        onPressResults={mockOnPressResults}
        submitButtonTitle="Submit"
        distanceList={distanceList}
        onPressDistanceInfo={mockDistanceFn}
        selectedDistanceLabel={''}
      />
    );
    expect(getByTestId('close-button')).toBeTruthy();
  });

  it('calls onCloseModal when close button is pressed', () => {
    const { getByTestId } = render(
      <ProviderFilters
        filtersList={filtersList}
        onCloseModal={mockOnCloseModal}
        onPressFilterOption={mockOnPressFilterOption}
        onPressFilterSection={mockOnPressFilterSection}
        onPressResults={mockOnPressResults}
        submitButtonTitle="Submit"
        distanceList={distanceList}
        onPressDistanceInfo={mockDistanceFn}
        selectedDistanceLabel={''}
      />
    );
    fireEvent.press(getByTestId('close-button'));
    expect(mockOnCloseModal).toHaveBeenCalled();
  });

  it('renders the section headers and items', () => {
    const { getByText } = render(
      <ProviderFilters
        filtersList={filtersList}
        onCloseModal={mockOnCloseModal}
        onPressFilterOption={mockOnPressFilterOption}
        onPressFilterSection={mockOnPressFilterSection}
        onPressResults={mockOnPressResults}
        submitButtonTitle="Submit"
        distanceList={distanceList}
        onPressDistanceInfo={mockDistanceFn}
        selectedDistanceLabel={''}
      />
    );
    expect(getByText('Test Section')).toBeTruthy();
  });

  it('calls onPressFilterSection when section header is pressed', () => {
    const { getByTestId } = render(
      <ProviderFilters
        filtersList={filtersList}
        onCloseModal={mockOnCloseModal}
        onPressFilterOption={mockOnPressFilterOption}
        onPressFilterSection={mockOnPressFilterSection}
        onPressResults={mockOnPressResults}
        submitButtonTitle="Submit"
        distanceList={distanceList}
        onPressDistanceInfo={mockDistanceFn}
        selectedDistanceLabel={''}
      />
    );
    fireEvent.press(getByTestId('provider.filters.Test Section'));
    expect(mockOnPressFilterSection).toHaveBeenCalledWith('testAttribute');
  });

  it('calls onPressFilterOption when item is pressed', () => {
    const { getByTestId } = render(
      <ProviderFilters
        filtersList={filtersList}
        onCloseModal={mockOnCloseModal}
        onPressFilterOption={mockOnPressFilterOption}
        onPressFilterSection={mockOnPressFilterSection}
        onPressResults={mockOnPressResults}
        submitButtonTitle="Submit"
        distanceList={distanceList}
        onPressDistanceInfo={mockDistanceFn}
        selectedDistanceLabel={''}
      />
    );
    fireEvent.press(getByTestId('provider.filters.Test Item'));
    expect(mockOnPressFilterOption).toHaveBeenCalledWith(filtersList[0].data[0], filtersList[0]);
  });
});
