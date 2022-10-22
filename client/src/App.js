import styled from "styled-components/macro";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import { accessToken, logout } from "./spotify";
import { GlobalStyle } from "./styles";
import {
  Login,
  Profile,
  TopArtists,
  Artists,
  TopTracks,
  Playlists,
  Playlist,
  TrackInfo,
  Recommendation,
  Album,
  BasedOnHistory,
} from "./pages";

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;
// Scroll to top of page when changing routes
// https://reactrouter.com/web/guides/scroll-restoration/scroll-to-top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [token, setToken] = useState(null);
  const [getMessage, setGetMessage] = useState({});

  useEffect(() => {
    setToken(accessToken);
  }, []);
  return (
    <div className="App">
      <GlobalStyle />
      {!token ? (
        <Login />
      ) : (
        <>
          <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>

          <Router>
            <ScrollToTop />

            <Switch>
              <Route path="/top-artists/:id" component={Artists}>
                <Artists />
              </Route>
              <Route path="/top-artists" component={TopArtists}>
                <TopArtists />
              </Route>

              <Route path="/top-tracks/:id" component={TrackInfo}>
                <TrackInfo />
              </Route>
              <Route path="/top-tracks" component={TopTracks}>
                <TopTracks />
              </Route>

              <Route path="/playlists/:id" component={Playlist}>
                <Playlist />
              </Route>
              <Route path="/playlists" component={Playlists}>
                <Playlists />
              </Route>
              <Route path="/recommendation" component={Recommendation}>
                <Recommendation />
              </Route>
              <Route path="/album/:id" component={Album}>
                <Album />
              </Route>
              <Route path="/">
                <Profile />
              </Route>
            </Switch>
          </Router>
        </>
      )}
    </div>
  );
}

export default App;
