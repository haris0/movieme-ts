/* eslint-disable no-unused-vars */
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Col, Container, Row } from 'react-bootstrap';
import { baseProfileDetailURL, getDetail, getDiscover } from 'services';
import { IMovieDetail } from 'types';
import styles from 'styles/MovieDetail.module.scss';
import Banner from 'components/benner/Banner';
import Image from 'next/image';
import { convertDate, convertMinsToHrsMins, getYear } from 'mixin';

const MovieDetail: NextPage<{
  detailRes: IMovieDetail,
  detailErr: boolean,
 }> = ({
   detailRes,
   detailErr,
 }) => {
   const movie = detailRes;
   const releaseDate = convertDate(movie.release_date);
   const releaseYear = getYear(movie.release_date);
   const duration = convertMinsToHrsMins(movie.runtime);
   console.log(movie);

   return (
     <div>
       <Banner backdropPath={movie.backdrop_path} />
       <Container className={`${'container-custom'} ${styles.movie_container}`}>
         <Row>
           <Col sm={6} md={4} lg={3} className={styles.col_center}>
             <div className={styles.image_wrapper}>
               <Image
                 src={movie.poster_path ? `${baseProfileDetailURL}${movie.poster_path}` : '/images/thumbnail.png'}
                 placeholder="blur"
                 blurDataURL={`${baseProfileDetailURL}${movie.poster_path}`}
                 alt={movie.title}
                 layout="fill"
                 objectFit="cover"
               />
             </div>
           </Col>
           <Col sm={6} md={8} lg={9}>
             <h2>{movie.title} ({releaseYear})</h2>
             <div>
               <span>{releaseDate} ({movie.production_countries[0].iso_3166_1})</span>
               <span className={styles.subtitle_separator}>■</span>
               {movie.genres.map((genre, idx) => (
                 <span key={genre.id}>
                   {genre.name}
                   {movie.genres.length !== (idx + 1) && (
                     <span>,{' '}</span>
                   )}
                 </span>
               ))}
               <span className={styles.subtitle_separator}>■</span>
               <span>{duration}</span>
             </div>
             <div className={styles.movie_icon}>
               <div className={styles.vote_average}>
                 <span>
                   {movie.vote_average * 10}
                 </span>
                 <span
                   style={{
                     fontSize: '6px',
                   }}
                 >%
                 </span>
               </div>
               <div className={styles.icon_rounded}>
                 <button
                   type="button"
                   className={styles.icon}
                 >
                   <Image
                     src="/images/unfavorite_white.png"
                     alt="favorite"
                     layout="fixed"
                     width="25"
                     height="25"
                     className={styles.opacity}
                   />
                 </button>
               </div>
               <div className={styles.icon_rounded}>
                 <button
                   type="button"
                   className={styles.icon}
                 >
                   <Image
                     src="/images/play.png"
                     alt="favorite"
                     layout="fixed"
                     width="25"
                     height="25"
                   />
                 </button>
               </div>
               <span className={styles.trailer_text}>
                 <b>Play Trailer</b>
               </span>
             </div>
           </Col>
         </Row>
         <Row>
           <Col sm={6} md={4} lg={3}> Bla Bla</Col>
           <Col sm={6} md={8} lg={9}> Bla bals</Col>
         </Row>
       </Container>
     </div>
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

  return { paths, fallback: 'blocking' };
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
