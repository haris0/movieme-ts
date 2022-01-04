import CardGenre from 'components/card/CardGenre';
import CardSearch from 'components/card/CardSearch';
import CardSelect from 'components/card/CardSelect';
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
  const { keyword, media } = router.query;
  const { genres } = genreRes;
  const theme = useTheme();

  const [movieResuls, setMovieResuls] = useState<IMovie[]>();
  const [tvResult, setTvResult] = useState<ITv[]>();
  const [peopleResult, setPeopleResult] = useState<IPeople[]>();
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState('');
  const [searchKey, setSearchKey] = useState(keyword as string || '');

  const populateQuery = (
    keywordName: string,
    mediaName: string,
  ) => {
    const query: {[key: string]: string} = {};
    if (keywordName) query.keyword = keywordName.trim();
    if (mediaName) query.media = mediaName;
    return query;
  };

  const handleKeyWord = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchKey(value);

    if (value) setSearchLoading(true);
  };

  const handleSearch = (search: string) => {
    console.log(`Search : ${search}`);
  };

  const handleMediaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const mediaName = event.target.value;
    setSelectedMedia(mediaName);
    router.push({
      pathname: '/search',
      query: populateQuery(searchKey, mediaName),
    }, undefined, { shallow: true });
  };

  useDebouncedEffect(async () => {
    if (searchKey) {
      router.push({
        pathname: '/search',
        query: populateQuery(searchKey, media as string),
      }, undefined, { shallow: true });

      const { searchRes, searchErr } = await getSearchByKeyword(searchKey);
      setMovieResuls(searchRes.movieResultsRes.results);
      setTvResult(searchRes.tvResultsRes.results);
      setPeopleResult(searchRes.peopleResultsRes.results);
      console.log(searchRes, searchErr);
      setSearchLoading(false);
      return;
    }

    if (!searchKey) {
      router.push({
        pathname: '/search',
        query: populateQuery(searchKey, ''),
      }, undefined, { shallow: true });

      setMovieResuls(undefined);
      setTvResult(undefined);
      setPeopleResult(undefined);
      setSearchLoading(false);
      setSelectedMedia('');
    }
  }, [searchKey], 1000);

  useEffect(() => {
    setSearchKey(keyword as string || '');
    setSelectedMedia(media as string || '');
  }, [keyword, media]);

  useEffect(() => {
    setSearchLoading(true);
  }, []);

  return (
    <Container className="container-custom">
      <SearchBar
        theme={theme}
        keyword={searchKey}
        onSearch={() => handleSearch(searchKey)}
        onKeyWordChange={handleKeyWord}
      />
      {searchKey && (
        <Row className={styles.margin_top}>
          <Col lg={3} className={styles.margin_bottom}>
            <CardSelect
              theme={theme}
              title="Media"
              options={['Movie', 'Tv', 'People']}
              selected={selectedMedia}
              onChange={handleMediaChange}
            />
          </Col>
          <Col lg={9}>
            {searchLoading && (
              <div style={{ textAlign: 'center' }}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
            {!searchLoading && (
              <div>
                {(selectedMedia === 'movie' || selectedMedia === '') && (
                  <div>
                    {!!movieResuls?.length && (
                      <div className={styles.margin_bottom}>
                        <h4 className={styles.section_title}>Movie Result</h4>
                        {movieResuls.map((movie) => (
                          <Link href={`/movie/${movie.id}`} passHref key={movie.id}>
                            <div>
                              <CardSearch
                                theme={theme}
                                href={`/movie/${movie.id}`}
                                posterPath={movie.poster_path}
                                title={movie.title}
                                description={movie.overview}
                              />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {!movieResuls?.length && selectedMedia !== '' && (
                      <div>No {selectedMedia} found for: {searchKey}</div>
                    )}
                  </div>
                )}
                {(selectedMedia === 'tv' || selectedMedia === '') && (
                  <div>
                    {!!tvResult?.length && (
                      <div className={styles.margin_bottom}>
                        <h4 className={styles.section_title}>Tv Show Result</h4>
                        {tvResult.map((tv) => (
                          <Link href={`/tv/${tv.id}`} passHref key={tv.id}>
                            <div>
                              <CardSearch
                                theme={theme}
                                href={`/tv/${tv.id}`}
                                posterPath={tv.poster_path}
                                title={tv.name}
                                description={tv.overview}
                              />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {!tvResult?.length && selectedMedia !== '' && (
                      <div>No {selectedMedia} found for: {searchKey}</div>
                    )}
                  </div>
                )}
                {(selectedMedia === 'people' || selectedMedia === '') && (
                  <div>
                    {!!peopleResult?.length && (
                      <div className={styles.margin_bottom}>
                        <h4 className={styles.section_title}>People Result</h4>
                        {peopleResult.map((people) => (
                          <Link href={`/people/${people.id}`} passHref key={people.id}>
                            <div>
                              <CardSearch
                                theme={theme}
                                href={`/people/${people.id}`}
                                posterPath={people?.profile_path}
                                title={people.name}
                                description={people.known_for_department}
                                peopleKnowFor={people.known_for.map(
                                  (movie) => movie.title || movie.name,
                                )}
                              />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {!peopleResult?.length && selectedMedia !== '' && (
                      <div>No {selectedMedia} found for: {searchKey}</div>
                    )}
                  </div>
                )}
                {!movieResuls?.length
                && !tvResult?.length
                && !peopleResult?.length
                && selectedMedia === '' && (
                  <div>No results found for: {searchKey}</div>
                )}
              </div>
            )}
          </Col>
        </Row>
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
  const { genreRes, genreErr } = await getGenreList('movie');

  return {
    props: {
      genreRes,
      genreErr,
    },
  };
};

export default Search;
