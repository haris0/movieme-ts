import CardGenre from 'components/card/CardGenre';
import SearchBar from 'components/search/Search';
import { useTheme } from 'context/ThemeContext';
import { useDebouncedEffect } from 'mixin';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Col,
  Container,
  Row,
  Spinner,
} from 'react-bootstrap';
import { getGenreList, getSearchByKeyword } from 'services';
import styles from 'styles/Search.module.scss';
import {
  IGenreListRes,
  IMovie,
  IPeople,
  ITv,
} from 'types';

const Search: NextPage<{
  genreRes: IGenreListRes,
  genreErr: boolean
}> = ({
  genreRes,
  genreErr,
}) => {
  const router = useRouter();
  const { keyword } = router.query;
  const { genres } = genreRes;
  const theme = useTheme();

  const [movieResuls, setMovieResuls] = useState<IMovie[]>();
  const [tvResult, setTvResult] = useState<ITv[]>();
  const [peopleResult, setPeopleResult] = useState<IPeople[]>();
  const [searchLoading, setSearchLoading] = useState(false);

  const [searchKey, setSearchKey] = useState(keyword as string || '');
  const useHandleKeyWord = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchKey(value);
  };
  const handleSearch = (search: string) => {
    console.log(`Search : ${search}`);
  };

  useDebouncedEffect(async () => {
    router.push({
      pathname: '/search',
      query: searchKey ? { keyword: searchKey } : {},
    });

    if (searchKey) {
      setSearchLoading(true);
      const { searchRes, searchErr } = await getSearchByKeyword(searchKey);
      setMovieResuls(searchRes.movieResultsRes.results);
      setTvResult(searchRes.tvResultsRes.results);
      setPeopleResult(searchRes.peopleResultsRes.results);
      setSearchLoading(false);
      console.log(searchRes, searchErr);
    }

    if (!searchKey) {
      setMovieResuls(undefined);
      setTvResult(undefined);
      setPeopleResult(undefined);
    }
  }, [searchKey], 1000);

  useEffect(() => {
    setSearchKey(keyword as string || '');
  }, [keyword]);

  return (
    <Container className="container-custome">
      <SearchBar
        theme={theme}
        keyword={searchKey}
        onSearch={() => handleSearch(searchKey)}
        onKeyWordChange={useHandleKeyWord}
      />
      {searchKey && (
        <div className={styles.margin_top}>
          {searchLoading && (
            <div style={{ textAlign: 'center' }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
        </div>
      )}
      {searchKey && !!movieResuls?.length && !searchLoading && (
        <div>
          <h4>Movie Result</h4>
          <ul>
            {movieResuls.map((movie) => (
              <li key={movie.id}>{movie.title}</li>
            ))}
          </ul>
        </div>
      )}
      {searchKey && !!tvResult?.length && !searchLoading && (
        <div>
          <h4>Tv Show Result</h4>
          <ul>
            {tvResult.map((tv) => (
              <li key={tv.id}>{tv.name}</li>
            ))}
          </ul>
        </div>
      )}
      {searchKey && !!peopleResult?.length && !searchLoading && (
        <div>
          <h4>People Result</h4>
          <ul>
            {peopleResult.map((people) => (
              <li key={people.id}>{people.name}</li>
            ))}
          </ul>
        </div>
      )}
      {!searchKey && (
        <div className={styles.margin_top}>
          {genres && (
            <Row>
              {genres.map((genre) => (
                <Col sm={6} md={4} key={genre.id}>
                  <CardGenre
                    theme={theme}
                    name={genre.name}
                  />
                </Col>
              ))}
            </Row>
          )}
          {genreErr && (
            <div>Failed to Load Data</div>
          )}
        </div>
      )}
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { genreRes, genreErr } = await getGenreList();

  return {
    props: {
      genreRes,
      genreErr,
    },
  };
};

export default Search;
