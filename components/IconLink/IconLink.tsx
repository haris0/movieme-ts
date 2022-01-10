import Image from 'next/image';
import { ISocialMedia } from 'types';
import styles from './IconLink.module.scss';

type props = {
  name: string,
  socialMedia: ISocialMedia,
  homepage: string | undefined,
}

const IconLink = ({ socialMedia, homepage, name }: props) => (
  <div className={styles.sosmed_wrapper}>
    {socialMedia?.facebook_id && (
      <div className={styles.sosmed_logo}>
        <a target="_blank" href={`https://www.facebook.com/${socialMedia.facebook_id}`} rel="noreferrer">
          <Image
            src="/images/facebook.png"
            alt={name}
            width="35"
            height="35"
            layout="fixed"
          />
        </a>
      </div>
    )}
    {socialMedia?.twitter_id && (
      <div className={styles.sosmed_logo}>
        <a target="_blank" href={`https://twitter.com/${socialMedia.twitter_id}`} rel="noreferrer">
          <Image
            src="/images/twitter.png"
            alt={name}
            width="35"
            height="35"
            layout="fixed"
          />
        </a>
      </div>
    )}
    {socialMedia?.instagram_id && (
      <div className={styles.sosmed_logo}>
        <a target="_blank" href={`https://www.instagram.com/${socialMedia.instagram_id}`} rel="noreferrer">
          <Image
            src="/images/instagram.png"
            alt={name}
            width="35"
            height="35"
            layout="fixed"
          />
        </a>
      </div>
    )}
    {homepage && (
      <div className={styles.sosmed_logo}>
        <a target="_blank" href={homepage} rel="noreferrer">
          <Image
            src="/images/link.png"
            alt={name}
            width="38"
            height="38"
            layout="fixed"
          />
        </a>
      </div>
    )}
  </div>
);

export default IconLink;
