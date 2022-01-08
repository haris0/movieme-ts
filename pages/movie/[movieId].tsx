/* eslint-disable no-unused-vars */
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  Badge, Col, Container, Row,
} from 'react-bootstrap';
import { baseProfileDetailURL, getDetail, getDiscover } from 'services';
import { IMovieDetail } from 'types';
import styles from 'styles/MovieDetail.module.scss';
import Banner from 'components/benner/Banner';
import Image from 'next/image';
import { convertDate, convertMinsToHrsMins, getYear } from 'mixin';
import Link from 'next/link';
import CardMovie from 'components/card/CardMovie';
import { useTheme } from 'context/ThemeContext';
import CardPeople from 'components/card/CardPeople';

const MovieDetail: NextPage<{
  detailRes: IMovieDetail,
  detailErr: boolean,
 }> = ({
   detailRes,
   detailErr,
 }) => {
   const theme = useTheme();
   const movie = detailRes;
   const releaseDate = convertDate(movie.release_date);
   const releaseYear = getYear(movie.release_date);
   const duration = convertMinsToHrsMins(movie.runtime);
   const topCast = movie?.cast?.slice(0, 9);
   const { recommendations } = movie;
   const writers = movie?.crew?.filter((crew) => crew.department === 'Writing');
   //  console.log(movie);

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

             <div className={styles.sosmed_wrapper}>
               {movie.sosial_media?.facebook_id && (
                 <div className={styles.sosmed_logo}>
                   <a target="_blank" href={`https://www.facebook.com/${movie.sosial_media.facebook_id}`} rel="noreferrer">
                     <Image
                       src="/images/facebook.png"
                       alt={movie.title}
                       width="35"
                       height="35"
                       layout="fixed"
                     />
                   </a>
                 </div>
               )}
               {movie.sosial_media?.twitter_id && (
                 <div className={styles.sosmed_logo}>
                   <a target="_blank" href={`https://twitter.com/${movie.sosial_media.twitter_id}`} rel="noreferrer">
                     <Image
                       src="/images/twitter.png"
                       alt={movie.title}
                       width="35"
                       height="35"
                       layout="fixed"
                     />
                   </a>
                 </div>
               )}
               {movie.sosial_media?.instagram_id && (
                 <div className={styles.sosmed_logo}>
                   <a target="_blank" href={`https://www.instagram.com/${movie.sosial_media.instagram_id}`} rel="noreferrer">
                     <Image
                       src="/images/instagram.png"
                       alt={movie.title}
                       width="35"
                       height="35"
                       layout="fixed"
                     />
                   </a>
                 </div>
               )}
               {movie.homepage && (
                 <div className={styles.sosmed_logo}>
                   <a target="_blank" href={movie.homepage} rel="noreferrer">
                     <Image
                       src="/images/link.png"
                       alt={movie.title}
                       width="38"
                       height="38"
                       layout="fixed"
                     />
                   </a>
                 </div>
               )}
             </div>
           </Col>
           <Col md={8} lg={9}>
             <h2>{movie.title} ({releaseYear})</h2>
             <div>
               <span>
                 {releaseDate} ({
                   movie.production_companies[movie.production_companies.length - 1]?.origin_country
                 })
               </span>
               <span className={styles.subtitle_separator}>•</span>
               {movie.genres.map((genre, idx) => (
                 <span key={genre.id}>
                   {genre.name}
                   {movie.genres.length !== (idx + 1) && (
                     <span>,{' '}</span>
                   )}
                 </span>
               ))}
               <span className={styles.subtitle_separator}>•</span>
               <span>{duration}</span>
             </div>
             <div className={styles.movie_writer}>
               <Row>
                 {writers?.map((writer) => (
                   <Col
                     key={writer.id}
                     xs={6}
                     sm={6}
                     md={4}
                     lg={3}
                     className={styles.writer_col}
                   >
                     <Link href={`/people/${writer.id}`} passHref>
                       <a href={`/people/${writer.id}`} className={styles.writer_anchor}>
                         <div>
                           <b>{writer.name}</b>
                         </div>
                         <div>{writer.job}</div>
                       </a>
                     </Link>
                   </Col>
                 ))}
               </Row>
             </div>

             <div className={styles.movie_actions}>
               <div className={styles.icon_vote}>
                 <span>
                   {movie.vote_average * 10}
                 </span>
                 <span style={{ fontSize: '6px' }}>
                   %
                 </span>
               </div>
               <div className={styles.icon_bookmark}>
                 <button
                   type="button"
                   className={styles.button_icon}
                 >
                   <Image
                     src="/images/unfavorite_white.png"
                     alt="favorite"
                     layout="fixed"
                     width="16"
                     height="16"
                   />
                 </button>
               </div>
               <div className={styles.icon_play}>
                 <button
                   type="button"
                   className={styles.button_icon}
                 >
                   <Image
                     src="/images/play.png"
                     alt="favorite"
                     layout="fixed"
                     width="19"
                     height="19"
                   />
                   <span className={styles.trailer_text}>
                     <b>Play Trailer</b>
                   </span>
                 </button>
               </div>
             </div>
           </Col>
         </Row>
         <Row style={{ marginTop: '1rem' }}>
           <Col md={4} lg={3}>
             <div className={styles.personal_info}>
               <h5>Movie Info</h5>
               <div className={styles.sub_info}>
                 <h6>Status</h6>
                 <div>{movie.status}</div>
               </div>
               <div className={styles.sub_info}>
                 <h6>Original Language</h6>
                 <div>{movie.spoken_languages[0].name}</div>
               </div>
               <div className={styles.sub_info}>
                 <h6>Budget</h6>
                 <div>$ {movie.budget.toLocaleString('en')}</div>
               </div>
               <div className={styles.sub_info}>
                 <h6>Revenue</h6>
                 <div>$ {movie.revenue.toLocaleString('en')}</div>
               </div>
               <div className={styles.sub_info}>
                 <h6>Keyword</h6>
                 <div>
                   {movie.keywords?.map((keyword) => (
                     <Badge
                       bg="secondary"
                       className={styles.badge_keywords}
                       key={keyword.id}
                     >
                       {keyword.name}
                     </Badge>
                   ))}
                 </div>
               </div>
             </div>
           </Col>
           <Col sm={6} md={8} lg={9}>
             <div>
               <h5>Overview</h5>
               <div className={styles.tagline}>{movie.tagline}</div>
               <p>{movie.overview}</p>
               <div>
                 {!!topCast?.length && (
                   <>
                     <h5 className={styles.recom_title}>Top Billed Cast</h5>
                     <div className={styles.scroll_container}>
                       {topCast.map((people) => (
                         <Link href={`/people/${people.id}`} passHref key={people.id}>
                           <div className={styles.skin_option}>
                             <CardPeople
                               href={`/people/${people.id}`}
                               name={people.name}
                               profilePath={people.profile_path as string}
                               peopleKnowFor={[people.known_for_department]}
                               theme={theme}
                             />
                           </div>
                         </Link>
                       ))}
                       <div className={styles.showmore_container}>
                         <div className={styles.showmore_text}>
                           <button type="button" className={styles.showmore_button}>
                             <b>All Cast & Crew →</b>
                           </button>
                         </div>
                       </div>
                     </div>
                   </>
                 )}
               </div>
             </div>
           </Col>
         </Row>
         <h5 className={styles.recom_title}>Recommendations</h5>
         {!!recommendations?.length && (
           <div className={styles.scroll_container}>
             {recommendations.map((recom) => (
               <Link href={`/movie/${recom.id}`} passHref key={recom.id}>
                 <div className={styles.skin_option}>
                   <CardMovie
                     id={recom.id}
                     href={`/movie/${recom.id}`}
                     posterPath={recom.poster_path as string}
                     voteAverage={recom.vote_average}
                     title={recom.title}
                     releaseDate={recom.release_date as Date}
                     theme={theme}
                   />
                 </div>
               </Link>
             ))}
           </div>
         )}
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
