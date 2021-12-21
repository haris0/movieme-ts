/* eslint-disable @next/next/no-img-element */
import { useSwitchTheme } from 'context/ThemeContext';
import {
  Container, Navbar, Nav, Button,
} from 'react-bootstrap';
import styles from './Navbar.module.scss';

const NavigationBar = () => {
  const switchTheme = useSwitchTheme();

  return (
    <Navbar fixed="top" expand="lg" className={styles.navbar}>
      <Container>
        <Navbar.Brand href="/" className={styles.navBrand}>
          <img
            alt=""
            src="/play.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          <b>React Bootstrap</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#movie">Movie</Nav.Link>
            <Nav.Link href="#show">Tv Show</Nav.Link>
            <Nav.Link href="#people">People</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Button
              type="button"
              onClick={() => switchTheme()}
            >
              Change Theme
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
