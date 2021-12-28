/* eslint-disable react/require-default-props */
import { Card } from 'react-bootstrap';
import Image from 'next/image';
import { baseImageURL } from 'services';
import styles from './CardSearch.module.scss';

type props = {
  theme: 'dark' | 'light';
  posterPath: string;
  title: string;
  description: string;
  peopleKnowFor?: string[];
}

const CardSearch = ({
  theme,
  posterPath,
  title,
  description,
  peopleKnowFor = [],
}: props) => (
  <Card
    style={{
      width: '100%',
      margin: '10px 0',
    }}
    className={`${styles[`card_${theme}`]} ${styles.card_custome}`}
  >
    <div style={{ display: 'flex' }}>
      <div className={styles.image_custome}>
        <Image
          src={posterPath ? `${baseImageURL}${posterPath}` : '/thumbnail.png'}
          placeholder="blur"
          blurDataURL={`${baseImageURL}${posterPath}`}
          alt={title}
          width="100"
          height="150"
        />
      </div>
      <Card.Body className={styles.card_body}>
        <Card.Title>{title}</Card.Title>
        <Card.Text className={styles.card_text}>
          {description}
          <br />
          {!!peopleKnowFor.length && (
            peopleKnowFor.map((movie, idx) => (
              <span key={movie}>
                {movie}
                {idx !== peopleKnowFor.length - 1 ? ', ' : ''}
              </span>
            ))
          )}
        </Card.Text>
      </Card.Body>
    </div>
  </Card>
);

export default CardSearch;
