import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrips, createTrip, deleteTrip } from '../services/api';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import CreateTripForm from '../components/CreateTripForm';

interface Trip {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  sharedWith: { _id: string; username: string; profilePicture?: string }[];
}

const TripList: React.FC = () => {
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
      <ul>
        {trips.map((trip) => (
          <li key={trip._id}>
            <span onClick={() => navigate(`/trip/${trip._id}`)}>{trip.title}</span>
            <p>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
            <div className="shared-users">
              {trip.sharedWith.map((user) => (
                <img
                  key={user._id}
                  src={user.profilePicture || '/default-profile.png'}
                  alt={user.username}
                  title={user.username}
                  onClick={() => navigate(`/profile/${user._id}`)}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', marginRight: '5px' }}
                />
              ))}
            </div>
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