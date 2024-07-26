import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTrips, createTrip, deleteTrip } from '../services/api';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';

interface Trip {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
}

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const navigate = useNavigate();
  const { isModalOpen, openModal, closeModal, modalContent } = useModal();
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripStartDate, setNewTripStartDate] = useState('');
  const [newTripEndDate, setNewTripEndDate] = useState('');

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
      <div>
        <h2>Create New Trip</h2>
        <input
          type="text"
          placeholder="Trip Title"
          value={newTripTitle}
          onChange={(e) => setNewTripTitle(e.target.value)}
        />
        <input
          type="date"
          value={newTripStartDate}
          onChange={(e) => setNewTripStartDate(e.target.value)}
        />
        <input
          type="date"
          value={newTripEndDate}
          onChange={(e) => setNewTripEndDate(e.target.value)}
        />
        <button onClick={confirmCreateTrip}>Create</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    );
  };

  const confirmCreateTrip = async () => {
    try {
      const newTrip = {
        title: newTripTitle,
        startDate: newTripStartDate,
        endDate: newTripEndDate,
      };
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
      <ul>
        {trips.map((trip) => (
          <li key={trip._id}>
            <Link to={`/trip/${trip._id}`}>{trip.title}</Link>
            <p>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
            <button onClick={() => handleDeleteTrip(trip._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleCreateNewTrip}>Create New Trip</button>
      <Modal isModalOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default TripList;