/* eslint-disable no-unused-vars */
import { useTheme } from 'context/ThemeContext';
import { GetServerSideProps, NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import { getDiscover, getGenreList } from 'services';
import {
  IGenreListRes, IMovie,
} from 'types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from 'styles/Movie.module.scss';
import { filterEmptyId } from 'mixin';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getGenre } from 'pages/api/genres';
import { getDiscoverRes } from 'pages/api/discover';

const CardMovie = dynamic(() => import('components/card/CardMovie'));
const CardSelect = dynamic(() => import('components/card/CardSelect'));
const ButtonLoadMore = dynamic(() => import('components/button/ButtonLoadMore'));

const Movie: NextPage<{
  discoverResult: IMovie[]
  discoverError: boolean[],
  genreRes: IGenreListRes,
  genreErr: boolean,
}> = ({
  discoverResult,
  discoverError,
  genreRes,
  genreErr,
}) => {
  const router = useRouter();
  const { genre, loaded } = router.query;
  const theme = useTheme();

  const [discoverMovie, setDiscoverMovie] = useState(discoverResult);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loadedPage, setLoadedPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const populateQuery = (genreName: string, loadedContent: number) => {
    const query: {[key: string]: string | number} = {};
    if (genreName) query.genre = genreName;
    if (loadedContent > 1) query.loaded = loadedContent;
    return query;
  };

  const handleGenreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const genreName = event.target.value;
    setSelectedGenre(genreName);
    router.push({
      pathname: '/movie',
      query: populateQuery(genreName, 1),
    });
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    let genreId = 0;
    if (genre) {
      const genreObj = genreRes.genres.find((gen) => gen.name.toLowerCase() === genre);
      genreId = genreObj?.id as number;
    }
    const nextPage = loadedPage + 1;
    setLoadedPage(nextPage);

    router.push({
      pathname: '/movie',
      query: populateQuery(selectedGenre, nextPage),
    }, undefined, { shallow: true });

    const {
      discoverRes: discoverResNext,
      discoverErr: discoverErrNext,
    } = await getDiscover('movie', +genreId, nextPage);
    setDiscoverMovie((prev) => [
      ...prev,
      ...discoverResNext.results as IMovie[],
    ]);
    setLoadingMore(false);
  };

  useEffect(() => {
    setDiscoverMovie(discoverResult);
  }, [discoverResult]);

  useEffect(() => {
    setSelectedGenre(genre as string || '');
    setLoadedPage(+(loaded as string) || 1);
  }, [genre, loaded]);

  return (
    <>
      <Head>
        <title>Discover Movie - Movieme</title>
        <meta name="title" content="Discover Movie - Movieme" />
        <meta name="description" content="Discover all amazing movie here" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Discover Movie - Movieme" />
        <meta property="og:description" content="Discover all amazing movie here" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Discover Movie - Movieme" />
        <meta property="twitter:description" content="Discover all amazing movie here" />
      </Head>
      <Container className="container-custom">
        <h3>Discover Movie</h3>
        <Row className={styles.row_margin}>
          <Col lg={3} className={styles.col_left_margin}>
            <CardSelect
              theme={theme}
              title="Genre"
              options={genreRes.genres.map((gen) => gen.name)}
              selected={selectedGenre}
              onChange={handleGenreChange}
            />
          </Col>
          <Col lg={9} className={styles.col_right_margin}>
            <Row className={styles.row_custom}>
              {discoverMovie.map((movie) => (
                <Link href={`/movie/${movie.id}`} passHref key={movie.id}>
                  <Col xs={6} sm="auto" className={styles.center_content}>
                    <CardMovie
                      id={movie.id}
                      href={`/movie/${movie.id}`}
                      posterPath={movie.poster_path}
                      voteAverage={movie.vote_average}
                      title={movie.title}
                      releaseDate={movie.release_date}
                      theme={theme}
                    />
                  </Col>
                </Link>
              ))}
              <ButtonLoadMore
                loadingMore={loadingMore}
                handleLoadMore={() => handleLoadMore()}
              />
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { genre, loaded } = query;
  const { genreRes, genreErr } = await getGenre('movie');
  let genreId = 0;

  if (genre) {
    const genreObj = genreRes.genres.find((gen) => gen.name.toLowerCase() === genre);
    genreId = genreObj?.id as number;
  }

  const loadedPage = +(loaded as string) || 1;
  const { discoverResult, discoverError } = await getDiscoverRes('movie', loadedPage, genreId);

  // const { genre, loaded } = query;
  // const { genreRes, genreErr } = await getGenreList('movie');
  // let genreId = 0;

  // if (genre) {
  //   const genreObj = genreRes.genres.find((gen) => gen.name.toLowerCase() === genre);
  //   genreId = genreObj?.id as number;
  // }

  // const loadedPage = +(loaded as string) || 1;
  // const loadedPageArr = Array.from(Array(loadedPage + 1).keys());
  // loadedPageArr.shift();

  // const discoverResults = await Promise.all(
  //   loadedPageArr.map(
  //     (page) => (getDiscover('movie', +genreId, page)),
  //   ),
  // );

  // const alldiscoverRes = discoverResults?.map((res) => res.discoverRes);
  // const alldiscoverErr = discoverResults?.map((res) => res.discoverErr);

  // const discoverResult = filterEmptyId(alldiscoverRes.map(({ results }) => results).flat());
  // const discoverError = alldiscoverErr.map((error) => error).flat();

  return {
    props: {
      discoverResult,
      discoverError,
      genreRes,
      genreErr,
    },
  };
};

export default Movie;
