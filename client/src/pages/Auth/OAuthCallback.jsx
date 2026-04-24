import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      // AuthContext will automatically pick these up on redirect
      navigate('/');
      // force reload to let AuthContext parse the new tokens
      window.location.reload();
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="login-container">
      <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Authenticating...</h2>
        <p>Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
