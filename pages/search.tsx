import CardGenre from 'components/card/CardGenre';
import CardSearch from 'components/card/CardSearch';
import SearchBar from 'components/search/Search';
import { useTheme } from 'context/ThemeContext';
import { useDebouncedEffect } from 'mixin';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ChangeEvent, useEffect, useState,
} from 'react';
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

    if (value) setSearchLoading(true);
  };
  const handleSearch = (search: string) => {
    console.log(`Search : ${search}`);
  };

  useDebouncedEffect(async () => {
    router.push({
      pathname: '/search',
      query: searchKey ? { keyword: searchKey.trim() } : {},
    });

    if (searchKey) {
      const { searchRes, searchErr } = await getSearchByKeyword(searchKey);
      setMovieResuls(searchRes.movieResultsRes.results);
      setTvResult(searchRes.tvResultsRes.results);
      setPeopleResult(searchRes.peopleResultsRes.results);
      console.log(searchRes, searchErr);
      setSearchLoading(false);
      return;
    }

    if (!searchKey) {
      setMovieResuls(undefined);
      setTvResult(undefined);
      setPeopleResult(undefined);
      setSearchLoading(false);
    }
  }, [searchKey], 1000);

  useEffect(() => {
    setSearchKey(keyword as string || '');
  }, [keyword]);

  useEffect(() => {
    setSearchLoading(true);
  }, []);

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
          <h4 className={styles.section_title}>Movie Result</h4>
          {movieResuls.map((movie) => (
            <CardSearch
              key={movie.id}
              theme={theme}
              posterPath={movie.poster_path}
              title={movie.title}
              description={movie.overview}
            />
          ))}
        </div>
      )}
      {searchKey && !!tvResult?.length && !searchLoading && (
        <div>
          <h4 className={styles.section_title}>Tv Show Result</h4>
          {tvResult.map((tv) => (
            <CardSearch
              key={tv.id}
              theme={theme}
              posterPath={tv.poster_path}
              title={tv.name}
              description={tv.overview}
            />
          ))}
        </div>
      )}
      {searchKey && !!peopleResult?.length && !searchLoading && (
        <div>
          <h4 className={styles.section_title}>People Result</h4>
          {peopleResult.map((people) => (
            <CardSearch
              key={people.id}
              theme={theme}
              posterPath={people?.profile_path}
              title={people.name}
              description={people.known_for_department}
              peopleKnowFor={people.known_for.map((movie) => movie.title || movie.name)}
            />
          ))}
        </div>
      )}
      {searchKey
      && !movieResuls?.length
      && !tvResult?.length
      && !peopleResult?.length
      && !searchLoading && (
        <div>No results found for {searchKey}</div>
      )}
      {!searchKey && (
        <div className={styles.margin_top}>
          {genres && (
            <Row>
              {genres.map((genre) => (
                <Link
                  href={{
                    pathname: '/movie',
                    query: { genre: genre.name.toLowerCase() },
                  }}
                  passHref
                  key={genre.id}
                >
                  <Col sm={6} md={4}>
                    <CardGenre
                      theme={theme}
                      name={genre.name}
                    />
                  </Col>
                </Link>
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
