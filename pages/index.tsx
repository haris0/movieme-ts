/* eslint-disable no-unused-vars */
import { useSwitchTheme } from 'context/ThemeContext';
import type { GetStaticProps, NextPage } from 'next';
import { useState } from 'react';
import { getDiscover } from 'services';
import { IDiscoverResponse, IMovie } from 'types';
import { Button } from 'react-bootstrap';
import styles from '../styles/Home.module.scss';

const Home: NextPage<{
  discoverResponse: IDiscoverResponse,
  discoverError: Boolean,
}> = ({
  discoverResponse,
  discoverError,
}) => {
  const [movies, setMovies] = useState<IMovie[]>(discoverResponse.results);
  const switchTheme = useSwitchTheme();

  return (
    <div className={`py-5 ${styles.container}`}>
      <h1 className="pb-3">Movie</h1>
      <Button
        type="button"
        onClick={() => switchTheme()}
      >
        Change Theme
      </Button>
      {movies && (
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      )}
      {discoverError && (
        <div>Failed to Load Data</div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { discoverResponse, discoverError } = await getDiscover(1);

  return {
    props: {
      discoverResponse,
      discoverError,
    },
  };
};

export default Home;
