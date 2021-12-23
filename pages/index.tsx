/* eslint-disable no-unused-vars */
import type { GetStaticProps, NextPage } from 'next';
import { useState, useEffect } from 'react';
import { getNowPlaying, getTrending } from 'services';
import {
  IMovieListRes, IMovie, ITvListRes, ITv,
} from 'types';
import { Container } from 'react-bootstrap';
import { useTheme } from 'context/ThemeContext';
import CardMovie from 'components/card/CardMovie';
import Banner from 'components/benner/Banner';
import styles from '../styles/Home.module.scss';

const Home: NextPage<{
  inTheatresRes: IMovieListRes,
  inTheatresErr: Boolean,
  onTheAirRes: ITvListRes,
  onTheAirErr: Boolean,
  trendingMovieRes: IMovieListRes,
  trendingMovieErr: Boolean,
  trendingTvRes: ITvListRes,
  trendingTvErr: Boolean,
}> = ({
  inTheatresRes,
  inTheatresErr,
  onTheAirRes,
  onTheAirErr,
  trendingMovieRes,
  trendingMovieErr,
  trendingTvRes,
  trendingTvErr,
}) => {
  const theme = useTheme();
  const [trendingMovie, setTrendingMovie] = useState<IMovie[]>(trendingMovieRes.results);
  const [trendingTv, setTrendingTv] = useState<ITv[]>(trendingTvRes.results);
  const [inTheatres, setInTheatres] = useState<IMovie[]>(inTheatresRes.results);
  const [onTheAir, setOnTheAir] = useState<ITv[]>(onTheAirRes.results);
  const [backdropIdx, setBackdropIdx] = useState(1);

  const changeBackdropIdx = (index: number) => (index === 20 ? 1 : index + 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBackdropIdx((prev) => changeBackdropIdx(prev));
      console.log(backdropIdx);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [backdropIdx]);

  return (
    <>
      <div>
        <Banner backdropPath={inTheatres[backdropIdx]?.backdrop_path} />
      </div>
      <Container className={styles.container_home}>
        <h3 className={styles.first_title}>Trending Movie</h3>
        {trendingMovie && (
          <div className={styles.scroll_container}>
            {trendingMovie.map((movie) => (
              <div className={styles.skin_option} key={movie.id}>
                <CardMovie
                  posterPath={movie.poster_path}
                  voteAverage={movie.vote_average}
                  title={movie.title}
                  releaseDate={movie.release_date}
                  theme={theme}
                />
              </div>
            ))}
          </div>
        )}
        {trendingMovieErr && (
          <div>Failed to Load Data</div>
        )}
        <br />
        <h3>Trending Tv Show</h3>
        {trendingTv && (
          <div className={styles.scroll_container}>
            {trendingTv.map((tv) => (
              <div className={styles.skin_option} key={tv.id}>
                <CardMovie
                  posterPath={tv.poster_path}
                  voteAverage={tv.vote_average}
                  title={tv.name}
                  releaseDate={tv.first_air_date}
                  theme={theme}
                />
              </div>
            ))}
          </div>
        )}
        {trendingTvErr && (
          <div>Failed to Load Data</div>
        )}
        <br />
        <h3>Movie In Theatres</h3>
        {inTheatres && (
          <div className={styles.scroll_container}>
            {inTheatres.map((movie) => (
              <div className={styles.skin_option} key={movie.id}>
                <CardMovie
                  posterPath={movie.poster_path}
                  voteAverage={movie.vote_average}
                  title={movie.title}
                  releaseDate={movie.release_date}
                  theme={theme}
                />
              </div>
            ))}
          </div>
        )}
        {inTheatresErr && (
          <div>Failed to Load Data</div>
        )}
        <br />
        <h3>Tv Show On The Air</h3>
        {onTheAir && (
          <div className={styles.scroll_container}>
            {onTheAir.map((tv) => (
              <div className={styles.skin_option} key={tv.id}>
                <CardMovie
                  posterPath={tv.poster_path}
                  voteAverage={tv.vote_average}
                  title={tv.name}
                  releaseDate={tv.first_air_date}
                  theme={theme}
                />
              </div>
            ))}
          </div>
        )}
        {onTheAirErr && (
          <div>Failed to Load Data</div>
        )}
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [inTheatres, onTheAir, trendingMovie, trendingTv] = await Promise.all([
    getNowPlaying('movie'),
    getNowPlaying('tv'),
    getTrending('movie', 'day'),
    getTrending('tv', 'day'),
  ]);

  const {
    nowPlayingRes: inTheatresRes,
    nowPlayingErr: inTheatresErr,
  } = inTheatres;
  const {
    nowPlayingRes: onTheAirRes,
    nowPlayingErr: onTheAirErr,
  } = onTheAir;
  const {
    trendingRes: trendingMovieRes,
    trendingErr: trendingMovieErr,
  } = trendingMovie;
  const {
    trendingRes: trendingTvRes,
    trendingErr: trendingTvErr,
  } = trendingTv;

  return {
    props: {
      inTheatresRes,
      inTheatresErr,
      onTheAirRes,
      onTheAirErr,
      trendingMovieRes,
      trendingMovieErr,
      trendingTvRes,
      trendingTvErr,
    },
  };
};

export default Home;
