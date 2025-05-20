import { fireEvent, render } from '@testing-library/react-native';
import { default as React } from 'react';

import { DisclaimerView } from '../disclaimerPopup/disclaimerComponent';

describe('CopyRightsComponent', () => {
  const learnMoreLinkClicked = jest.fn();

  it('should call learnMoreLinkClicked when the link is pressed', () => {
    const { getByText } = render(<DisclaimerView viewStyle={{}} learnMoreLinkClicked={learnMoreLinkClicked} />);

    fireEvent.press(getByText('providers.learnMore'));

    expect(learnMoreLinkClicked).toHaveBeenCalled();
  });
});
