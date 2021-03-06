/* eslint-disable no-unused-vars */
import { useTheme } from 'context/ThemeContext';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useState, useEffect } from 'react';
import {
  Col, Container, Row,
} from 'react-bootstrap';
import { getDiscover, getGenreList } from 'services';
import { IGenreListRes, ITv } from 'types';
import styles from 'styles/Tv.module.scss';
import Link from 'next/link';
import { filterEmptyId } from 'mixin';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getGenre } from 'pages/api/genres';
import { getDiscoverRes } from 'pages/api/discover';

const CardMovie = dynamic(() => import('components/card/CardMovie'));
const CardSelect = dynamic(() => import('components/card/CardSelect'));
const ButtonLoadMore = dynamic(() => import('components/button/ButtonLoadMore'));

const Tv: NextPage<{
  discoverResult: ITv[]
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

  const [discoverTv, setDiscoverTv] = useState(discoverResult);
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
      pathname: '/tv',
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
      pathname: '/tv',
      query: populateQuery(selectedGenre, nextPage),
    }, undefined, { shallow: true });

    const {
      discoverRes: discoverResNext,
      discoverErr: discoverErrNext,
    } = await getDiscover('tv', +genreId, nextPage);
    setDiscoverTv((prev) => [
      ...prev,
      ...discoverResNext.results as ITv[],
    ]);
    setLoadingMore(false);
  };

  useEffect(() => {
    setDiscoverTv(discoverResult);
  }, [discoverResult]);

  useEffect(() => {
    setSelectedGenre(genre as string || '');
    setLoadedPage(+(loaded as string) || 1);
  }, [genre, loaded]);

  return (
    <>
      <Head>
        <title>Discover Tv Show - Movieme</title>
        <meta name="title" content="Discover Tv Show - Movieme" />
        <meta name="description" content="Discover all amazing tv show here" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Discover Tv Show - Movieme" />
        <meta property="og:description" content="Discover all amazing tv show here" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Discover Tv Show - Movieme" />
        <meta property="twitter:description" content="Discover all amazing tv show here" />
      </Head>
      <Container className="container-custom">
        <h3>Discover Tv Show</h3>
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
              {discoverTv.map((tv) => (
                <Link href={`/tv/${tv.id}`} passHref key={tv.id}>
                  <Col xs={6} sm="auto" className={styles.center_content}>
                    <CardMovie
                      id={tv.id}
                      href={`/tv/${tv.id}`}
                      posterPath={tv.poster_path}
                      voteAverage={tv.vote_average}
                      title={tv.name}
                      releaseDate={tv.first_air_date}
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
  const { genreRes, genreErr } = await getGenre('tv');
  let genreId = 0;

  if (genre) {
    const genreObj = genreRes.genres.find((gen) => gen.name.toLowerCase() === genre);
    genreId = genreObj?.id as number;
  }

  const loadedPage = +(loaded as string) || 1;
  const { discoverResult, discoverError } = await getDiscoverRes('tv', loadedPage, genreId);

  // const { genre, loaded } = query;
  // const { genreRes, genreErr } = await getGenreList('tv');
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
  //     (page) => (getDiscover('tv', +genreId, page)),
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

export default Tv;
