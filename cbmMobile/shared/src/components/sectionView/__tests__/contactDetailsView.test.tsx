import '@testing-library/jest-native/extend-expect';

import { render } from '@testing-library/react-native';
import React from 'react';

import { ContactDetailsView } from '../contactDetailsView';

describe('ContactDetailsView', () => {
  it('renders header title correctly', () => {
    const headerTitle = 'Contact Details';
    const { getByTestId } = render(<ContactDetailsView headerTitle={headerTitle} viewStyle={{}} />);
    const headerElement = getByTestId('contact-details-header');
    expect(headerElement).toHaveTextContent(headerTitle);
  });
});
