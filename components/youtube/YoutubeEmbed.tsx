import styles from './YoutubeEmbed.module.scss';

type props = {
  embedid: number
};

const YoutubeEmbed = ({ embedid }: props) => (
  <div className={styles.video_responsive}>
    <iframe
      width="853"
      height="480"
      src={`https://www.youtube.com/embed/${embedid}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

export default YoutubeEmbed;
