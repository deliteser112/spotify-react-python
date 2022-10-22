import { formatDuration } from "../utils";
import { StyledTrackList } from "../styles";
import { Link } from "react-router-dom";

const TrackList = ({ tracks }) => (
  <>
    {tracks && tracks.length ? (
      <StyledTrackList>
        {tracks.map((track, i) => (
          <li className="track__item" key={i}>
            <div className="track__item__num">{i + 1}</div>
            <Link to={`/top-tracks/${track.id}`}>
              <div className="track__item__title-group">
                {track.album.images.length && track.album.images[1] && (
                  <div className="track__item__img">
                    <img src={track.album.images[1].url} alt={track.name} />
                  </div>
                )}
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
      <p className="empty-notice">No tracks available</p>
    )}
  </>
);

export default TrackList;
