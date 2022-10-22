import { SingleCard, convertMS, formatDuration } from "../utils";
import { StyledTrackList } from "../styles";
import { useEffect, useState } from "react";

import { useParams, Link, Route } from "react-router-dom";
import { getArtistID, getArtistsTopTracks, getArtistsAlbums } from "../spotify";
const ArtistTopTrack = () => {
  const { id } = useParams();

  const [basicInfo, setBasicInfo] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [albums, setAlbums] = useState(null);

  const ualbums = new Set();

  const newAlbums =
    albums &&
    albums.items.map((album) => {
      if (ualbums.has(album.name)) return null;
      else {
        ualbums.add(album.name);
        return album;
      }
    });

  useEffect(() => {
    getArtistID(id).then((res) => setBasicInfo(res.data));
    getArtistsTopTracks(id).then((res) => setTopTracks(res.data.tracks));
    getArtistsAlbums(id).then((res) => setAlbums(res.data));

    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div>
      {topTracks ? (
        <StyledTrackList>
          {topTracks.map((track, i) => (
            <li className="track__item" key={i}>
              <div className="track__item__num">{i + 1}</div>
              <Link to={`/top-tracks/${track.id}`}>
                <div className="track__item__title-group">
                  {track.album.images.length && track.album.images[1] && (
                    <div className="track__item__img">
                      <img src={track.album.images[1].url} alt={track.name} />
                    </div>
                  )}{" "}
                  <div className="track__item__name-artist">
                    <div className="track__item__name overflow-ellipsis">
                      {track.name}
                    </div>
                    <div className="track__item__artist overflow-ellipsis">
                      {track.artists.map((artist, i) => (
                        <span key={i}>
                          {artist.name}
                          {i !== track.artists.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="track__item__album overflow-ellipsis">
                {track.album.name}
              </div>
              <div className="track__item__duration">
                {formatDuration(track.duration_ms)}
              </div>
            </li>
          ))}
        </StyledTrackList>
      ) : (
        <p className="empty-notice">No song available</p>
      )}
    </div>
  );
};
export default ArtistTopTrack;
