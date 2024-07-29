import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMe, getOtherUserProfile, getUserTrips, updateUserProfile, changePassword, sendVerificationEmail } from '../services/api';
import TripList from '../components/TripList';
import { useAuth } from '../hooks/useAuth';



const Profile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { user: currentUser, logout } = useAuth();
    const navigate = useNavigate();
  
    const [user, setUser] = useState<any>(null);
    const [trips, setTrips] = useState<any[]>([]);
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
        <TripList userId={userId || currentUser._id} trips={trips} />
      </div>
    );
  };
  
  export default Profile;