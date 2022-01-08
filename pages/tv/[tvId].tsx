/* eslint-disable no-unused-vars */
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Container } from 'react-bootstrap';
import { getDetail, getDiscover } from 'services';
import { ITvDetail } from 'types';

const TvDetail: NextPage<{
  detailRes: ITvDetail,
  detailErr: boolean,
}> = ({
  detailRes,
  detailErr,
}) => {
  const tv = detailRes;

  return (
    <Container className="container-custom">
      <h3>Tv Show Detail {tv?.name}</h3>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { discoverRes, discoverErr } = await getDiscover('tv');
  let paths = [{
    params: { tvId: '88329' },
  }];

  if (!discoverErr) {
    paths = discoverRes.results.map((discover) => ({
      params: { tvId: discover.id.toString() },
    }));
  }

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const tvId = params?.tvId as string || 0;

  const { detailRes, detailErr } = await getDetail('tv', +tvId);

  return {
    props: {
      detailRes,
      detailErr,
    },
    revalidate: 10,
  };
};

export default TvDetail;
