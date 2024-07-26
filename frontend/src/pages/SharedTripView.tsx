// src/pages/SharedTripView.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedTrip } from '../services/api';
import Map from '../components/Map';

interface Place {
  name: string;
  date: Date;
  latitude: number;
  longitude: number;
  order: number;
}

interface Trip {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  places: Place[];
}

const SharedTripView: React.FC = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const fetchSharedTrip = async () => {
      if (shareCode) {
        try {
          const response = await getSharedTrip(shareCode);
          setTrip(response.data);
        } catch (error) {
          console.error('Error fetching shared trip:', error);
        }
      }
    };
    fetchSharedTrip();
  }, [shareCode]);

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="shared-trip-view">
      <h1>{trip.title}</h1>
      <p>{trip.description}</p>
      <p>Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(trip.endDate).toLocaleDateString()}</p>

      <div className="trip-content" style={{ display: 'flex' }}>
        <div className="trip-menu" style={{ width: '300px' }}>
          <h2>Itinerary</h2>
          {Object.entries(trip.places.reduce<Record<string, Place[]>>((acc, place) => {
            const date = new Date(place.date).toDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(place);
            return acc;
          }, {})).map(([date, places]) => (
            <div key={date}>
              <h3>{date}</h3>
              <ul>
                {places.map((place, index) => (
                  <li key={index}>{place.name}</li>
                ))}
              </ul>
            </div>
            ))}
        </div>

        <div className="map-container" style={{ flex: 1 }}>
          <Map places={trip.places} />
        </div>
      </div>
    </div>
  );
};

export default SharedTripView;