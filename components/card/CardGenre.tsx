import { Card } from 'react-bootstrap';
import styles from './CardGenre.module.scss';

type props = {
  theme: 'dark' | 'light',
  name: string
}

const CardGenre = ({ theme, name }: props) => (
  <Card className={`${styles[`card_${theme}`]} ${styles.card_custome}`}>
    <Card.Body className={styles.card_body}>{name}</Card.Body>
  </Card>
);

export default CardGenre;
