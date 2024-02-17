import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import App from "./App";
import Login from "./pages/Login.tsx";

import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);

root.render(
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
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
