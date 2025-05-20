import { Drawer } from '@sydney/motif-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNMap, { Marker } from 'react-native-maps';

import { ListViewIcon, LocationIcon } from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components';
import { SearchProvider } from '../../model/providerSearchResponse';
import { ContactComponent } from '../contact/contactComponent';
import { styles } from './mapView.styles';
import { useMapView } from './useMapView';

export interface MapViewProps {
  data: SearchProvider[] | [];
  onPressListView?: () => void;
  onPressViewProfile?: (provider: SearchProvider) => void;
}

export const MapView = ({ data, onPressListView, onPressViewProfile }: MapViewProps) => {
  const {
    isDrawerEnabled,
    selectedProvider,
    fullName,
    onPressMarker,
    onPressProfile,
    onRequestClose,
    onPressGetDirections,
    handleZoom,
    setRegion,
    region,
    mapRef,
  } = useMapView(data, onPressViewProfile);
  const { t } = useTranslation();

  return (
    <View style={styles.mapViewContainer}>
      <TouchableOpacity style={styles.listViewButton} onPress={onPressListView} activeOpacity={0.8}>
        <ListViewIcon />
        <Text style={styles.listViewLabel}>List View</Text>
      </TouchableOpacity>

      {region ? (
        <RNMap
          testID="map-view"
          region={region}
          onRegionChangeComplete={setRegion}
          zoomEnabled={true}
          style={{ ...StyleSheet.absoluteFillObject }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          ref={mapRef}
        >
          {data.map((provider) => {
            return (
              <>
                {provider.contact?.address.location.lat && provider.contact.address.location.lon ? (
                  <Marker
                    testID={`marker-${provider.id}`}
                    key={provider.id}
                    coordinate={{
                      latitude: Number(provider.contact.address.location.lat), // Ensure latitude is a number
                      longitude: Number(provider.contact.address.location.lon), // Ensure longitude is a number
                    }}
                    onPress={() => onPressMarker(provider)}
                  >
                    <LocationIcon width={26} height={33} />
                  </Marker>
                ) : null}
              </>
            );
          })}
        </RNMap>
      ) : null}

      <View style={styles.zoomControls}>
        <TouchableOpacity onPress={() => handleZoom(true)} style={styles.zoomButton}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleZoom(false)} style={styles.zoomButton}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>

      {selectedProvider ? (
        <Drawer
          hideDrawerHeader
          visible={isDrawerEnabled}
          onRequestClose={onRequestClose}
          children={
            <>
              <Text style={styles.providerName}>
                {fullName.toUpperCase()}, {selectedProvider.title}
              </Text>
              <View style={styles.contactView}>
                <ContactComponent
                  providerInfo={selectedProvider}
                  hasAccordionView={false}
                  textStyle={styles.contactInfoText}
                  isMapView={true}
                />
              </View>
              <ActionButton
                title={t('providers.viewProfile')}
                onPress={onPressProfile}
                style={styles.viewProfileButton}
              />
              <ActionButton
                title={t('providers.getDirections')}
                onPress={onPressGetDirections}
                style={styles.directionButton}
                textStyle={styles.directionButtonText}
              />
            </>
          }
        />
      ) : null}
    </View>
  );
};
