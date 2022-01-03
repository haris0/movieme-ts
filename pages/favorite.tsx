import CardMovie from 'components/card/CardMovie';
import { useFavorites } from 'context/FavoriteContext';
import { useTheme } from 'context/ThemeContext';
import { NextPage } from 'next';
import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import styles from 'styles/Favorite.module.scss';

const Favorite: NextPage = () => {
  const favorites = useFavorites();
  const theme = useTheme();

  return (
    <Container className="container-custom">
      <h3>Favorite</h3>
      <Row className={styles.row_custom}>
        {favorites.map((favorite) => (
          <Link href={favorite.href} passHref key={favorite.id}>
            <Col xs={6} sm="auto" xl={2} className={styles.center_content}>
              <CardMovie
                id={favorite.id}
                href={favorite.href}
                posterPath={favorite.posterPath}
                voteAverage={favorite.voteAverage}
                title={favorite.title}
                releaseDate={favorite.releaseDate}
                theme={theme}
              />
            </Col>
          </Link>
        ))}
      </Row>
    </Container>
  );
};

export default Favorite;
