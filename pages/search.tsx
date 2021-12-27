import CardGenre from 'components/card/CardGenre';
import SearchBar from 'components/search/Search';
import { useTheme } from 'context/ThemeContext';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
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
  const theme = useTheme();

  const [searchKey, setSearchKey] = useState(keyword as string || '');
  const handleKeyWord = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(event.target.value);
  };

  const { genres } = genreRes;

  const handleSearch = (search: string) => {
    console.log(`Search : ${search}`);
  };

  return (
    <Container className="container-custome">
      <SearchBar
        theme={theme}
        keyword={searchKey}
        onSearch={() => handleSearch(searchKey)}
        onKeyWordChange={handleKeyWord}
      />
      {!searchKey && (
        <div className={styles.genre_list}>
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
