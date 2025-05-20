import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { SearchProvider } from '../../../model/providerSearchResponse';
import { MapView } from '../mapView';

const mockData: SearchProvider[] = [
  {
    id: '1',
    name: {
      firstName: 'John',
      lastName: 'Doe',
      displayName: '',
    },
    title: 'Provider Title',
    contact: {
      address: {
        location: { lat: 37.78825, lon: -122.4324 },
        addr1: '',
        addr2: '',
        city: '',
        state: '',
        zip: '',
      },
      fax: '',
      officeEmail: '',
      phone: '',
      website: '',
    },
  },
  {
    id: '2',
    name: {
      firstName: 'Jane',
      lastName: 'Smith',
      displayName: '',
    },
    title: 'Another Provider',
    contact: {
      address: {
        location: { lat: 37.78925, lon: -122.4334 },
        addr1: '',
        addr2: '',
        city: '',
        state: '',
        zip: '',
      },
      fax: '',
      officeEmail: '',
      phone: '',
      website: '',
    },
  },
];

describe('MapView Component', () => {
  it('renders the map and markers correctly', () => {
    const { getByTestId } = render(
      <MapView data={mockData} onPressListView={() => {}} onPressViewProfile={() => {}} />
    );
    expect(getByTestId('map-view')).toBeTruthy();
    expect(getByTestId('marker-1')).toBeTruthy();
    expect(getByTestId('marker-2')).toBeTruthy();
  });

  it('calls onPressListView when the list view button is pressed', () => {
    const mockOnPressListView = jest.fn();
    const { getByText } = render(<MapView data={mockData} onPressListView={mockOnPressListView} />);
    fireEvent.press(getByText('List View'));
    expect(mockOnPressListView).toHaveBeenCalled();
  });

  it('opens the drawer when a marker is pressed', () => {
    const { getByTestId, getByText } = render(<MapView data={mockData} />);
    fireEvent.press(getByTestId('marker-1'));
    expect(getByText('JOHN DOE, Provider Title')).toBeTruthy();
  });

  it('calls onPressViewProfile when the View Profile button is pressed', () => {
    const mockOnPressViewProfile = jest.fn();
    const { getByTestId, getByText } = render(<MapView data={mockData} onPressViewProfile={mockOnPressViewProfile} />);
    fireEvent.press(getByTestId('marker-1'));
    fireEvent.press(getByText('providers.viewProfile'));
    expect(mockOnPressViewProfile).toHaveBeenCalledWith(mockData[0]);
  });
});
