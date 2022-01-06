/* eslint-disable @next/next/no-img-element */
import {
  Container,
  Navbar,
  Nav,
} from 'react-bootstrap';
import SwitcherTheme from 'components/switcher/Switcher';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCountFavorite } from 'context/FavoriteContext';
import styles from './Navbar.module.scss';

const NavigationBar = () => {
  const router = useRouter();
  const { pathname } = router;
  const pageRoutes = ['movie', 'tv', 'people'];
  const countFav = useCountFavorite();

  return (
    <Navbar fixed="top" expand="lg" bg="dark" variant="dark" className={styles.navbar}>
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand className={styles.nav_brand}>
            <img
              alt=""
              src="/images/play.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            <b>MovieMe</b>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {pageRoutes.map((route) => (
              <Link href={`/${route}`} passHref key={route}>
                <Nav.Link active={pathname === `/${route}`}>
                  <span style={{ textTransform: 'capitalize' }}>
                    {route} {route === 'tv' ? 'Show' : ''}
                  </span>
                </Nav.Link>
              </Link>
            ))}
          </Nav>
          <Nav>
            {pathname !== '/' && pathname !== '/search' && (
              <Link href="/search" passHref>
                <Nav.Link
                  style={{ marginRight: '0.5rem' }}
                  active={pathname === '/favorite'}
                >
                  <img
                    alt="search"
                    src="/images/search.png"
                    width="23"
                    height="23"
                    className="d-inline-block align-top"
                  />
                </Nav.Link>
              </Link>
            )}
            <Link href="/favorite" passHref>
              <Nav.Link
                style={{ marginRight: '2rem' }}
                active={pathname === '/favorite'}
              >
                <b className={styles.count_favorite}>
                  {countFav()} Favorites
                </b>
              </Nav.Link>
            </Link>
            <SwitcherTheme />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
