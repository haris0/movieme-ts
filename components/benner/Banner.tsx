import { Container } from 'react-bootstrap';
import { baseImageURL } from 'services';
import styles from './Banner.module.scss';

type props = {
  backdropPath: string;
  theme: 'dark' | 'light';
}

const Banner = ({ backdropPath, theme }: props) => (
  <div
    className={styles.banner}
    style={{
      backgroundImage: `
        linear-gradient( rgba(0, 0, 0, 0.6), 
        rgba(0, 0, 0, 0.6) ), 
        url(${baseImageURL + backdropPath})
      `,
      transition: 'all 0.7s linear',
      // transition: 'all linear 2.5s',
      // transition: 'background-image 5s linear',
      // animation: 'fade 3s infinite',
    }}
  >
    <Container className={styles.search_container}>
      <div className={styles.container_body}>
        <section className={styles.flexbox}>
          <div className={styles.stretch}>
            <input
              type="text"
              className={`${styles.search_input} ${styles[`search_${theme}`]}`}
              placeholder="Search for a movie, tv show, person..."
            />
          </div>
          <div className={styles.normal}>
            <button type="button" className={styles.search_button}>
              Search
            </button>
          </div>
        </section>
      </div>
    </Container>
  </div>
);

export default Banner;
