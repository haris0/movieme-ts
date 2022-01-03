/* eslint-disable no-unused-vars */
import type { GetStaticProps, NextPage } from 'next';
import { useState, useEffect, ChangeEvent } from 'react';
import { getNowPlaying, getPopulerPeople, getTrending } from 'services';
import {
  IMovieListRes,
  IMovie,
  ITvListRes,
  ITv,
  IPeopleListRes,
} from 'types';
import { Container } from 'react-bootstrap';
import { useTheme } from 'context/ThemeContext';
import CardMovie from 'components/card/CardMovie';
import CardPeople from 'components/card/CardPeople';
import Banner from 'components/benner/Banner';
import SearchBar from 'components/search/Search';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  popularPeopleRes: IPeopleListRes,
  popularPeopleErr: Boolean,
}> = ({
  inTheatresRes,
  inTheatresErr,
  onTheAirRes,
  onTheAirErr,
  trendingMovieRes,
  trendingMovieErr,
  trendingTvRes,
  trendingTvErr,
  popularPeopleRes,
  popularPeopleErr,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const trendingMovie = trendingMovieRes.results;
  const trendingTv = trendingTvRes.results;
  const inTheatres = inTheatresRes.results;
  const onTheAir = onTheAirRes.results;
  const popularPeople = popularPeopleRes.results;

  const [keyword, setKeyword] = useState('');
  const handleKeyWord = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };
  const handleSearch = (searchKey: string) => {
    router.push({
      pathname: '/search',
      query: searchKey ? { keyword: searchKey } : {},
    });
  };

  const useBannerChange = (movieList: IMovie[] | ITv[]) => {
    const [movieIdx, setMovieIdx] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setMovieIdx((prev) => (
          prev === movieList.length ? 0 : prev + 1
        ));
      }, 10000);

      return () => {
        clearInterval(timer);
      };
    }, [movieIdx, movieList.length]);

    return movieList[movieIdx]?.backdrop_path;
  };

  return (
    <>
      <div>
        <Banner backdropPath={useBannerChange(inTheatres)}>
          <SearchBar
            theme={theme}
            keyword={keyword}
            onSearch={() => handleSearch(keyword)}
            onKeyWordChange={handleKeyWord}
          />
        </Banner>
      </div>
      <Container className={styles.container_home}>
        <h3 className={styles.first_title}>Trending Movie</h3>
        {trendingMovie && (
          <div className={styles.scroll_container}>
            {trendingMovie.map((movie) => (
              <Link href={`/movie/${movie.id}`} passHref key={movie.id}>
                <div className={styles.skin_option}>
                  <CardMovie
                    href={`/movie/${movie.id}`}
                    posterPath={movie.poster_path}
                    voteAverage={movie.vote_average}
                    title={movie.title}
                    releaseDate={movie.release_date}
                    theme={theme}
                    favorited
                  />
                </div>
              </Link>
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
              <Link href={`/tv/${tv.id}`} passHref key={tv.id}>
                <div className={styles.skin_option}>
                  <CardMovie
                    href={`/tv/${tv.id}`}
                    posterPath={tv.poster_path}
                    voteAverage={tv.vote_average}
                    title={tv.name}
                    releaseDate={tv.first_air_date}
                    theme={theme}
                  />
                </div>
              </Link>
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
              <Link href={`/movie/${movie.id}`} passHref key={movie.id}>
                <div className={styles.skin_option}>
                  <CardMovie
                    href={`/movie/${movie.id}`}
                    posterPath={movie.poster_path}
                    voteAverage={movie.vote_average}
                    title={movie.title}
                    releaseDate={movie.release_date}
                    theme={theme}
                  />
                </div>
              </Link>
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
              <Link href={`/tv/${tv.id}`} passHref key={tv.id}>
                <div className={styles.skin_option}>
                  <CardMovie
                    href={`/tv/${tv.id}`}
                    posterPath={tv.poster_path}
                    voteAverage={tv.vote_average}
                    title={tv.name}
                    releaseDate={tv.first_air_date}
                    theme={theme}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
        {onTheAirErr && (
          <div>Failed to Load Data</div>
        )}
        <br />
        <h3>Popular People</h3>
        {popularPeople && (
          <div className={styles.scroll_container}>
            {popularPeople.map((people) => (
              <Link href={`/people/${people.id}`} passHref key={people.id}>
                <div className={styles.skin_option}>
                  <CardPeople
                    href={`/people/${people.id}`}
                    name={people.name}
                    profilePath={people.profile_path}
                    peopleKnowFor={people.known_for.map(
                      (movie) => movie.title || movie.name,
                    )}
                    theme={theme}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
        {popularPeopleErr && (
          <div>Failed to Load Data</div>
        )}
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [inTheatres, onTheAir, trendingMovie, trendingTv, popularPeople] = await Promise.all([
    getNowPlaying('movie'),
    getNowPlaying('tv'),
    getTrending('movie', 'day'),
    getTrending('tv', 'day'),
    getPopulerPeople(),
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
  const {
    peopleRes: popularPeopleRes,
    peopleErr: popularPeopleErr,
  } = popularPeople;

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
      popularPeopleRes,
      popularPeopleErr,
    },
    revalidate: 10,
  };
};

export default Home;
