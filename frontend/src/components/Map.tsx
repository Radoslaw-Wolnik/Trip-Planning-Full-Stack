import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface Place {
  name: string;
  date: Date;
  latitude: number;
  longitude: number;
  order: number;
}

interface MapProps {
  places: Place[];
}

const Map: React.FC<MapProps> = ({ places }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = places.length > 0
    ? { lat: places[0].latitude, lng: places[0].longitude }
    : { lat: 0, lng: 0 };



  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      >
        {places.map((place, index) => (
          <Marker
            key={index}
            position={{ lat: place.latitude, lng: place.longitude }}
            label={`${index + 1}`}
            title={`${place.name} - Day ${new Date(place.date).getDate()}`}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;