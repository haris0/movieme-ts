import Image from 'next/image';
import { Card } from 'react-bootstrap';
import { baseImageURL } from 'services';
import styles from './CardMovie.module.scss';

const convertDate = (date: Date): string => {
  const monthLetter = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'];

  const [year, month, day] = date.toString().split('-');

  return `${monthLetter[(+month) - 1]} ${day}, ${year}`;
};

type props = {
  posterPath: string;
  voteAverage: number;
  title: string;
  releaseDate: Date;
  theme: 'dark' | 'light';
}

const CardMovie = ({
  posterPath,
  voteAverage,
  title,
  releaseDate,
  theme,
}: props) => (
  <Card
    style={{ width: '152px' }}
    className={`${styles[`card_${theme}`]} ${styles.card_custome}`}
  >
    <Image
      src={`${baseImageURL}${posterPath}`}
      placeholder="blur"
      blurDataURL={`${baseImageURL}${posterPath}`}
      alt={title}
      layout="fixed"
      width="150"
      height="225"
      className={styles.image_custome}
    />
    <div className={styles.vote_average}>{voteAverage}</div>
    <Card.Body className={styles.card_body}>
      <div className={styles.inline_title}>
        <b>{title}</b>
      </div>
      <span>{convertDate(releaseDate)}</span>
    </Card.Body>
  </Card>
);

export default CardMovie;
