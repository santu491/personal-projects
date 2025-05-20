import { render } from '@testing-library/react-native';
import React from 'react';

import { ProgressBarList } from '../../../../../shared/src/components/progressBarHeader/progressBarList';

describe('ProgressBarList', () => {
  it('renders the correct number of progress items', () => {
    const totalStepsCount = 5;
    const { getAllByTestId } = render(
      <ProgressBarList totalStepsCount={totalStepsCount} backgroundColor={() => 'blue'} />
    );
    const progressItems = getAllByTestId('progress-item');
    expect(progressItems.length).toBe(totalStepsCount);
  });
});
