import { fireEvent, render } from '@testing-library/react-native';

import { BenefitCard } from '../benefitCard/benefitCard';

describe('BenefitCard Component', () => {
  const mockOnPress = jest.fn();

  const props = {
    title: 'Test Benefit Title',
    description: 'This is a test description for the benefit card.',
    onPress: mockOnPress,
    testID: 'benefit-card-test-id',
  };

  it('renders the title and description correctly', () => {
    const { getByText } = render(<BenefitCard {...props} />);

    // Check if the title is rendered
    expect(getByText(props.title)).toBeTruthy();

    // Check if the description is rendered
    expect(getByText(props.description)).toBeTruthy();
  });

  it('calls the onPress function when pressed', () => {
    const { getByTestId } = render(<BenefitCard {...props} />);

    // Simulate a press event
    fireEvent.press(getByTestId(props.testID));

    // Verify that the onPress function was called
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
