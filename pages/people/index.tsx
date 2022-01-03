/* eslint-disable no-unused-vars */
import CardPeople from 'components/card/CardPeople';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Col, Container, Row, Spinner,
} from 'react-bootstrap';
import { getPopulerPeople } from 'services';
import { IPeople } from 'types';
import styles from 'styles/People.module.scss';
import { useRouter } from 'next/router';
import { useTheme } from 'context/ThemeContext';

const People: NextPage<{
  peopleResult: IPeople[],
  peopleError: Boolean[],
}> = ({
  peopleResult,
  peopleError,
}) => {
  const router = useRouter();
  const { loaded } = router.query;
  const theme = useTheme();

  const [populerPeople, setPopulerPeople] = useState(peopleResult);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedPage, setLoadedPage] = useState(1);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = loadedPage + 1;
    setLoadedPage(nextPage);

    router.push({
      pathname: '/people',
      query: nextPage > 1 ? { loaded: nextPage } : {},
    }, undefined, { shallow: true });

    const {
      peopleRes: peopleResNext,
      peopleErr: peopleErrNext,
    } = await getPopulerPeople(nextPage);
    console.log(peopleResNext, peopleErrNext);
    setPopulerPeople((prev) => [
      ...prev,
      ...peopleResNext.results as IPeople[],
    ]);
    setLoadingMore(false);
  };

  useEffect(() => {
    setLoadedPage(+(loaded as string) || 1);
  }, [loaded]);

  return (
    <Container className="container-custome">
      <h3>Populer People</h3>
      <Row className={styles.row_custome}>
        {populerPeople.map((people) => (
          <Link href={`/people/${people.id}`} passHref key={people.id}>
            <Col xs={6} sm="auto" xl={2} className={styles.center_content}>
              <CardPeople
                href={`/people/${people.id}`}
                name={people.name}
                profilePath={people.profile_path}
                peopleKnowFor={people.known_for.map(
                  (movie) => movie.title || movie.name,
                )}
                theme={theme}
              />
            </Col>
          </Link>
        ))}
        <div style={{ textAlign: 'center' }}>
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
        </div>
      </Row>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { loaded } = query;

  const loadedPage = +(loaded as string) || 1;
  const loadedPageArr = Array.from(Array(loadedPage + 1).keys());
  loadedPageArr.shift();

  const populerPeopleResults = await Promise.all(
    loadedPageArr.map(
      (page) => (getPopulerPeople(page)),
    ),
  );

  const allPeopleRes = populerPeopleResults?.map((res) => res.peopleRes);
  const allPeopleErr = populerPeopleResults?.map((res) => res.peopleErr);

  const peopleResult = allPeopleRes.map(({ results }) => results).flat();
  const peopleError = allPeopleErr.map((error) => error).flat();

  return {
    props: {
      peopleResult,
      peopleError,
    },
  };
};

export default People;