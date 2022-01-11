import CardMovie from 'components/card/CardMovie';
import CardSelect from 'components/card/CardSelect';
import { useFavoritesMovie, useFavoritesTv } from 'context/FavoriteContext';
import { useTheme } from 'context/ThemeContext';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from 'styles/Favorite.module.scss';

const Favorite: NextPage = () => {
  const router = useRouter();
  const { media } = router.query;
  const theme = useTheme();
  const favoritesMovie = useFavoritesMovie();
  const favoritesTv = useFavoritesTv();

  const [selectedMedia, setSelectedMedia] = useState('');

  const handleMediaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const mediaName = event.target.value;
    setSelectedMedia(mediaName);
    router.push({
      pathname: '/favorite',
      query: mediaName ? { media: mediaName } : {},
    }, undefined, { shallow: true });
  };

  useEffect(() => {
    setSelectedMedia(media as string || '');
  }, [media]);

  return (
    <>
      <Head>
        <title>Favorite - Movieme</title>
        <meta name="title" content="Favorite - Movieme" />
        <meta name="description" content="Save your favorite Movie or Tv show here" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Favorite - Movieme" />
        <meta property="og:description" content="Save your favorite Movie or Tv show here" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Favorite - Movieme" />
        <meta property="twitter:description" content="Save your favorite Movie or Tv show here" />
      </Head>
      <Container className="container-custom">
        <h3>Favorite</h3>
        <Row className={styles.margin_top}>
          <Col lg={3} className={styles.col_left_margin}>
            <CardSelect
              theme={theme}
              title="Media"
              options={['Movie', 'Tv']}
              selected={selectedMedia}
              onChange={handleMediaChange}
            />
          </Col>
          <Col lg={9}>
            <Row>
              {(selectedMedia === 'movie' || selectedMedia === '') && (
                <>
                  {!!favoritesMovie.length && (
                    <>
                      <div>
                        <h4 className={styles.section_title}>Movie</h4>
                      </div>
                      {favoritesMovie.map((favorite) => (
                        <Link href={favorite.href} passHref key={favorite.id}>
                          <Col xs={6} sm="auto" className={styles.center_content}>
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
                    </>
                  )}
                  {!favoritesMovie.length && selectedMedia !== '' && (
                    <div>No Favorite Movie</div>
                  )}
                </>
              )}
              {(selectedMedia === 'tv' || selectedMedia === '') && (
                <>
                  {!!favoritesTv.length && (
                    <>
                      <div className={selectedMedia === 'tv' ? '' : styles.margin_top}>
                        <h4 className={styles.section_title}>Tv</h4>
                      </div>
                      {favoritesTv.map((favorite) => (
                        <Link href={favorite.href} passHref key={favorite.id}>
                          <Col xs={6} sm="auto" className={styles.center_content}>
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
                    </>
                  )}
                  {!favoritesTv.length && selectedMedia !== '' && (
                    <div>No Favorite Tv</div>
                  )}
                </>
              )}
              {!favoritesMovie?.length
              && !favoritesTv?.length
              && selectedMedia === '' && (
                <div>No Favorites</div>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Favorite;
