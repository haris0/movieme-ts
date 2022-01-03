import { Spinner } from 'react-bootstrap';
import styles from './ButtonLoadMore.module.scss';

type props = {
  loadingMore: boolean,
  handleLoadMore: () => void,
}

const ButtonLoadMore = ({ loadingMore, handleLoadMore }: props) => (
  <div style={{ textAlign: 'center' }}>
    <button
      type="button"
      className={styles.load_button}
      disabled={loadingMore}
      onClick={(event) => {
        event.preventDefault();
        handleLoadMore();
      }}
    >
      {loadingMore && (
        <Spinner animation="border" role="status" className={styles.spinner}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {!loadingMore && (
        <span>Load More</span>
      )}
    </button>
  </div>
);

export default ButtonLoadMore;
