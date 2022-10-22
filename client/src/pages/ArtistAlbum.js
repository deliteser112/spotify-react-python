import { useEffect, useState } from "react";
import {
  getArtistID,
  getArtistsTopTracks,
  getArtistsAlbums,
  getArtistsRelatedArtists,
  isArtistFollowedByUser,
} from "../spotify";
import { useParams, Link } from "react-router-dom";
import { TrackItem, SingleCard, convertMS } from "../utils";
import { Loader } from "../component";
import { StyledAlbumGrid } from "../styles";

const ArtistAlbum = () => {
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

  return (
    <div>
      {albums && newAlbums ? (
        <StyledAlbumGrid>
          {newAlbums.slice(0, 5).map((album) => {
            if (album) {
              return (
                <div className="grid__item">
                  <Link
                    className="grid__item__inner"
                    to={`/album/${album.id}`}
                    key={album.id}
                  >
                    {album.images.length && album.images[0] && (
                      <div className="grid__item__img">
                        <img src={album.images[0].url} alt={album.name} />
                      </div>
                    )}

                    <h3 className="grid__item__name overflow-ellipsis">
                      {album.name}
                    </h3>
                    <p className="grid__item__label">Album</p>
                  </Link>
                </div>
              );
            } else return null;
          })}
        </StyledAlbumGrid>
      ) : (
        <Loader />
      )}
    </div>
  );
};
export default ArtistAlbum;
