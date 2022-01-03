/* eslint-disable react/require-default-props */
import { MouseEvent } from 'react';
import { convertDate } from 'mixin';
import Image from 'next/image';
import { Card } from 'react-bootstrap';
import { baseImageURL } from 'services';
import { IFavorite } from 'types';
import {
  useAddFavorite,
  useCheckFavorite,
  useRemoveFavorite,
} from 'context/FavoriteContext';
import styles from './CardMovie.module.scss';

const useCheckFav = (id: number) => {
  const checkFavorite = useCheckFavorite();
  return checkFavorite(id);
};

type props = {
  id: number;
  href: string;
  posterPath: string;
  voteAverage: number;
  title: string;
  releaseDate: Date;
  theme: 'dark' | 'light';
}

const CardMovie = ({
  id,
  href,
  posterPath,
  voteAverage,
  title,
  releaseDate,
  theme,
}: props) => {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleFavorite = (
    event: MouseEvent<HTMLButtonElement>,
    movie: IFavorite,
  ) => {
    event.preventDefault();
    addFavorite(movie);
  };

  const handleUnFavorite = (
    event: MouseEvent<HTMLButtonElement>,
    movieId: number,
  ) => {
    event.preventDefault();
    removeFavorite(movieId);
  };

  return (
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
        {useCheckFav(id) && (
          <button
            type="button"
            onClick={(event) => handleUnFavorite(event, id)}
            className={styles.favorited_icon}
          >
            <Image
              src="/favorited.png"
              alt="favorite"
              layout="fixed"
              width="22"
              height="22"
            />
          </button>
        )}
        {!useCheckFav(id) && (
          <button
            type="button"
            onClick={(event) => handleFavorite(event, {
              id,
              href,
              posterPath,
              voteAverage,
              title,
              releaseDate,
            })}
            className={styles.unfavorite_icon}
          >
            <Image
              src="/unfavorite.png"
              alt="favorite"
              layout="fixed"
              width="22"
              height="22"
            />
          </button>
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
};

export default CardMovie;
