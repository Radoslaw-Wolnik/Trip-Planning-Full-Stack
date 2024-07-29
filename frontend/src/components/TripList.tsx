// src/components/TripList.tsx
// used style for avatars !!
import React from 'react';
import { Link } from 'react-router-dom';

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

interface TripListProps {
  userId: string,
  trips: Trip[];
  onDeleteTrip?: (tripId: string) => void;
}

const TripList: React.FC<TripListProps> = ({ userId, trips, onDeleteTrip }) => {
  
  return (
    <div className="trip-list">
      {trips.map((trip) => (
        <div key={trip._id} className="trip-item">
          <Link to={`/trip/${trip._id}`}>
            <h3>{trip.title}</h3>
          </Link>
          <p>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
          <p>{trip.creator._id === userId ? 'You are the owner' : 'You are invited'}</p>
          <div className="trip-users">
            <Link to={`/profile/${trip.creator._id}`}>
              <img 
                src={trip.creator.profilePicture || '/default-profile.png'} 
                alt={trip.creator.username} 
                title={`Creator: ${trip.creator.username}`}
                className="user-avatar"
                style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', marginRight: '5px' }}
              />
            </Link>
            {trip.sharedWith.map((user) => (
              <Link key={user._id} to={`/profile/${user._id}`}>
                <img 
                  src={user.profilePicture || '/default-profile.png'} 
                  alt={user.username} 
                  title={user.username}
                  className="user-avatar"
                  style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', marginRight: '5px' }}
                />
              </Link>
            ))}
          </div>
          {onDeleteTrip && (
            <button onClick={() => onDeleteTrip(trip._id)} className="delete-button">Delete</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TripList;