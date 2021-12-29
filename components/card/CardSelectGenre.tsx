/* eslint-disable no-unused-vars */
import { ChangeEvent } from 'react';
import { Card } from 'react-bootstrap';
import { IGenre } from 'types';
import styles from './CardSelectGenre.module.scss';

type props = {
  theme: 'dark' | 'light';
  options: IGenre[];
  selected: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const CardSelectGenre = ({
  theme,
  options,
  selected,
  onChange,
}: props) => (
  <Card className={styles[`card_${theme}`]}>
    <Card.Header as="h5">Genre</Card.Header>
    <Card.Body>
      <div style={{ marginBottom: '10px' }}>Filter Results by Genre</div>
      <Card.Text>
        <select
          className={`${styles[`select_${theme}`]} ${styles.select_genre}`}
          value={selected}
          onChange={(event) => onChange(event)}
        >
          <option value="">All Genre</option>
          {options.map((genre) => (
            <option key={genre.id} value={genre.name.toLowerCase()}>{genre.name}</option>
          ))}
        </select>
      </Card.Text>
    </Card.Body>
  </Card>
);

export default CardSelectGenre;
