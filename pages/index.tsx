/* eslint-disable no-unused-vars */
import type { GetStaticProps, NextPage } from 'next';
import { useState } from 'react';
import { getDiscover, getTrending } from 'services';
import {
  IMovieListRes, IMovie, ITvListRes, ITv,
} from 'types';
import { Container } from 'react-bootstrap';
import { useTheme } from 'context/ThemeContext';
import CardMovie from 'components/card/CardMovie';
import styles from '../styles/Home.module.scss';

const Home: NextPage<{
  discoverResponse: IMovieListRes,
  discoverError: Boolean,
  trendingMovieResponse: IMovieListRes,
  trendingMovieError: Boolean,
  trendingTvResponse: ITvListRes,
  trendingTvError: Boolean,
}> = ({
  discoverResponse,
  discoverError,
  trendingMovieResponse,
  trendingMovieError,
  trendingTvResponse,
  trendingTvError,
}) => {
  const theme = useTheme();
  const [discover, setDiscover] = useState<IMovie[]>(discoverResponse.results);
  const [trendingMovie, setTrendingMovie] = useState<IMovie[]>(trendingMovieResponse.results);
  const [trendingTv, setTrendingTv] = useState<ITv[]>(trendingTvResponse.results);

  return (
    <Container className="container-custome">
      <h3>Movie Discover</h3>
      {discover && (
        <div className={styles.scroll_container}>
          {discover.map((movie) => (
            <div className={styles.skin_option} key={movie.id}>
              <CardMovie movie={movie} theme={theme} />
            </div>
          ))}
        </div>
      )}
      {discoverError && (
        <div>Failed to Load Data</div>
      )}
      <br />
      <h3>Movie Trending</h3>
      {trendingMovie && (
        <div className={styles.scroll_container}>
          {trendingMovie.map((movie) => (
            <div className={styles.skin_option} key={movie.id}>
              <CardMovie movie={movie} theme={theme} />
            </div>
          ))}
        </div>
      )}
      {trendingMovieError && (
        <div>Failed to Load Data</div>
      )}
      {/* <h1>Tv Trending</h1>
      {trendingTv && (
        <ul>
          {trendingTv.map((tv) => (
            <li key={tv.id}>{tv.name}</li>
          ))}
        </ul>
      )}
      {trendingTvError && (
        <div>Failed to Load Data</div>
      )} */}
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [discover, trendingMovie, trendingTv] = await Promise.all([
    getDiscover(1),
    getTrending('movie', 'day'),
    getTrending('tv', 'day'),
  ]);

  const {
    discoverResponse,
    discoverError,
  } = discover;
  const {
    trendingResponse: trendingMovieResponse,
    trendingError: trendingMovieError,
  } = trendingMovie;
  const {
    trendingResponse: trendingTvResponse,
    trendingError: trendingTvError,
  } = trendingTv;

  return {
    props: {
      discoverResponse,
      discoverError,
      trendingMovieResponse,
      trendingMovieError,
      trendingTvResponse,
      trendingTvError,
    },
  };
};

export default Home;
