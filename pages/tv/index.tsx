/* eslint-disable no-unused-vars */
import { useTheme } from 'context/ThemeContext';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useState, useEffect } from 'react';
import {
  Col, Container, Row, Spinner,
} from 'react-bootstrap';
import { getDiscover, getGenreList } from 'services';
import { IGenreListRes, ITv } from 'types';
import styles from 'styles/Tv.module.scss';
import CardSelect from 'components/card/CardSelect';
import Link from 'next/link';
import CardMovie from 'components/card/CardMovie';
import ButtonLoadMore from 'components/button/ButtonLoadMore';

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
    console.log(discoverResNext, discoverErrNext);
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
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { genre, loaded } = query;
  const { genreRes, genreErr } = await getGenreList('tv');
  let genreId = 0;

  if (genre) {
    const genreObj = genreRes.genres.find((gen) => gen.name.toLowerCase() === genre);
    genreId = genreObj?.id as number;
  }

  const loadedPage = +(loaded as string) || 1;
  const loadedPageArr = Array.from(Array(loadedPage + 1).keys());
  loadedPageArr.shift();

  const discoverResults = await Promise.all(
    loadedPageArr.map(
      (page) => (getDiscover('tv', +genreId, page)),
    ),
  );

  const alldiscoverRes = discoverResults?.map((res) => res.discoverRes);
  const alldiscoverErr = discoverResults?.map((res) => res.discoverErr);

  const discoverResult = alldiscoverRes.map(({ results }) => results).flat();
  const discoverError = alldiscoverErr.map((error) => error).flat();

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
