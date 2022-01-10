/* eslint-disable react/destructuring-assignment */
import YoutubeEmbed from 'components/youtube/YoutubeEmbed';
import { Modal } from 'react-bootstrap';
import styles from './ModalTrailer.module.scss';

const ModalTrailer = (props: any) => (
  <Modal
    {...props}
    aria-labelledby="Play Trailer"
    dialogClassName={styles.modal_player}
    contentClassName={styles.modal_content}
    centered
  >
    <Modal.Body className={styles.modal_body}>
      <YoutubeEmbed embedid={props.embedid} />
    </Modal.Body>
  </Modal>
);

export default ModalTrailer;
