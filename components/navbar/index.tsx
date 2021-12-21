/* eslint-disable @next/next/no-img-element */
import {
  Container,
  Navbar,
  Nav,
} from 'react-bootstrap';
import SwitcherTheme from 'components/switcher';
import styles from './Navbar.module.scss';

const NavigationBar = () => (
  <Navbar fixed="top" expand="lg" bg="dark" variant="dark" className={styles.navbar}>
    <Container>
      <Navbar.Brand href="/" className={styles.navBrand}>
        <img
          alt=""
          src="/play.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '}
        <b>MovieMe</b>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link className="active" href="#movie">Movie</Nav.Link>
          <Nav.Link href="#show">Tv Show</Nav.Link>
          <Nav.Link href="#people">People</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link style={{ marginRight: '2rem' }} href="#deets">My Movie</Nav.Link>
          <SwitcherTheme />
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default NavigationBar;
