import { Link } from "react-router-dom";
import { StyledGrid } from "../styles";

const ArtistAlbumGrid = ({ albums }) => {
  return (
    <>
      {albums && albums.length ? (
        <StyledGrid>
          {albums.map((album, i) => (
            <li className="grid__item" key={i}>
              <Link to={`/album/${album.id}`} key={album.id}>
                {album.images.length && album.images[0] && (
                  <div className="grid__item__img">
                    <img src={album.images[0].url} alt={album.name} />
                  </div>
                )}
              </Link>
            </li>
          ))}
        </StyledGrid>
      ) : (
        <p className="empty-notice">No album available</p>
      )}
    </>
  );
};

export default ArtistAlbumGrid;
