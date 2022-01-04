/* eslint-disable no-unused-vars */
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Container } from 'react-bootstrap';
import { getDetailMovie, getDiscover } from 'services';
import { IMovieDetail } from 'types';

const MovieDetail: NextPage<{
  detailMovieRes: IMovieDetail,
  detailMovieErr: boolean,
 }> = ({
   detailMovieRes,
   detailMovieErr,
 }) => {
   const detailMovie = detailMovieRes;

   return (
     <Container className="container-custom">
       <h3>Movie Detail {detailMovie.title}</h3>
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

  const { detailMovieRes, detailMovieErr } = await getDetailMovie(+movieId);

  return {
    props: {
      detailMovieRes,
      detailMovieErr,
    },
    revalidate: 10,
  };
};

export default MovieDetail;
