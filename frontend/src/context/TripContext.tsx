// frontend/src/context/TripContext.js
// Not sure about this implementation
/*
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTrips, createTrip, updateTrip, shareTrip } from '../services/api';
import { useAuth } from './AuthContext';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTrips();
    } else {
      setTrips([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await getTrips();
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTrip = async (tripData) => {
    try {
      const response = await createTrip(tripData);
      setTrips([...trips, response.data]);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const editTrip = async (id, tripData) => {
    try {
      const response = await updateTrip(id, tripData);
      setTrips(trips.map(trip => trip._id === id ? response.data : trip));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const shareUserTrip = async (id, userData) => {
    try {
      const response = await shareTrip(id, userData);
      setTrips(trips.map(trip => trip._id === id ? response.data : trip));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <TripContext.Provider value={{ trips, loading, addTrip, editTrip, shareUserTrip, fetchTrips }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
*/