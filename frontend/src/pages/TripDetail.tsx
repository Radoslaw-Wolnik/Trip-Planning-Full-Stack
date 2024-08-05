import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getTripDetails, joinTripEdit, leaveTripEdit, updateTrip, deleteTrip, generateShareLink, inviteTrip } from '../services/api';
import { Place, Trip, updateTripData } from '../types';
import io, { Socket } from 'socket.io-client';
import Map from '../components/Map';
import Modal from '../components/Modal';

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [activeEditors, setActiveEditors] = useState(0);

  // Modify the fetchTripData function
  const fetchTripData = useCallback(async () => {
    if (id) {
      try {
        const response = await getTripDetails(id);
        setTrip(response.data);
        setActiveEditors(response.data.activeEditors || 0);
        setIsRealTimeEnabled(activeEditors >= 2); // it can be taken from response.data.activeEditors
        if (response.data.startDate) {
          setSelectedDate(new Date(response.data.startDate));
        }
      } catch (error) {
        console.error('Error fetching trip details:', error);
      }
    }
  }, [id]);

  // Modify the useEffect for socket connection
  useEffect(() => {
    if (id && !socket) {
      const newSocket = io('http://localhost:5001');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('join-trip', id);
        console.log('Socket connected and joined trip:', id);
      });

      newSocket.on('trip-updated', (updatedTrip: Trip) => {
        console.log('Trip updated from socket:', updatedTrip);
        setTrip(updatedTrip);
        // setActiveEditors(updatedTrip.activeEditors || 0);
      });

      newSocket.on('enable-real-time', (enabled: boolean) => {
        console.log('Real-time enabled:', enabled);
        setIsRealTimeEnabled(enabled);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [id]);

  
  // Modify the handleJoinTripEdit function
  const handleJoinTripEdit = useCallback(async () => {
    if (id && socket) {
      try {
        const response = await joinTripEdit(id);
        setActiveEditors(response.data.activeEditors);
        socket.emit('editor-joined', id);
        console.log('Editor joined:', id);
      } catch (error) {
        console.error('Error joining trip edit:', error);
      }
    }
  }, [id, socket]);

  // Modify the handleLeaveTripEdit function
  const handleLeaveTripEdit = useCallback(async () => {
    if (id && socket) {
      try {
        const response = await leaveTripEdit(id);
        setActiveEditors(response.data.activeEditors);
        socket.emit('editor-left', id);
        socket.disconnect();
        setSocket(null);
        console.log('Editor left:', id);
      } catch (error) {
        console.error('Error leaving trip edit:', error);
      }
    }
  }, [id, socket]);

  useEffect(() => {
    fetchTripData();
  }, []);


  // useEffect for handling component unmount:
  useEffect(() => {
    return () => {
      if (isEditMode) {
        handleLeaveTripEdit();
      }
    };
  }, [isEditMode, handleLeaveTripEdit]);

  
  // Call handleJoinTripEdit when entering edit mode
  const handleEdit = () => {
    setIsEditMode(true);
    handleJoinTripEdit();
  };

  const handleUpdateTrip = async (updatedData: updateTripData) => {
    if (id) {
      try {
        console.log(updatedData);
        const dataToSend = {
          title: updatedData.title,
          description: updatedData.description,
          startDate: updatedData.startDate,
          endDate: updatedData.endDate,
          places: updatedData.places
        };
        console.log(dataToSend);
        const response = await updateTrip(id, dataToSend);
        setTrip(response.data);
        if (isRealTimeEnabled && socket) {
          socket.emit('update-trip', { tripId: id, ...dataToSend });
          console.log('Trip update emitted:', { tripId: id, ...dataToSend });
        }
      } catch (error) {
        console.error('Error updating trip:', error);
      }
    }
  };

  // Call handleLeaveTripEdit when saving changes
  const handleSave = async () => {
    if (trip) {
      await handleUpdateTrip({
        title: trip.title,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        places: trip.places
      });
      setIsEditMode(false);
      handleLeaveTripEdit();
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
      const updatedPlaces = [...trip.places, newPlace];
      handleUpdateTrip({ ...trip, places: updatedPlaces });
    }
  };

  const handleDeletePlace = (index: number) => {
    if (trip) {
      const newPlaces = trip.places.filter((_, i) => i !== index);
      handleUpdateTrip({ ...trip, places: newPlaces });
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

  const handleCreateInviteCode = async () => {
    if (trip) {
      try {
        const response = await inviteTrip(trip._id);
        const InviteCode = response.data.invitationCode;
        setInviteCode(InviteCode);
      } catch (error) {
        console.error('Error generating share link:', error);
      }
    }
  };

  if (!trip) return <div>Loading...</div>;

  

  return (
    <div className="trip-detail">
      <h1>{trip.title}</h1>
      <button onClick={() => setIsMenuHidden(!isMenuHidden)}>
        {isMenuHidden ? 'Show Menu' : 'Hide Menu'}
      </button>
      <button onClick={handleCreateInviteCode}>Invite to edit</button>
      {inviteCode && (
        <div>
          <p>give this code to invite to edit:</p>
          <input type="text" value={inviteCode} readOnly />
        </div>
      )}

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