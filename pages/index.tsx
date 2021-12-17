/* eslint-disable no-unused-vars */
import type { GetStaticProps, NextPage } from 'next';
import { useState } from 'react';
import { getDiscover } from 'services';
import { IDiscoverResponse, IMovie } from 'types';
import styles from '../styles/Home.module.scss';

const Home: NextPage<{
  discoverResponse: IDiscoverResponse,
  discoverError: Boolean,
}> = ({
  discoverResponse,
  discoverError,
}) => {
  const [movies, setMovies] = useState<IMovie[]>(discoverResponse.results);

  return (
    <div className={`py-5 ${styles.container}`}>
      <h1 className="pb-3">Movie</h1>
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
