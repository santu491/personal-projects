import { render } from '@testing-library/react-native';
import { default as React } from 'react';

import { ProgressLoader } from '../progressLoader';

describe('ProgressLoader Component', () => {
  it('should render nothing when isVisible is false', () => {
    const { queryByTestId } = render(<ProgressLoader isVisible={false} />);
    expect(queryByTestId('progress-testId')).toBeNull();
  });

  it('should show privacy policy modal.', async () => {
    const { getByTestId } = render(<ProgressLoader isVisible={true} />);
    const test = getByTestId('progress-modal');
    expect(test).toBeTruthy();
  });
});
