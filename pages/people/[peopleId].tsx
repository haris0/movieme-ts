/* eslint-disable no-unused-vars */
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Container } from 'react-bootstrap';
import { getDetailPeople, getPopulerPeople } from 'services';
import { IPeopleDetail } from 'types';

const PeopleDetail: NextPage<{
  detailRes: IPeopleDetail,
  detailErr: boolean
}> = ({
  detailRes,
  detailErr,
}) => {
  const people = detailRes;

  return (
    <Container className="container-custom">
      <h3>People Detail {people.name}</h3>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { peopleRes, peopleErr } = await getPopulerPeople();
  let paths = [{
    params: { peopleId: '1136406' },
  }];

  if (!peopleErr) {
    paths = peopleRes.results.map((people) => ({
      params: { peopleId: people.id.toString() },
    }));
  }

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const peopleId = params?.peopleId as string || 0;

  const { detailRes, detailErr } = await getDetailPeople(+peopleId);

  return {
    props: {
      detailRes,
      detailErr,
    },
  };
};

export default PeopleDetail;
