import { useEffect, useState } from "react";
import {
  getArtistID,
  getArtistsTopTracks,
  getArtistsAlbums,
  getArtistsRelatedArtists,
  isArtistFollowedByUser,
  followArtist,
  unfollowArtist,
} from "../spotify";
import { useParams, Link } from "react-router-dom";
import Album, {
  YouAlsoLiked,
  ArtistTopTrack,
  SectionWrapper,
  Loader,
} from "../component";
import { ArtistAlbum } from "../pages";
import { StyledHeader, StyledFollow, StyledTrackList } from "../styles";

const Artists = () => {
  const { id } = useParams();

  const [basicInfo, setBasicInfo] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [related, setRelated] = useState(null);
  const [followed, setFollowed] = useState(null);
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
    getArtistsRelatedArtists(id).then((res) => setRelated(res.data.artists));
    window.scrollTo(0, 0);
    isArtistFollowedByUser(id).then((res) => setFollowed(res.data[0]));
  }, [id]);

  const follow = () => {
    setFollowed(!followed);
    followArtist(id).then((res) => console.log("followed!"));
  };

  const unfollow = () => {
    setFollowed(!followed);
    unfollowArtist(id).then((res) => console.log("UNfollowed!"));
  };
  return (
    <>
      {basicInfo && (
        <>
          <StyledHeader type="user">
            <div className="header__inner">
              {basicInfo.images.length && basicInfo.images[0].url && (
                <img
                  className="header__img"
                  src={basicInfo.images[0].url}
                  alt="Avatar"
                />
              )}
              <div>
                <div className="header__overline">Artist</div>
                <h1 className="header__name">{basicInfo.name}</h1>
                <p className="header__meta">
                  {basicInfo.followers.total.toLocaleString() ? (
                    <span>
                      {basicInfo.followers.total.toLocaleString()}{" "}
                      {`Follower${
                        basicInfo.followers.total.toLocaleString() !== 1
                          ? "s"
                          : ""
                      }`}
                    </span>
                  ) : null}
                  <span>
                    {basicInfo.popularity}{" "}
                    {`Popularity${basicInfo.popularity !== 1 ? "" : ""}`}
                  </span>{" "}
                </p>
                <br />
                {followed === undefined ? null : (
                  <>
                    {followed ? (
                      <StyledFollow theme="unfollow" onClick={unfollow}>
                        Unfollow
                      </StyledFollow>
                    ) : (
                      <StyledFollow theme="follow" onClick={follow}>
                        Follow
                      </StyledFollow>
                    )}
                  </>
                )}
              </div>
            </div>
          </StyledHeader>

          <main>
            {topTracks && albums && newAlbums && related ? (
              <>
                <SectionWrapper title="Artist info" breadcrumb={true}>
                  <h2 className="text-2xl heading mb-1">
                    Top Tracks of {basicInfo.name}{" "}
                  </h2>
                  <ArtistTopTrack />
                  <br />
                  <br />

                  <h2 className="text-2xl heading mb-1">Latest Albums</h2>
                  <ArtistAlbum />
                  <br />
                  <br />

                  <h2 className="text-2xl heading mb-1">You will also like</h2>
                  <YouAlsoLiked />
                </SectionWrapper>
              </>
            ) : (
              <Loader />
            )}
          </main>
        </>
      )}
    </>
  );
};
export default Artists;
