/* eslint-disable no-unused-vars */
import {
  ChangeEvent,
} from 'react';
import styles from './Search.module.scss';

type props = {
  theme: 'dark' | 'light';
  keyword: string;
  onSearch: () => void;
  onKeyWordChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({
  theme,
  keyword,
  onSearch,
  onKeyWordChange,
}: props) => (
  <section className={styles.flexbox}>
    <div className={styles.stretch}>
      <input
        type="text"
        className={`${styles.search_input} ${styles[`search_${theme}`]}`}
        placeholder="Search for a movie, tv show, person..."
        value={keyword}
        onChange={onKeyWordChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onSearch();
          }
        }}
      />
    </div>
    <div className={styles.normal}>
      <button
        type="button"
        className={styles.search_button}
        onClick={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        Search
      </button>
    </div>
  </section>
);

export default SearchBar;
