/* eslint-disable react/require-default-props */
import { Card } from 'react-bootstrap';
import Image from 'next/image';
import { baseImageURL } from 'services';
import styles from './CardSearch.module.scss';

type props = {
  theme: 'dark' | 'light';
  href: string;
  posterPath: string;
  title: string;
  description: string;
  peopleKnowFor?: string[];
}

const CardSearch = ({
  theme,
  href,
  posterPath,
  title,
  description,
  peopleKnowFor = [],
}: props) => (
  <a href={href} className={styles.card_anchor}>
    <Card
      style={{
        width: '100%',
        margin: '10px 0',
      }}
      className={`${styles[`card_${theme}`]} ${styles.card_custom}`}
    >
      <div style={{ display: 'flex' }}>
        <div className={styles.image_custom}>
          <Image
            src={posterPath ? `${baseImageURL}${posterPath}` : '/images/thumbnail.png'}
            placeholder="blur"
            blurDataURL={`${baseImageURL}${posterPath}`}
            alt={title}
            layout="fixed"
            width="100"
            height="140"
          />
        </div>
        <Card.Body className={styles.card_body}>
          <Card.Title className={styles.card_title}>{title}</Card.Title>
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
  </a>
);

export default CardSearch;
