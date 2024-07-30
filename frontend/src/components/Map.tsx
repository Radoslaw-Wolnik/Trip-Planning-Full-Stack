import React, { useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Place } from '../types';

// API Key should be securely handled
const API_KEY = 'AIzaSyARi-kUu_m7dTo5nXxLjPfiueU8iC4EIAU';

interface MapProps {
  places: Place[];
  onMapClick?: (lat: number, lng: number) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const Map: React.FC<MapProps> = ({ places, onMapClick }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
  });

  // Memoize values
  const center = useMemo(() => {
    if (places.length === 0) {
      return { lat: 0, lng: 0 };
    }
    const firstPlace = places[0];
    return {
      lat: firstPlace.latitude ?? 0,
      lng: firstPlace.longitude ?? 0,
    };
  }, [places]);

  const markers = useMemo(() => {
    console.log('places memo render', places);
    return places.map((place) => ({
      key: `${place.latitude}-${place.longitude}`,
      position: { lat: place.latitude ?? 0, lng: place.longitude ?? 0 },
      label: `${place.order}`,
    }));
  }, [places]);

  // Handle loading and error state
  if (loadError) {
    console.error("Error loading Google Maps script:", loadError);
    return <div>Error loading maps: {loadError.message}</div>;
  }

  if (!isLoaded) return <div>Loading maps...</div>;

  

  // Event handler
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (onMapClick && e.latLng) {
      onMapClick(e.latLng.lat(), e.latLng.lng());
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={5}
      onClick={handleMapClick}
    >
      <Marker position={center} />
      {markers.map((marker) => (
        <Marker
          key={marker.key}
          position={marker.position}
          label={marker.label}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;
