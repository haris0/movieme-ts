import Image from 'next/image';
import { Card } from 'react-bootstrap';
import { baseImageURL } from 'services';
import { IMovie } from 'types';
import styles from './CardMovie.module.scss';

type props = {
  movie: IMovie
  theme: 'dark' | 'light';
}

const CardMovie = ({ movie, theme }: props) => (
  <Card
    style={{ width: '152px' }}
    className={`${styles[`card_${theme}`]} ${styles.card_custome}`}
  >
    <Image
      src={`${baseImageURL}${movie.poster_path}`}
      placeholder="blur"
      blurDataURL={`${baseImageURL}${movie.poster_path}`}
      alt={movie.title}
      layout="fixed"
      width="150"
      height="225"
      className={styles.image_custome}
    />
    <div className={styles.vote_average}>{movie.vote_average}</div>
    <Card.Body className={styles.card_body}>
      <div className={styles.inline_title}>
        <b>{movie.title}</b>
      </div>
      <span>{movie.release_date}</span>
    </Card.Body>
  </Card>
);

export default CardMovie;
