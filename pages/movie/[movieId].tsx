/* eslint-disable no-unused-vars */
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Container } from 'react-bootstrap';
import { getDetail, getDiscover } from 'services';
import { IMovieDetail } from 'types';

const MovieDetail: NextPage<{
  detailRes: IMovieDetail,
  detailErr: boolean,
 }> = ({
   detailRes,
   detailErr,
 }) => {
   const movie = detailRes;

   return (
     <Container className="container-custom">
       <h3>Movie Detail {movie.title}</h3>
     </Container>
   );
 };

export const getStaticPaths: GetStaticPaths = async () => {
  const { discoverRes, discoverErr } = await getDiscover('movie');
  let paths = [{
    params: { movieId: '634649' },
  }];

  if (!discoverErr) {
    paths = discoverRes.results.map((discover) => ({
      params: { movieId: discover.id.toString() },
    }));
  }

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const movieId = params?.movieId as string || 0;

  const { detailRes, detailErr } = await getDetail('movie', +movieId);

  return {
    props: {
      detailRes,
      detailErr,
    },
    revalidate: 10,
  };
};

export default MovieDetail;
