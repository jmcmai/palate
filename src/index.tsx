import React from 'react';
import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from 'convex/react';
import { ConvexProviderWithAuth0 } from 'convex/react-auth0';
import App from './App';
import Login from './pages/Login';
import reportWebVitals from './reportWebVitals';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL!);

ReactDOM.render(
  <StrictMode>
    <Auth0Provider
      domain="dev-6huwnppz7pgz5wml.us.auth0.com"
      clientId="6RMCNgM9Qe303ZOMufvYDQA2kxxVUKke"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        <Authenticated>
          <App />
        </Authenticated>
        <Unauthenticated>
          <Login />
        </Unauthenticated>
        <AuthLoading>
          <main>Loading...</main>
        </AuthLoading>
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  </StrictMode>,
  root // Changed this line
);

reportWebVitals();
