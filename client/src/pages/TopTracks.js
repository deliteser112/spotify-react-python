import { useState, useEffect } from "react";
import { getTopTracks } from "../spotify";
import { catchErrors } from "../utils";
import {
  SectionWrapper,
  TrackList,
  TimeRangeButtons,
  Loader,
} from "../component";

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState(null);
  const [activeRange, setActiveRange] = useState("short");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTopTracks(`${activeRange}_term`);
      setTopTracks(data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <main>
      <SectionWrapper title="Top Tracks" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />
        {topTracks ? <TrackList tracks={topTracks.items} /> : <Loader />}
      </SectionWrapper>
    </main>
  );
};

export default TopTracks;
