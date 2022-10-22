import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getSong, getSongFeatures } from "../spotify";
import { cleaner } from "../utils";
import { StyledHeader, StyledPlayed } from "../styles";
import { Loader, SectionWrapper } from "../component";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const TrackInfo = () => {
  const { id } = useParams();
  const [features, setFeatures] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [song, setSong] = useState(null);

  const feats = {
    labels: [
      "Danceability",
      "Acousticness",
      "Energy",
      "Instrumentalness",
      "Liveness",
      "Valence",
      "Speechiness",
    ],
    datasets: [
      {
        label: "Track Properties",
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "#12984370",
        ],

        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "#129843",
        ],
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        barThickness: 40,
        data: [
          features.danceability * 100,
          features.acousticness * 100,
          features.energy * 100,
          features.instrumentalness * 100,
          features.liveness * 100,
          features.valence * 100,
          features.speechiness * 100,
        ],
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          gridLines: {
            color: "black",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            color: "black",
          },
          ticks: { min: 0, max: 100 },
        },
      ],
    },
  };

  useEffect(() => {
    getSong(id).then((res) => setSong(res.data));
    getSongFeatures(id).then((res) => setFeatures(res.data));
  }, [id]);

  return (
    <>
      {song && features ? (
        <>
          <StyledHeader>
            <div className="header__inner">
              {song.album.images.length && song.album.images[0] && (
                <img className="header__img" src={song.album.images[0].url} />
              )}

              <div>
                <div className="header__overline">Track</div>
                <h1 className="header__name">{song.name}</h1>
                <p className="header__meta">
                  {cleaner(song.artists)} ⋄ {song.album.name}
                </p>
                <br />

                <p className="header__meta">
                  <StyledPlayed
                    href={song.external_urls.spotify}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Play on Spotify
                  </StyledPlayed>
                </p>
              </div>
            </div>
          </StyledHeader>

          <main>
            <SectionWrapper title="Track info" breadcrumb={true}>
              <h2 className="">Track features</h2>
              <div class="chart-container">
                <Bar width={700} height={400} data={feats} options={options} />
              </div>
            </SectionWrapper>
          </main>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default TrackInfo;
