import { GetServerSideProps, NextPage } from 'next';
import { Container } from 'react-bootstrap';

const PeopleDetail: NextPage<{ peopleId: string}> = ({ peopleId }) => (
  <Container className="container-custom">
    <h1>People Detail {peopleId}</h1>
  </Container>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const peopleId = params?.peopleId;

  return {
    props: {
      peopleId,
    },
  };
};

export default PeopleDetail;
