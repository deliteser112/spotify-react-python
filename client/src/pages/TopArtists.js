import { useState, useEffect } from "react";
import { getTopArtists } from "../spotify";
import { catchErrors } from "../utils";
import {
  ArtistsGrid,
  SectionWrapper,
  TimeRangeButtons,
  Loader,
} from "../component";

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState("short");

  useEffect(() => {
    const fetchData = async () => {
      const userTopArtist = await getTopArtists(`${activeRange}_term`);
      setTopArtists(userTopArtist.data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <main>
      {topArtists ? (
        <SectionWrapper title="Top artists" breadcrumb="true">
          <TimeRangeButtons
            activeRange={activeRange}
            setActiveRange={setActiveRange}
          />
          <ArtistsGrid artists={topArtists.items} />
        </SectionWrapper>
      ) : (
        <Loader />
      )}
    </main>
  );
};

export default TopArtists;
