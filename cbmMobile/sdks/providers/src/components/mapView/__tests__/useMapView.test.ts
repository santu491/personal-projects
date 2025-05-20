import { act, renderHook } from '@testing-library/react-hooks';

import { SearchProviderDTO } from '../../../model/providerSearchResponse';
import { useMapView } from '../useMapView';

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(() => true),
}));

jest.mock('../../../../../../shared/src/utils/utils');

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(() => true),
}));

const mockData: SearchProviderDTO[] = [
  {
    id: '1',
    title: 'Dr. John Doe',
    name: {
      firstName: 'john',
      lastName: 'doe',
      displayName: '',
    },
    contact: {
      address: {
        location: { lat: 40.7128, lon: -74.006 },
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
    title: 'Dr. Jane Smith',
    name: {
      firstName: 'jane',
      lastName: 'smith',
      displayName: '',
    },
    contact: {
      address: {
        location: { lat: 34.0522, lon: -118.2437 },
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

describe('useMapView', () => {
  it('should initialize with correct region', () => {
    const { result } = renderHook(() => useMapView(mockData));
    expect(result.current.region).toEqual({
      latitude: 40.7128,
      longitude: -74.006,
      latitudeDelta: 1,
      longitudeDelta: 1,
    });
  });

  it('should handle marker press and set selected provider', () => {
    const { result } = renderHook(() => useMapView(mockData));
    act(() => {
      result.current.onPressMarker(mockData[1]);
    });
    expect(result.current.selectedProvider).toEqual(mockData[1]);
    expect(result.current.isDrawerEnabled).toBe(true);
  });

  it('should close the drawer and clear selected provider', () => {
    const { result } = renderHook(() => useMapView(mockData));
    act(() => {
      result.current.onPressMarker(mockData[0]);
      result.current.onRequestClose();
    });
    expect(result.current.selectedProvider).toBeUndefined();
    expect(result.current.isDrawerEnabled).toBe(false);
  });

  it('should handle zoom in and zoom out', () => {
    const { result } = renderHook(() => useMapView(mockData));
    act(() => {
      result.current.handleZoom(true); // Zoom in
    });
    expect(result.current.region?.latitudeDelta).toBe(0.5);
    expect(result.current.region?.longitudeDelta).toBe(0.5);

    act(() => {
      result.current.handleZoom(false); // Zoom out
    });
    expect(result.current.region?.latitudeDelta).toBe(1);
    expect(result.current.region?.longitudeDelta).toBe(1);
  });
});
