/* eslint-disable no-unused-vars */
import CardMovie from 'components/card/CardMovie';
import { useTheme } from 'context/ThemeContext';
import { GetServerSideProps, NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Col,
  Container,
  Row,
  Spinner,
} from 'react-bootstrap';
import { getDiscover, getGenreList } from 'services';
import { IGenreListRes, IMovie, IMovieListRes } from 'types';
import Link from 'next/link';
import CardSelect from 'components/card/CardSelect';
import { useRouter } from 'next/router';
import styles from 'styles/Movie.module.scss';

const Movie: NextPage<{
  discoverRes: IMovieListRes
  discoverErr: boolean,
  genreRes: IGenreListRes,
  genreErr: boolean,
}> = ({
  discoverRes,
  discoverErr,
  genreRes,
  genreErr,
}) => {
  const router = useRouter();
  const { genre } = router.query;
  const theme = useTheme();

  const [discoverMovie, setDiscoverMovie] = useState(discoverRes.results);
  const [currentPage, setCurrentPage] = useState(discoverRes.page);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);

  const handleGenreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const genreName = event.target.value;
    setSelectedGenre(genreName);
    router.push({
      pathname: '/movie',
      query: genreName ? { genre: genreName } : {},
    });
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    let genreId = 0;
    if (genre) {
      const genreObj = genreRes.genres.find((gen) => gen.name.toLowerCase() === genre);
      genreId = genreObj?.id as number;
    }
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const {
      discoverRes: discoverResNext,
      discoverErr: discoverErrNext,
    } = await getDiscover('movie', +genreId, nextPage);
    console.log(discoverResNext, discoverErrNext);
    setDiscoverMovie((prev) => [
      ...prev,
      ...discoverResNext.results as IMovie[],
    ]);
    setLoadingMore(false);
  };

  useEffect(() => {
    setDiscoverMovie(discoverRes.results);
  }, [discoverRes.results]);

  useEffect(() => {
    setSelectedGenre(genre as string || '');
  }, [genre]);

  return (
    <Container className="container-custome">
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
          <Row className={styles.row_custome}>
            {discoverMovie.map((movie) => (
              <Link href={`/movie/${movie.id}`} passHref key={movie.id}>
                <Col xs={6} sm="auto" className={styles.center_content}>
                  <CardMovie
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
            <button
              type="button"
              className={styles.load_button}
              disabled={loadingMore}
              onClick={handleLoadMore}
            >
              {loadingMore && (
                <Spinner animation="border" role="status" className={styles.spinner}>
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
              {!loadingMore && (
                <span>Load More</span>
              )}
            </button>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { genre } = query;
  const { genreRes, genreErr } = await getGenreList();
  let genreId = 0;

  if (genre) {
    const genreObj = genreRes.genres.find((gen) => gen.name.toLowerCase() === genre);
    genreId = genreObj?.id as number;
  }

  const { discoverRes, discoverErr } = await getDiscover('movie', +genreId);

  return {
    props: {
      discoverRes,
      discoverErr,
      genreRes,
      genreErr,
    },
  };
};

export default Movie;
