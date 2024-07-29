import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMe, getOtherUserProfile, getUserTrips, updateUserProfile, changePassword, sendVerificationEmail } from '../services/api';
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

const Profile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { user: currentUser, logout } = useContext(AuthContext)!;
    const navigate = useNavigate();
  
    const [user, setUser] = useState<any>(null);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
    const isOwnProfile = !userId || userId === currentUser._id;
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          let userData;
          if (isOwnProfile) {
            userData = await getMe();
          } else {
            userData = await getOtherUserProfile(userId!);
          }
          setUser(userData.data);
  
          const tripsData = await getUserTrips(userId || currentUser._id);
          setTrips(tripsData.data);
        } catch (error) {
          console.error('Error fetching data:', error);
          navigate('/');
        }
      };
  
      fetchData();
    }, [userId, currentUser, isOwnProfile, navigate]);
  
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setProfilePicture(e.target.files[0]);
      }
    };
  
    const handleUpdateProfile = async () => {
      if (!isOwnProfile || !profilePicture) return;
      try {
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);
        await updateUserProfile(formData);
        // Refresh user data
        const userData = await getMe();
        setUser(userData.data);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    };
  
    const handleChangePassword = async () => {
      if (!isOwnProfile) return;
      try {
        await changePassword({ currentPassword, newPassword });
        setCurrentPassword('');
        setNewPassword('');
        alert('Password changed successfully');
      } catch (error) {
        console.error('Error changing password:', error);
      }
    };
  
    const handleThemeChange = (newTheme: string) => {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.body.className = newTheme;
    };
  
    const handleVerifyEmail = async () => {
      if (!isOwnProfile) return;
      try {
        await sendVerificationEmail();
        alert('Verification email sent. Please check your inbox.');
      } catch (error) {
        console.error('Error sending verification email:', error);
      }
    };
  
    if (!user) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h1>{isOwnProfile ? 'My Profile' : `${user.username}'s Profile`}</h1>
        <img
          src={user.profilePicture || '/default-profile.png'}
          alt={user.username}
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
        
        {isOwnProfile && (
          <>
            <input type="file" onChange={handleProfilePictureChange} />
            <button onClick={handleUpdateProfile}>Update Profile Picture</button>
  
            <h2>Change Password</h2>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Change Password</button>
  
            <h2>Theme</h2>
            <p>Current: {theme}</p>
            <button onClick={() => handleThemeChange('light')}>Light</button>
            <button onClick={() => handleThemeChange('dark')}>Dark</button>
  
            {!user.isVerified && (
              <button onClick={handleVerifyEmail}>Verify Email</button>
            )}
  
            <button onClick={logout}>Logout</button>
          </>
        )}
  
        <h2>Trips</h2>
        <TripList trips={trips} />
        <ul>
          {trips.map((trip) => (
            <li key={trip._id}>
              <span>{trip.title}</span>
              <p>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Profile;