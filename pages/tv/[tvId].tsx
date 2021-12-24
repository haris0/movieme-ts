import { GetServerSideProps, NextPage } from 'next';
import { Container } from 'react-bootstrap';

const MovieDetail: NextPage<{ tvId: string}> = ({ tvId }) => (
  <Container className="container-custome">
    <h1>Tv Show Detail {tvId}</h1>
  </Container>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const tvId = params?.tvId;

  return {
    props: {
      tvId,
    },
  };
};

export default MovieDetail;
