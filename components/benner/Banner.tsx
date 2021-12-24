import { ReactNode } from 'react';
import { Container } from 'react-bootstrap';
import { baseImageURL } from 'services';
import styles from './Banner.module.scss';

type props = {
  backdropPath: string;
  children: ReactNode;
}

const Banner = ({ backdropPath, children }: props) => (
  <div
    className={styles.banner}
    style={{
      backgroundImage: `
        linear-gradient( rgba(0, 0, 0, 0.6), 
        rgba(0, 0, 0, 0.6) ), 
        url(${baseImageURL + backdropPath})
      `,
      transition: 'background-image 2s linear',
    }}
  >
    <Container className={styles.banner_container}>
      <div className={styles.container_body}>
        { children }
      </div>
    </Container>
  </div>
);

export default Banner;
