import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTripDetails, updateTrip, deleteTrip, generateShareLink } from '../services/api';
import Map from '../components/Map';
import ShareTrip from '../components/ShareTrip';
import Modal from '../components/Modal';
import { Place, Trip } from '../types';




const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (id) {
        try {
          const response = await getTripDetails(id);
          setTrip(response.data);
          if (response.data.startDate) {
            setSelectedDate(new Date(response.data.startDate));
          }
        } catch (error) {
          console.error('Error fetching trip:', error);
        }
      }
    };
    fetchTrip();
  }, [id]);

  if (!trip) return <div>Loading...</div>;

  const handleEdit = () => setIsEditMode(true);
  const handleSave = async () => {
    if (trip) {
      try {
        const response = await updateTrip(trip._id, {title: trip.title, description: trip.description, startDate: trip.startDate, endDate: trip.endDate, places: trip.places});
        setTrip(response.data);
        setIsEditMode(false);
      } catch (error) {
        console.error('Error updating trip:', error);
      }
    }
  };

  const handleAddPlace = (lat: number, lng: number) => {
    if (trip && selectedDate) {
      const newPlace: Place = {
        name: 'New Place',
        date: selectedDate,
        latitude: lat,
        longitude: lng,
        order: trip.places.length
      };
      setTrip({ ...trip, places: [...trip.places, newPlace] });
    }
  };

  const handleDeletePlace = (index: number) => {
    if (trip) {
      const newPlaces = trip.places.filter((_, i) => i !== index);
      setTrip({ ...trip, places: newPlaces });
    }
  };

  const handleDeleteTrip = async () => {
    if (trip && id) {
      try {
        await deleteTrip(id);
        // Redirect to trip list or homepage after deletion
        // history.push('/trips');
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  const groupPlacesByDate = () => {
    if (!trip) return {};
    return trip.places.reduce((acc, place) => {
      const date = new Date(place.date).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(place);
      return acc;
    }, {} as Record<string, Place[]>);
  };

  const handleGenerateShareLink = async () => {
    if (trip) {
      try {
        const response = await generateShareLink(trip._id);
        const shareCode = response.data.shareCode;
        setShareLink(`${window.location.origin}/shared-trip/${shareCode}`);
      } catch (error) {
        console.error('Error generating share link:', error);
      }
    }
  };

  

  return (
    <div className="trip-detail">
      <h1>{trip.title}</h1>
      <button onClick={() => setIsMenuHidden(!isMenuHidden)}>
        {isMenuHidden ? 'Show Menu' : 'Hide Menu'}
      </button>
      <button onClick={() => setIsShareModalOpen(true)}>Invite to edit</button>

      <button onClick={handleGenerateShareLink}>Generate Share Link (view only)</button>
      {shareLink && (
        <div>
          <p>Share this link with others:</p>
          <input type="text" value={shareLink} readOnly />
        </div>
      )}
      
      <button onClick={() => setIsDeleteModalOpen(true)}>Delete Trip</button>

      <div className="trip-content" style={{ display: 'flex' }}>
        {!isMenuHidden && (
          <div className="trip-menu" style={{ width: '300px' }}>
            <h2>Itinerary</h2>
            {Object.entries(groupPlacesByDate()).map(([date, places]) => (
              <div key={date}>
                <h3>{date}</h3>
                <ul>
                  {places.map((place, index) => (
                    <li key={index}>
                      {place.name}
                      {isEditMode && (
                        <button onClick={() => handleDeletePlace(index)}>Delete</button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="map-container" style={{ flex: 1 }}>
          <input
            type="date"
            value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
          <Map
            places={trip.places}
            onMapClick={isEditMode ? handleAddPlace : undefined}
          />
        </div>
      </div>

      {isEditMode ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}

      <ShareTrip
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tripId={trip._id}
      />

      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h2>Are you sure you want to delete this trip?</h2>
        <button onClick={handleDeleteTrip}>Yes, delete</button>
        <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
      </Modal>
    </div>
  );
};

export default TripDetail;