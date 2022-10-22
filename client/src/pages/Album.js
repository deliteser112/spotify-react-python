import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnAlbum, getAnAlbumsTracks } from "../spotify";
import { StyledHeader, StyledTrackList } from "../styles";
import { cleaner } from "../utils";
import { Loader, SectionWrapper } from "../component";
import { formatDuration } from "../utils";

const Album = (props) => {
  const { id } = useParams();

  const [tracks, setTracks] = useState(null);
  const [basics, setBasics] = useState(null);

  useEffect(() => {
    getAnAlbum(id).then((res) => setBasics(res.data));
    getAnAlbumsTracks(id).then((res) => setTracks(res.data));
  }, [id]);

  return (
    <>
      {tracks && basics && (
        <>
          <StyledHeader>
            <div className="header__inner">
              {basics.images.length && basics.images[0].url && (
                <img
                  className="header__img"
                  src={basics.images[0].url}
                  alt="Avatar"
                />
              )}
              <div>
                <div className="header__overline">Album</div>
                <h1 className="header__name">{basics.name}</h1>
                <p className="header__meta">
                  {basics.release_date.split("-")[0]} ⋄
                  <span> {cleaner(basics.artists)}</span>
                </p>
              </div>
            </div>
          </StyledHeader>
          <main>
            <SectionWrapper title="Album tracks" breadcrumb={true}>
              <StyledTrackList>
                {tracks.items.map((track, i) => (
                  <li className="track__item" key={i}>
                    <div className="track__item__num">{i + 1}</div>
                    <Link to={`/top-tracks/${track.id}`} key={track.id}>
                      <div className="track__item__title-group">
                        {basics.images.length && basics.images[1] && (
                          <div className="track__item__img">
                            <img src={basics.images[1].url} alt={track.name} />
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
                    <div className="track__item__duration">
                      {formatDuration(track.duration_ms)}
                    </div>
                  </li>
                ))}
              </StyledTrackList>
            </SectionWrapper>
          </main>
        </>
      )}
    </>
  );
};

export default Album;
