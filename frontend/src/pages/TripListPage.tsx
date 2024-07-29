import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrips, createTrip, deleteTrip } from '../services/api';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import CreateTripForm from '../components/CreateTripForm';
import TripList from '../components/TripList';


interface User {
  _id: string;
  username: string;
  profilePicture?: string;
}

interface Trip {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  creator: User;
  sharedWith: User[];
}

const TripListPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const navigate = useNavigate();
  const { isModalOpen, openModal, closeModal, modalContent } = useModal();

  const fetchTrips = async () => {
    try {
      const response = await getTrips();
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

  const confirmCreateTrip = async (newTrip: { title: string; startDate: string; endDate: string }) => {
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

  return (
    <div>
      <h1>My Trips</h1>
      <TripList trips={trips} onDeleteTrip={handleDeleteTrip} />

      <button onClick={handleCreateNewTrip}>Create New Trip</button>
      <Modal isModalOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default TripListPage;