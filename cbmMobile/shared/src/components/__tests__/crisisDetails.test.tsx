import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Linking } from 'react-native';

import { CrisisDetailProps, CrisisDetails } from '../crisisDetails/crisisDetails';

const mockProps: CrisisDetailProps = {
  title: 'Crisis Support',
  hotlineTitle: 'Hotline',
  coverageTitle: 'Coverage',
  listData: [
    {
      item: {
        prefixText: undefined,
        text: 'Hotline 1',
        link: 'http://hotline1.com',
        suffixText: undefined,
        hours: ['9am - 5pm'],
      },
      details: [
        {
          text: 'Detail 1',
          prefixText: 'Prefix 1',
          suffixText: 'Suffix 1',
          link: 'http://detail1.com',
          hours: ['9am - 5pm'],
        },
      ],
    },
    {
      item: { text: 'Hotline 2', link: undefined, suffixText: undefined, hours: ['9am - 5pm'] },
      details: [
        {
          prefixText: undefined,
          text: 'Detail 2',
          suffixText: undefined,
          link: undefined,
          hours: [],
        },
      ],
    },
  ],
};

describe('CrisisDetails Component', () => {
  it('renders the title correctly', () => {
    const { getByTestId } = render(<CrisisDetails {...mockProps} />);
    expect(getByTestId('crisisDetails.title').props.children).toBe(mockProps.title);
  });

  it('renders the hotline and coverage titles correctly', () => {
    const { getByTestId } = render(<CrisisDetails {...mockProps} />);
    expect(getByTestId('crisisDetails.header.hotText').props.children).toBe(mockProps.hotlineTitle);
    expect(getByTestId('crisisDetails.header.coverageText').props.children).toBe(mockProps.coverageTitle);
  });
  it('renders the list data correctly', () => {
    const { getByText } = render(<CrisisDetails {...mockProps} />);

    // Check for the first item and its details
    expect(getByText('Hotline 1')).toBeTruthy();
    expect(getByText('Detail 1')).toBeTruthy();
    expect(getByText('Prefix 1')).toBeTruthy();
    expect(getByText('Suffix 1')).toBeTruthy();

    // Check for the second item and its details
    expect(getByText('Hotline 2')).toBeTruthy();
    expect(getByText('Detail 1')).toBeTruthy();
  });
  it('handles link opening correctly', () => {
    const openURLMock = jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());
    const { getByText } = render(<CrisisDetails {...mockProps} />);

    // Simulate pressing the link
    fireEvent.press(getByText('Hotline 1'));
    expect(openURLMock).toHaveBeenCalledWith('http://hotline1.com');

    fireEvent.press(getByText('Detail 1'));
    expect(openURLMock).toHaveBeenCalledWith('http://detail1.com');

    openURLMock.mockRestore();
  });

  it('does not render CustomTooltip when hours are not provided', () => {
    const modifiedProps = {
      ...mockProps,
      listData: [
        {
          item: { text: 'Hotline 3', link: undefined, suffixText: undefined, hours: [] },
          details: [
            {
              prefixText: undefined,
              text: 'Detail 3',
              suffixText: undefined,
              link: undefined,
              hours: [],
            },
          ],
        },
      ],
    };
    const { queryByText } = render(<CrisisDetails {...modifiedProps} />);

    // Check that the tooltip text is not present
    expect(queryByText('9am - 5pm')).toBeNull();
  });
});
