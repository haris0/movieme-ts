import { Card } from 'react-bootstrap';
import { IGenre } from 'types';
import styles from './CardSelectGenre.module.scss';

type props = {
  theme: 'dark' | 'light';
  genres: IGenre[];
};

const CardSelectGenre = ({ theme, genres }: props) => (
  <Card className={styles[`card_${theme}`]}>
    <Card.Header as="h5">Genre</Card.Header>
    <Card.Body>
      <div style={{ marginBottom: '10px' }}>Filter Results by Genre</div>
      <Card.Text>
        <select className={`${styles[`select_${theme}`]} ${styles.select_genre}`}>
          <option>Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </Card.Text>
    </Card.Body>
  </Card>
);

export default CardSelectGenre;
