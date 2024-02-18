import React from "react";
import { useAuth0, LogoutOptions } from "@auth0/auth0-react";
import { api } from "../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

const LogoutButton: React.FC = () => {
  const user = useQuery(api.users.retrieveUserData);
  const clean = useMutation(api.users.deleteMessageHistory);
  if (user !== false && user !== undefined && user._id) {
    clean({ id: user._id });
  }

  const { logout } = useAuth0();
  const handleLogout = () => {
    logout({ returnTo: window.location.origin } as LogoutOptions);
  };

  return (
    <button className="log-out" onClick={handleLogout}>
      Log out
    </button>
  );
};

export default LogoutButton;
