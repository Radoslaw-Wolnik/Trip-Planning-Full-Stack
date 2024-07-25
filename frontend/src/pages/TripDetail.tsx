import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTrip, updateTrip } from '../services/api';
import Map from '../components/Map';
import ShareTripModal from '../components/ShareTrip';

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

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (id) {  // Add this check to resolve typescript error id might be of type: undefined
        try {
          const response = await getTrip(id);
          setTrip(response.data);
        } catch (error) {
          console.error('Error fetching trip:', error);
        }
      }
    };
    fetchTrip();
  }, [id]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    if (trip) {
      try {
        const response = await updateTrip(trip._id, trip);
        setTrip(response.data);
        setIsEditMode(false);
      } catch (error) {
        console.error('Error updating trip:', error);
      }
    }
  };

  const handleAddPlace = () => {
    if (trip) {
      const newPlace: Place = {
        name: '',
        date: new Date(),
        latitude: 0,
        longitude: 0,
        order: trip.places.length + 1
      };
      setTrip({ ...trip, places: [...trip.places, newPlace] });
    }
  };

  if (!trip) return <div>Loading...</div>;

  return (
    <div>
      <h1>{isEditMode ? <input value={trip.title} onChange={(e) => setTrip({ ...trip, title: e.target.value })} /> : trip.title}</h1>
      <p>{isEditMode ? <textarea value={trip.description} onChange={(e) => setTrip({ ...trip, description: e.target.value })} /> : trip.description}</p>
      <p>Start Date: {isEditMode ? <input type="date" value={trip.startDate} onChange={(e) => setTrip({ ...trip, startDate: e.target.value })} /> : new Date(trip.startDate).toLocaleDateString()}</p>
      <p>End Date: {isEditMode ? <input type="date" value={trip.endDate} onChange={(e) => setTrip({ ...trip, endDate: e.target.value })} /> : new Date(trip.endDate).toLocaleDateString()}</p>
      
      <h2>Places</h2>
      <ul>
        {trip.places.map((place, index) => (
          <li key={index}>
            {isEditMode ? (
              <>
                <input value={place.name} onChange={(e) => {
                  const newPlaces = [...trip.places];
                  newPlaces[index].name = e.target.value;
                  setTrip({ ...trip, places: newPlaces });
                }} />
                <input 
                  type="date" 
                  value={new Date(place.date).toISOString().slice(0, 10)} 
                  onChange={(e) => {
                    const newPlaces = [...trip.places];
                    newPlaces[index].date = new Date(e.target.value);
                    setTrip({ ...trip, places: newPlaces });
                  }} 
                />
                <input type="number" value={place.latitude} onChange={(e) => {
                  const newPlaces = [...trip.places];
                  newPlaces[index].latitude = parseFloat(e.target.value);
                  setTrip({ ...trip, places: newPlaces });
                }} />
                <input type="number" value={place.longitude} onChange={(e) => {
                  const newPlaces = [...trip.places];
                  newPlaces[index].longitude = parseFloat(e.target.value);
                  setTrip({ ...trip, places: newPlaces });
                }} />
              </>
            ) : (
              <>
                {place.name} - {new Date(place.date).toLocaleDateString()} ({place.latitude}, {place.longitude})
              </>
            )}
          </li>
        ))}
      </ul>
      {isEditMode && <button onClick={handleAddPlace}>Add Place</button>}

      <Map places={trip.places} />

      {isEditMode ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}

      <button onClick={() => setIsShareModalOpen(true)}>Share Trip</button>
      <ShareTripModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tripId={trip._id}
      />
    </div>
  );
};

export default TripDetail;