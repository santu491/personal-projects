import { render } from '@testing-library/react-native';
import React from 'react';

import { DotPagination } from '../dotPagination';

describe('DotPagination', () => {
  it('renders the correct number of dots', () => {
    const totalStepsCount = 5;
    const { getAllByTestId } = render(
      <DotPagination totalStepsCount={totalStepsCount} backgroundColor={() => 'blue'} />
    );

    const dots = getAllByTestId('dot-item');
    expect(dots).toHaveLength(totalStepsCount);
  });

  it('applies the correct background color to each dot', () => {
    const totalStepsCount = 3;
    const backgroundColor = jest.fn((index) => `color-${index}`);
    const { getAllByTestId } = render(
      <DotPagination totalStepsCount={totalStepsCount} backgroundColor={backgroundColor} />
    );

    const dots = getAllByTestId('dot-item');
    dots.forEach((dot, index) => {
      expect(dot.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: `color-${index}`,
          }),
        ])
      );
    });
  });

  it('sets the testID correctly', () => {
    const testID = 'pagination-test';
    const { getByTestId } = render(
      <DotPagination totalStepsCount={3} backgroundColor={() => 'blue'} testID={testID} />
    );

    const paginationView = getByTestId(testID);
    expect(paginationView).toBeTruthy();
  });
});
