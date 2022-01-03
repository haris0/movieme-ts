import { GetServerSideProps, NextPage } from 'next';
import { Container } from 'react-bootstrap';

const TvDetail: NextPage<{ tvId: string}> = ({ tvId }) => (
  <Container className="container-custom">
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

export default TvDetail;
