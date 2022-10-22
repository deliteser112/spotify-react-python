import { useState } from "react";
import { getRex } from "../spotify";
import styled from "styled-components/macro";
import { StyledSearch, StyledTrackList } from "../styles";
const Texttitle = styled.p`
  color: #cfcfcf;
  font-size: 23px;
`;
const MoodBlock = styled.a`
  text-align: center;
  background-color: transparent;
  display: inline-block;
  height: 20%;
  width: 20%;
  margin-right: 8px;
  color: var(--white);
  border-radius: 10px;
  font-weight: 700;
  padding: 10px;

  cursor: pointer;
  &:hover {
    text-decoration: none;
    background-color: #c2a8e5;
    transition: 0.6s;
  }
  &:active {
    text-decoration: none;
    background-color: #c2a8e5;
  }
`;
const Genre = styled.a`
  text-align: center;
  background-color: transparent;
  display: display;
  height: 10%;
  width: 10%;
  grid-template-columns: repeat(5);
  margin-right: 5px;
  color: var(--white);
  border-radius: 10px;
  font-weight: 700;
  padding: 10px;
  margin-bottom: 7px;
  font-size: larger;
  cursor: pointer;
  &:hover {
    text-decoration: none;
    background-color: #c2a8e5;
    transition: 0.6s;
  }
  &:active {
    text-decoration: none;
    background-color: #c2a8e5;
  }
  &:disabled {
    background-color: transparent;
  }
`;
const SelectMood = styled(MoodBlock)`
  background-color: transparent;
  ${({ mood }) =>
    mood &&
    `
    background-color: #c2a8e5;
  `}
`;
const SelectGenre = styled(Genre)`
  background-color: transparent;
  ${({ genre }) =>
    genre &&
    `
    background-color: #c2a8e5;
  `}
`;
const Mood = () => {
  const moods = [
    { title: "Happy", emoji: "😄" },
    { title: "Sad", emoji: "😢" },
    { title: "Energetic", emoji: "💪🏻" },
    { title: "Calm", emoji: "😇" },
  ];
  const allGenres = [
    "Pop",
    "Rock",
    "Hip-Hop",
    "Electronic",
    "Metal",
    "Punk",
    "Classical",
    "Chill",
    "Country",
    "Techno",
  ];

  const [genre, setGenre] = useState(null);
  const [mood, setMood] = useState(null);
  const [rex, setRex] = useState(null);

  const setParams = (m) => {
    let q;
    switch (m) {
      case "Happy": {
        q = "minValence=0.65&minEnergy=0.75";
        break;
      }
      case "Sad": {
        q = "maxValence=0.3&maxEnergy=0.5";
        break;
      }
      case "Energetic": {
        q = "minEnergy=0.75&minValence=0.3&maxValence=0.65";
        break;
      }
      case "Calm": {
        q = "minEnergy=0.43&maxEnergy=0.65&minValence=0.3&maxValence=0.65";
        break;
      }
      default: {
        console.log("Impossible 😠");
      }
    }
    setMood({ mood: m, features: q });
  };

  const go = () => {
    getRex(genre.toLowerCase(), mood.features).then((res) => {
      setRex(res.data);
      setTimeout(() => {
        window.scrollBy({ top: 300, behavior: "smooth" });
      }, 300);
    });
  };

  return (
    <div>
      <h1 className="">Based on Mood</h1>
      <br />
      <Texttitle>Select Mood</Texttitle>
      {moods.map((m) => (
        <SelectMood
          mood={mood?.mood === m.title}
          key={m.title}
          onClick={() => setParams(m.title)}
        >
          <h2>{m.title}</h2>
          <h3>{m.emoji}</h3>
        </SelectMood>
      ))}
      <br />
      <br />
      <Texttitle>Select Genre</Texttitle>
      <div className="">
        <br />

        {allGenres.map((g) => (
          <SelectGenre genre={genre === g} key={g} onClick={() => setGenre(g)}>
            {g}
          </SelectGenre>
        ))}
      </div>
      <br />
      <br />
      <StyledSearch onClick={go}>Search</StyledSearch>
      {rex ? (
        <div>
          <br />
          <br />

          <h2 id="rex">Here are some tracks you may like</h2>
          <StyledTrackList>
            {rex.tracks.map((song, i) => (
              <li className="track__item" key={i}>
                <div className="track__item__num">{i + 1}</div>
                <div className="track__item__title-group">
                  {song.album.images.length && song.album.images[1] && (
                    <div className="track__item__img">
                      <img src={song.album.images[1].url} alt={song.name} />
                    </div>
                  )}
                  <div className="track__item__name-artist">
                    <div className="track__item__name overflow-ellipsis">
                      {song.name}
                    </div>
                    <div className="track__item__artist overflow-ellipsis">
                      {song.artists.map((artist, i) => (
                        <span key={i}>
                          {artist.name}
                          {i !== song.artists.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <a
                  className="track__item__duration"
                  href={song.external_urls.spotify}
                  target="blank"
                >
                  <svg
                    className=""
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 60 60"
                    width="40px"
                    height="40px"
                    href={song.external_urls.spotify}
                    target="blank"
                  >
                    <path
                      className="cls-1"
                      d="M100,930a30,30,0,1,1-30,30A30,30,0,0,1,100,930Zm-5.985,38.742a1.207,1.207,0,0,0,.763,1.1,1.465,1.465,0,0,0,1.473-.082l13.14-8.683a1.371,1.371,0,0,0-.009-2.311l-13.176-8.55a1.455,1.455,0,0,0-1.471-.068,1.289,1.289,0,0,0-.755,1.165Z"
                      id="play"
                      transform="translate(-70 -930)"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </StyledTrackList>
        </div>
      ) : (
        <div className="loading" />
      )}
      <br />
      <br />
    </div>
  );
};

export default Mood;
