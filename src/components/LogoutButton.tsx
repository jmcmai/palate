import React from 'react';
import { useAuth0, LogoutOptions } from '@auth0/auth0-react';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin } as LogoutOptions);
  };

  return (
    <button onClick={handleLogout}>
      Log out
    </button>
  );
};

export default LogoutButton;
