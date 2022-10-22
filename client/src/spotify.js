import axios from "axios";

// Map for localStorage keys
const LOCALSTORAGE_KEYS = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  expireTime: "spotify_token_expire_time",
  timestamp: "spotify_token_timestamp",
};
// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};
/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = () => {
  // Clear all localStorage items
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  // Navigate to homepage
  window.location = window.location.origin;
};

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timestamp);
  return millisecondsElapsed / 1000 > Number(expireTime);
};

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
const refreshToken = async () => {
  try {
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (
      !LOCALSTORAGE_VALUES.refreshToken ||
      LOCALSTORAGE_VALUES.refreshToken === "undefined" ||
      Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000 < 1000
    ) {
      console.error("No refresh token available");
      logout();
    }

    // Use `/refresh_token` endpoint from our Node app
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`
    );

    // Update localStorage values
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.accessToken,
      data.access_token
    );
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

    // Reload the page for localStorage updates to be reflected
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};
/**
 * Handles logic for retrieving the Spotify access token from localStorage
 * or URL query params
 * @returns {string} A Spotify access token
 */
const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  };
  const hasError = urlParams.get("error");

  // If there's an error OR the token in localStorage has expired, refresh the token
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.accessToken === "undefined"
  ) {
    refreshToken();
  }

  // If there is a valid access token in localStorage, use that
  if (
    LOCALSTORAGE_VALUES.accessToken &&
    LOCALSTORAGE_VALUES.accessToken !== "undefined"
  ) {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // If there is a token in the URL query params, user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    // Store the query params in localStorage
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
    // Set timestamp
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    // Return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  // We should never get here!
  return false;
};

export const accessToken = getAccessToken();

/**
 * Axios global request headers
 * https://github.com/axios/axios#global-axios-defaults
 */
axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
axios.defaults.headers["Content-Type"] = "application/json";

/**
 * Get Current User's Profile
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-current-users-profile
 * @returns {Promise}
 */
export const getCurrentUserProfile = () => axios.get("/me");
// already set the base URL globally,
// -> URL use for axios request only need to be /me, not https://api.spotify.com/v1/me

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-list-of-current-users-playlists
 * @returns {Promise}
 */
export const getCurrentUserPlaylists = (limit = 20) => {
  return axios.get(`/me/playlists?limit=${limit}`);
};

/**
 * Get a User's Top Artists and Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const getTopArtists = (time_range = "short_term") => {
  return axios.get(`/me/top/artists?time_range=${time_range}`);
};
/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const getTopTracks = (time_range = "short_term") => {
  return axios.get(`/me/top/tracks?time_range=${time_range}`);
};
/**
 * Get a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-playlist
 * @param {string} playlist_id - The Spotify ID for the playlist.
 * @returns {Promise}
 */
export const getPlaylistById = (playlist_id) => {
  return axios.get(`/playlists/${playlist_id}`);
};
/**
 * Get Audio Features for Several Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-several-audio-features
 * @param {string} ids - A comma-separated list of the Spotify IDs for the tracks
 * @returns {Promise}
 */
export const getAudioFeaturesForTracks = (ids) => {
  return axios.get(`/audio-features?ids=${ids}`);
};
/*export const getRex = (
  genreList,
  minEnergy,
  maxEnergy,
  minValence,
  maxValence
) => {
  return axios.get(
    `https://api.spotify.com/v1/recommendations?min_popularity=70&seed_genres=${genreList}&min_energy=${minEnergy}&max_energy=${maxEnergy}&min_valence=${minValence}&max_valence=${maxValence}`,
  );
};*/
export const getRex = (genre, props) => {
  return axios.get(
    `https://api.spotify.com/v1/recommendations?min_popularity=60&market=IN&seed_genres=${genre}&${props}`
  );
};
export const search = (query) => {
  return axios.get(
    `https://api.spotify.com/v1/search/?q=${query}&type=artist,track&limit=3`
  );
};
/*----------  Track API Calls  ----------*/

export const getSong = (id) => {
  return axios.get(`https://api.spotify.com/v1/tracks/${id}`);
};
export const getSongFeatures = (id) => {
  return axios.get(`https://api.spotify.com/v1/audio-features/${id}`);
};
export const getTracksFeatures = (ids) => {
  return axios.get(`https://api.spotify.com/v1/audio-features?ids=${ids}`);
};

/*----------  Artists API Calls  ----------*/

export const getArtistID = (id) => {
  return axios.get(`https://api.spotify.com/v1/artists/${id}`);
};
export const getArtistsTopTracks = (id) => {
  return axios.get(
    `https://api.spotify.com/v1/artists/${id}/top-tracks?market=IN`
  );
};
export const getArtistsAlbums = (id) => {
  return axios.get(
    `https://api.spotify.com/v1/artists/${id}/albums?limit=30&include_groups=album`
  );
};
export const getArtistsRelatedArtists = (id) => {
  return axios.get(
    `https://api.spotify.com/v1/artists/${id}/related-artists?limit=5`
  );
};
export const isArtistFollowedByUser = (id) => {
  return axios.get(
    `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${id}`
  );
};
export const followArtist = (id) => {
  return axios.put(`https://api.spotify.com/v1/me/following?type=artist`, {
    ids: [id],
  });
};
export const unfollowArtist = (id) => {
  return axios.delete(
    `https://api.spotify.com/v1/me/following?type=artist&ids=${id}`
  );
};

/*----------  Library API Calls  ----------*/
export const getLikedSongs = () => {
  return axios.get("https://api.spotify.com/v1/me/tracks?limit=50");
};

export const getUsersPlaylists = () => {
  return axios.get("https://api.spotify.com/v1/me/playlists");
};

export const getAPlaylist = (id) => {
  return axios.get(`https://api.spotify.com/v1/playlists/${id}`);
};
export const getAPlaylistsTracks = (id) => {
  return axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks`);
};
export const getAnAlbum = (id) => {
  return axios.get(`https://api.spotify.com/v1/albums/${id}`);
};
export const getAnAlbumsTracks = (id) => {
  return axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`);
};
