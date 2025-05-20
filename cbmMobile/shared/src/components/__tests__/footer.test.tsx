import { render } from '@testing-library/react-native';
import React from 'react';

import { Footer } from '../footer';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });

  it('renders with custom footer style', () => {
    const customStyle = { color: 'red', fontSize: 16 };
    const { getByTestId } = render(<Footer footerStyle={customStyle} />);
    const footerText = getByTestId('footer-text');
    expect(footerText.props.style).toEqual(customStyle);
  });

  it('renders the correct text', () => {
    const { getByText } = render(<Footer />);
    const footerText = getByText('footer.copyRight |');
    expect(footerText).toBeTruthy();
  });

  it('renders the privacy policy link', () => {
    const { getByText } = render(<Footer />);
    const privacyPolicyLink = getByText('footer.privacy');
    expect(privacyPolicyLink).toBeTruthy();
  });
});
