import React from 'react';
import Template from '../components/Template';
import LogoutButton from "../components/LogoutButton";
import { useAuth0 } from '@auth0/auth0-react';

import './Settings.css'

const Settings: React.FC = () => {
  const { user, isAuthenticated } = useAuth0(); 

  return (
    <Template>
      <div className="content-body">
        <div className="account-info"> 
          <h2 className="center">Account Information</h2>
          <p>
            Name: {isAuthenticated && user && (
              <span className="grey-text">{user.name}</span>
            )}
          </p>
          <p>
            Email: {isAuthenticated && user && (
              <span className="grey-text">{user.email}</span>
            )}
          </p>
          <LogoutButton />
        </div>
      </div>
    </Template>
  );
};

export default Settings;