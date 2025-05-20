import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import RNMap from 'react-native-maps';

import { openMap, toPascalCase } from '../../../../../shared/src/utils/utils';
import { SearchProvider } from '../../model/providerSearchResponse';

export const useMapView = (data: SearchProvider[], onPressViewProfile?: (provider: SearchProvider) => void) => {
  const [isDrawerEnabled, setDrawerEnabled] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<SearchProvider | undefined>(undefined);
  const [region, setRegion] = useState(
    data[0].contact?.address.location.lat && data[0].contact.address.location.lon
      ? {
          latitude: data[0].contact.address.location.lat,
          longitude: data[0].contact.address.location.lon,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }
      : null
  );

  const isFocused = useIsFocused();
  const mapRef = React.useRef<RNMap>(null);

  useEffect(() => {
    if (isFocused && selectedProvider) {
      setDrawerEnabled(true);
    }
  }, [isFocused, selectedProvider]);

  useEffect(() => {
    if (mapRef.current && data.length > 0) {
      const coordinates = data
        .map((provider) => {
          if (!provider.contact?.address.location.lat || !provider.contact.address.location.lon) {
            return null;
          }
          return {
            latitude: provider.contact.address.location.lat,
            longitude: provider.contact.address.location.lon,
          };
        })
        .filter((coord): coord is { latitude: number; longitude: number } => coord !== null); // Ensure non-null values
      if (coordinates.length > 0) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
          },
          animated: true,
        });
      }
    }
  }, [data]);

  const handleZoom = (zoomIn: boolean) => {
    if (region) {
      const factor = zoomIn ? 0.5 : 2;
      const updatedRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta * factor,
        longitudeDelta: region.longitudeDelta * factor,
      };
      setRegion(updatedRegion);
      mapRef.current?.animateToRegion(updatedRegion, 200);
    }
  };

  const fullName = React.useMemo(() => {
    const { firstName = '', lastName = '' } = selectedProvider?.name || {};
    return `${toPascalCase(firstName)} ${toPascalCase(lastName)}`;
  }, [selectedProvider]);

  const onPressMarker = (provider: SearchProvider) => {
    setDrawerEnabled(true);
    setSelectedProvider(provider);
  };

  const onPressProfile = () => {
    if (selectedProvider) {
      setDrawerEnabled(false);
      onPressViewProfile?.(selectedProvider);
    }
  };

  const onRequestClose = () => {
    setDrawerEnabled(false);
    setSelectedProvider(undefined);
  };

  const onPressGetDirections = () => {
    const location = selectedProvider?.contact?.address.location;

    if (location?.lat && location.lon) {
      openMap(location.lat, location.lon);
    }
  };
  return {
    isDrawerEnabled,
    selectedProvider,
    fullName,
    onPressMarker,
    onPressProfile,
    onRequestClose,
    onPressGetDirections,
    mapRef,
    handleZoom,
    setRegion,
    region,
  };
};
