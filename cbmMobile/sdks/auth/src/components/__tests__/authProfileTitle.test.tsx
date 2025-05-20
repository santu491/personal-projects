import { render } from '@testing-library/react-native';
import React from 'react';

import { AuthProfileTitle } from '../authProfile/authProfileTitle';

describe('AuthProfileTitle', () => {
  it('renders the title and subtitle correctly', () => {
    const title = 'Profile Title';
    const subTitle = 'Profile Subtitle';
    const { getByText } = render(<AuthProfileTitle title={title} subTitle={subTitle} />);

    const titleElement = getByText(title);
    const subTitleElement = getByText(subTitle);

    expect(titleElement).toBeTruthy();
    expect(subTitleElement).toBeTruthy();
  });

  it('renders the title with the provided testID', () => {
    const title = 'Profile Title';
    const testID = 'auth-profile-title';
    const { getByTestId } = render(<AuthProfileTitle title={title} subTitle="" testID={testID} />);

    const titleElement = getByTestId(testID);

    expect(titleElement).toBeTruthy();
  });
});
