import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
// the problem was using Markers with react in Strict mode doesnt work insted usage of MarkerF
import { Place } from '../types';
import enviorement from '../config/enviorement';

// API Key should be securely handled
//const API_KEY = '';

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
    googleMapsApiKey: enviorement.GOOGLE_MAPS_API_KEY,
  });

 // Memoize the center of the map
 const center = useMemo(() => {
  if (places.length === 0) return { lat: 0, lng: 0 };
  const { latitude = 0, longitude = 0 } = places[0];
  return { lat: latitude, lng: longitude };
}, [places]);

  /*
  const markers = useMemo(() => {
    console.log('places memo render', places);
    return places.map((place) => ({
      key: `${place.latitude}-${place.longitude}`,
      position: { lat: place.latitude ?? 0, lng: place.longitude ?? 0 },
      label: `${place.order}`,
    }));
  }, [places]);
*/

  // State to hold markers, including their order
  const [markers, setMarkers] = useState(() => 
    places.map((place) => ({
      key: `${place.latitude}-${place.longitude}`,
      position: { lat: place.latitude ?? 0, lng: place.longitude ?? 0 },
      label: `${place.order}`,
    }))
  );

  // Update markers when places change
  useEffect(() => {
    setMarkers(
      places.map((place) => ({
        key: `${place.latitude}-${place.longitude}`,
        position: { lat: place.latitude ?? 0, lng: place.longitude ?? 0 },
        label: `${place.order}`,
      }))
    );
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
      {markers.map((marker) => (
        <MarkerF
          key={marker.key}
          position={marker.position}
          label={marker.label}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;
