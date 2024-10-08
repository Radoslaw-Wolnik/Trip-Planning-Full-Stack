import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip, deleteTrip, getUserTrips, joinTrip } from '../services/api';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import CreateTripForm from '../components/CreateTripForm';
import TripList from '../components/TripList';
import { useAuth } from '../hooks/useAuth';
import { Trip, TripData } from '../types';


const TripListPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const navigate = useNavigate();
  const { isModalOpen, openModal, closeModal, modalContent } = useModal();
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    // This case should theoretically never happen if the loading state is handled correctly,
    // but it's good to have as a fallback
    navigate('/login');
    return null;
  }

  const fetchTrips = async () => {
    try {
      //const response = await getTrips();
      const response = await getUserTrips(user._id)
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateNewTrip = () => {
    openModal(
      <CreateTripForm
        onSubmit={confirmCreateTrip}
        onCancel={closeModal}
      />
    );
  };

  const confirmCreateTrip = async (newTrip: TripData) => {
    try {
      const response = await createTrip(newTrip);
      await fetchTrips();
      closeModal();
      navigate(`/trip/${response.data._id}`);
    } catch (error) {
      console.error('Error creating new trip:', error);
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    openModal(
      <div>
        <h2>Are you sure you want to delete this trip?</h2>
        <button onClick={() => confirmDeleteTrip(tripId)}>Yes, delete</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    );
  };

  const confirmDeleteTrip = async (tripId: string) => {
    try {
      await deleteTrip(tripId);
      await fetchTrips();
      closeModal();
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const handleJoinTrip = async (invitationCode: string) => {
    try {
      await joinTrip(invitationCode);
      // Refresh trips after joining
      fetchTrips();
    } catch (error) {
      console.error('Error joining trip:', error);
      alert('Failed to join trip. Please check the invitation code.');
    }
  };

  return (
    <div>
      <h1>My Trips</h1>
      <TripList userId={user._id} trips={trips} onDeleteTrip={handleDeleteTrip} />

      <button onClick={handleCreateNewTrip}>Create New Trip</button>
      <Modal isModalOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
      <div className="join-trip">
        <input
          type="text"
          placeholder="Enter 6-letter invitation code"
          maxLength={6}
          onChange={(e) => {
            if (e.target.value.length === 6) {
              handleJoinTrip(e.target.value);
            }
          }}
        />
      </div>
    </div>
  );
};

export default TripListPage;