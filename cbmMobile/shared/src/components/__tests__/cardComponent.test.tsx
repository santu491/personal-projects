import { render } from '@testing-library/react-native';
import React from 'react';

import { CardComponent } from '../cardComponent';

describe('CardComponent', () => {
  const cardItems = ['Item 1', 'Item 2', 'Item 3'];

  it('renders card items correctly', () => {
    const { getByText } = render(<CardComponent cardItems={cardItems} />);

    cardItems.forEach((item) => {
      expect(getByText(item)).toBeTruthy();
    });
  });

  it('applies custom styles correctly', () => {
    const mainViewStyle = { backgroundColor: 'red' };
    const subViewStyle = { margin: 10 };
    const textStyle = { color: 'blue' };
    const testID = 'main-view';

    const { getByTestId, getByText } = render(
      <CardComponent
        cardItems={cardItems}
        mainViewStyle={mainViewStyle}
        subViewStyle={subViewStyle}
        textStyle={textStyle}
        testID={testID}
      />
    );

    const mainView = getByTestId(testID);
    const textElements = cardItems.map((item) => getByText(item));
    expect(mainView).toBeDefined();
    textElements.forEach((textElement) => {
      expect(textElement).toBeDefined();
    });
  });
});
