import React, { useState } from 'react';
import Modal from './Modal';
import { shareTrip, joinTrip } from '../services/api';

interface ShareTripProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

const ShareTrip: React.FC<ShareTripProps> = ({ isOpen, onClose, tripId }) => {
  const [email, setEmail] = useState('');
  const [invitationCode, setInvitationCode] = useState('');

  const handleShare = async () => {
    try {
      await shareTrip(tripId, { email });
      onClose();
    } catch (error) {
      console.error('Error sharing trip:', error);
    }
  };

  const handleJoin = async () => {
    try {
      await joinTrip(invitationCode);
      onClose();
    } catch (error) {
      console.error('Error joining trip:', error);
    }
  };

  return (
    <Modal isModalOpen={isOpen} onClose={onClose}>
      <h2>Share Trip</h2>
      <input
        type="email"
        placeholder="Enter email to share with"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleShare}>Share</button>

      <h2>Join Trip</h2>
      <input
        type="text"
        placeholder="Enter invitation code"
        value={invitationCode}
        onChange={(e) => setInvitationCode(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>
    </Modal>
  );
};

export default ShareTrip;