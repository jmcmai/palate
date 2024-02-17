import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Badge: React.FC = () => {
  const { user } = useAuth0();

  if (!user) {
    return <span>Not logged in</span>;
  }

  return <span>Logged in as {user.name}</span>;
};

export default Badge;
