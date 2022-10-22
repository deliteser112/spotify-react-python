import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StyledSearchBar } from "../styles";
import { search } from "../spotify";
import styled from "styled-components/macro";

const StyleText = styled.a`
  color: #a9a9a9;
  font-weight: 700;
  display: block;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: white;
  }
  &:focus {
    text-decoration: none;
  }
`;
const Search = () => {
  const [query, setQuery] = useState("");
  const [artists, setArtists] = useState(null);
  const [tracks, setTracks] = useState(null);

  useEffect(() => {
    if (query !== "") {
      search(query.replace(" ", "+")).then((res) => {
        setTracks(res.data.tracks.items);
        setArtists(res.data.artists.items);
      });
    } else {
      setTracks(null);
      setArtists(null);
    }
  }, [query]);

  return (
    <div className="pt-24 pb-12">
      <div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl heading mr-4">Search</h2>
          <br />
          <StyledSearchBar
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {tracks && artists ? (
          <div className=" ">
            <br />
            <h3>Artists</h3>
            {artists.map((result) => (
              <Link to={`/top-artists/${result.id}`}>
                <StyleText>{result.name}</StyleText>
              </Link>
            ))}
            <br />
            <h3>Tracks</h3>
            {tracks.map((result) => (
              <Link to={`/top-tracks/${result.id}`}>
                <StyleText>{result.name}</StyleText>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
