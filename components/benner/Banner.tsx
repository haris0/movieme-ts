import { Container } from 'react-bootstrap';
import { baseImageURL } from 'services';
import styles from './Banner.module.scss';

type props = {
  backdropPath: string;
}

const Banner = ({ backdropPath }: props) => (
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
    <div className={styles.search_container}>
      <Container className={styles.container_body}>
        Banner Search
      </Container>
    </div>
  </div>
);

export default Banner;
