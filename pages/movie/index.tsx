/* eslint-disable no-unused-vars */
import CardMovie from 'components/card/CardMovie';
import { useTheme } from 'context/ThemeContext';
import { GetServerSideProps, NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import { getDiscover, getGenreList } from 'services';
import { IGenreListRes, IMovieListRes } from 'types';
import Link from 'next/link';
import CardSelectGenre from 'components/card/CardSelectGenre';
import { useRouter } from 'next/router';

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
  const [selectedGenre, setSelectedGenre] = useState('');

  const handleGenreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const genreName = event.target.value;
    setSelectedGenre(genreName);
    router.push({
      pathname: '/movie',
      query: genreName ? { genre: genreName } : {},
    });
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
      <Row style={{ marginTop: '1rem' }}>
        <Col sm={3} style={{ marginBottom: '1.5rem' }}>
          <CardSelectGenre
            theme={theme}
            options={genreRes.genres}
            selected={selectedGenre}
            onChange={handleGenreChange}
          />
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
