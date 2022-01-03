import { Card } from 'react-bootstrap';
import Image from 'next/image';
import { baseImageURL } from 'services';
import styles from './CardPeople.module.scss';

type props = {
  href: string;
  name: string;
  profilePath: string;
  peopleKnowFor: string[];
  theme: 'dark' | 'light';
}

const CardPeople = ({
  href,
  name,
  profilePath,
  peopleKnowFor,
  theme,
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
          src={profilePath ? `${baseImageURL}${profilePath}` : '/thumbnail.png'}
          placeholder="blur"
          blurDataURL={`${baseImageURL}${profilePath}`}
          alt={name}
          layout="fixed"
          width="150"
          height="180"
        />
      </div>
      <Card.Body className={styles.card_body}>
        <div className={styles.inline_title}>
          <b>{name}</b>
        </div>
        <div className={styles.inline_title}>
          {!!peopleKnowFor.length && (
            peopleKnowFor.map((movie, idx) => (
              <span key={movie}>
                {movie}
                {idx !== peopleKnowFor.length - 1 ? ', ' : ''}
              </span>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  </a>
);

export default CardPeople;