import { GetServerSideProps, NextPage } from 'next';
import { Container } from 'react-bootstrap';

const MovieDetail: NextPage<{ movieId: string}> = ({ movieId }) => (
  <Container className="container-custom">
    <h1>Movie Detail {movieId}</h1>
  </Container>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const movieId = params?.movieId;

  return {
    props: {
      movieId,
    },
  };
};

export default MovieDetail;
