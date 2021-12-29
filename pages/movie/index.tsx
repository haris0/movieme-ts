/* eslint-disable no-unused-vars */
import CardMovie from 'components/card/CardMovie';
import { useTheme } from 'context/ThemeContext';
import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import {
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import { getDiscover, getGenreList } from 'services';
import { IGenreListRes, IMovieListRes } from 'types';
import Link from 'next/link';
import CardSelectGenre from 'components/card/CardSelectGenre';

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
  const theme = useTheme();

  const [discoverMovie, setDiscoverMovie] = useState(discoverRes.results);

  return (
    <Container className="container-custome">
      <h3>Discover Movie</h3>
      <Row style={{ marginTop: '1rem' }}>
        <Col sm={3} style={{ marginBottom: '1.5rem' }}>
          <CardSelectGenre theme={theme} genres={genreRes.genres} />
        </Col>
        <Col sm={9} style={{ marginTop: '-10px' }}>
          <Row>
            {discoverMovie.map((movie) => (
              <Link href={`/movie/${movie.id}`} passHref key={movie.id}>
                <Col xs={6} sm="auto">
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
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const [discover, genre] = await Promise.all([
    getDiscover('movie'),
    getGenreList(),
  ]);
  const { discoverRes, discoverErr } = discover;
  const { genreRes, genreErr } = genre;

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
