/* eslint-disable react/require-default-props */
import { convertDate } from 'mixin';
import Image from 'next/image';
import { Card } from 'react-bootstrap';
import { baseImageURL } from 'services';
import styles from './CardMovie.module.scss';

type props = {
  href: string;
  posterPath: string;
  voteAverage: number;
  title: string;
  releaseDate: Date;
  theme: 'dark' | 'light';
  favorited?: boolean;
}

const CardMovie = ({
  href,
  posterPath,
  voteAverage,
  title,
  releaseDate,
  theme,
  favorited = false,
}: props) => (

  <a href={href} className={styles.card_anchor}>
    <Card
      style={{
        width: '152px',
        margin: '10px',
      }}
      className={`${styles[`card_${theme}`]} ${styles.card_custome}`}
    >
      <div className={styles.image_custome}>
        <Image
          src={posterPath ? `${baseImageURL}${posterPath}` : '/thumbnail.png'}
          placeholder="blur"
          blurDataURL={`${baseImageURL}${posterPath}`}
          alt={title}
          layout="fixed"
          width="150"
          height="225"
        />
      </div>
      {favorited && (
        <div className={styles.favorited_icon}>
          <Image
            src="/favorited.png"
            alt="favorite"
            layout="fixed"
            width="22"
            height="22"
          />
        </div>
      )}
      {!favorited && (
        <div className={styles.unfavorite_icon}>
          <Image
            src="/unfavorite.png"
            alt="favorite"
            layout="fixed"
            width="22"
            height="22"
          />
        </div>
      )}
      <div className={styles.vote_average}>
        <span>
          {voteAverage * 10}
        </span>
        <span
          style={{
            fontSize: '6px',
          }}
        >%
        </span>
      </div>
      <Card.Body className={styles.card_body}>
        <div className={styles.inline_title}>
          <b>{title}</b>
        </div>
        <span>{convertDate(releaseDate)}</span>
      </Card.Body>
    </Card>
  </a>
);

export default CardMovie;
