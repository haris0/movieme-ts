import { Card } from 'react-bootstrap';
import styles from './CardGenre.module.scss';

type props = {
  theme: 'dark' | 'light',
  name: string
}

const CardGenre = ({ theme, name }: props) => (
  <a
    href={`/movie?genre=${name.toLowerCase()}`}
    className={styles.card_anchor}
  >
    <Card className={`${styles[`card_${theme}`]} ${styles.card_custome}`}>
      <Card.Body className={styles.card_body}>{name}</Card.Body>
    </Card>
  </a>
);

export default CardGenre;
