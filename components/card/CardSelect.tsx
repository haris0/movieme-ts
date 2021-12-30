/* eslint-disable no-unused-vars */
import { ChangeEvent } from 'react';
import { Card } from 'react-bootstrap';
import { IGenre } from 'types';
import styles from './CardSelect.module.scss';

type props = {
  theme: 'dark' | 'light';
  title: string;
  options: string[];
  selected: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const CardSelect = ({
  theme,
  title,
  options,
  selected,
  onChange,
}: props) => (
  <Card className={styles[`card_${theme}`]}>
    <Card.Header as="h5">{title}</Card.Header>
    <Card.Body>
      <div style={{ marginBottom: '10px' }}>Filter Results by {title}</div>
      <Card.Text>
        <select
          className={`${styles[`select_${theme}`]} ${styles.select_genre}`}
          value={selected}
          onChange={(event) => onChange(event)}
        >
          <option value="">All {title}</option>
          {options.map((option) => (
            <option key={option} value={option.toLowerCase()}>{option}</option>
          ))}
        </select>
      </Card.Text>
    </Card.Body>
  </Card>
);

export default CardSelect;
