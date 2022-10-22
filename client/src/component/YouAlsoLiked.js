import { useEffect, useState } from "react";
import { getArtistsRelatedArtists, isArtistFollowedByUser } from "../spotify";
import { useParams, Link } from "react-router-dom";
import { StyledRelatedGrid } from "../styles";
import Loader from "./Loader";
import ArtistsGrid from "./ArtistsGrid";
const YouAlsoLiked = () => {
  const { id } = useParams();
  const [basicInfo, setBasicInfo] = useState(null);

  const [albums, setAlbums] = useState(null);
  const [related, setRelated] = useState(null);
  const [followed, setFollowed] = useState(null);

  useEffect(() => {
    getArtistsRelatedArtists(id).then((res) => setRelated(res.data.artists));
    window.scrollTo(0, 0);
    isArtistFollowedByUser(id).then((res) => setFollowed(res.data[0]));
  }, [id]);

  return (
    <div>
      {related && related.length ? (
        <StyledRelatedGrid type="artist">
          {related.slice(0, 5).map((relatedArtist, i) => (
            <li className="grid__item" key={i}>
              <Link
                to={`/top-artists/${relatedArtist.id}`}
                key={relatedArtist.id}
              >
                {relatedArtist.images[0] && (
                  <div className="grid__item__img">
                    <img
                      src={relatedArtist.images[0].url}
                      alt={relatedArtist.name}
                    />
                  </div>
                )}
                <div className="grid__item__inner">
                  <h3 className="grid__item__name overflow-ellipsis">
                    {relatedArtist.name}
                  </h3>
                  <p className="grid__item__label">Artist</p>
                </div>
              </Link>
            </li>
          ))}
        </StyledRelatedGrid>
      ) : (
        <Loader />
      )}
    </div>
  );
};
export default YouAlsoLiked;
