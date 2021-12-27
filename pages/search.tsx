import CardGenre from 'components/card/CardGenre';
import SearchBar from 'components/search/Search';
import { useTheme } from 'context/ThemeContext';
import { useDebouncedEffect } from 'mixin';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { getGenreList } from 'services';
import styles from 'styles/Search.module.scss';
import { IGenreListRes } from 'types';

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

  const [searchKey, setSearchKey] = useState(keyword as string || '');
  const useHandleKeyWord = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchKey(value);
  };
  const handleSearch = (search: string) => {
    console.log(`Search : ${search}`);
  };

  useDebouncedEffect(() => {
    router.push({
      pathname: '/search',
      query: searchKey ? { keyword: searchKey } : {},
    });
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
          <h3>Search for: {searchKey}</h3>
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
