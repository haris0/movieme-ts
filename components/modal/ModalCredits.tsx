/* eslint-disable react/destructuring-assignment */
import Image from 'next/image';
import {
  Col, Container, Modal, Row,
} from 'react-bootstrap';
import { baseProfileURL } from 'services';
import { ICast } from 'types';
import styles from './ModalCredits.module.scss';

const ModalCredits = (props: any) => (
  <Modal
    {...props}
    size="lg"
    scrollable
    aria-labelledby="credit-modal"
  >
    <Modal.Header closeButton>
      <Modal.Title id="credit-modal">
        All Cast & Crew
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Container>
        <Row>
          <Col sm={6} className={styles.margin_bottom}>
            <h5>Cast</h5>
            {props.cast.map((people: ICast) => (
              <div className={styles.people} key={people.id}>
                <div className={styles.image_custom}>
                  <Image
                    src={people.profile_path ? `${baseProfileURL}${people.profile_path}` : '/images/thumbnail_square.png'}
                    placeholder="blur"
                    blurDataURL={`${baseProfileURL}${people.profile_path}`}
                    alt={people.name}
                    layout="fixed"
                    width="70"
                    height="70"
                  />
                </div>
                <div className={styles.people_text}>
                  <b>{people.name}</b>
                  <br />
                  <span>{people.character}</span>
                </div>
              </div>
            ))}
          </Col>
          <Col sm={6}>
            <h5>Crew</h5>
            {props.crew.map((people: ICast) => (
              <div className={styles.people} key={people.id}>
                <div className={styles.image_custom}>
                  <Image
                    src={people.profile_path ? `${baseProfileURL}${people.profile_path}` : '/images/thumbnail_square.png'}
                    placeholder="blur"
                    blurDataURL={`${baseProfileURL}${people.profile_path}`}
                    alt={people.name}
                    layout="fixed"
                    width="70"
                    height="70"
                  />
                </div>
                <div className={styles.people_text}>
                  <b>{people.name}</b>
                  <br />
                  <span>{people.job}</span>
                </div>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </Modal.Body>
  </Modal>
);

export default ModalCredits;
