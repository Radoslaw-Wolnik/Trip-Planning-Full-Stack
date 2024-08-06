import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { verifyEmail } from '../services/api';

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [verificationStatus, setVerificationStatus] = useState<string>('Verifying...');

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token || '');
        setVerificationStatus('Email verified successfully. You can now log in.');
      } catch (error) {
        setVerificationStatus('Invalid or expired verification token. Please try again.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="verify-email">
      <h1>Email Verification</h1>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default VerifyEmail;