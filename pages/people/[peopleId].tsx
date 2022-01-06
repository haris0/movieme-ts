/* eslint-disable no-unused-vars */
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Col, Container, Row } from 'react-bootstrap';
import { baseProfileDetailURL, getDetailPeople, getPopulerPeople } from 'services';
import { IPeopleDetail } from 'types';
import Image from 'next/image';
import styles from 'styles/PeopleDetail.module.scss';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CardMovie from 'components/card/CardMovie';
import { useTheme } from 'context/ThemeContext';

const PeopleDetail: NextPage<{
  detailRes: IPeopleDetail,
  detailErr: boolean
}> = ({
  detailRes,
  detailErr,
}) => {
  const theme = useTheme();
  const people = detailRes;
  const knownFor = (people?.cast?.length as number) > (people?.crew?.length as number)
    ? people.cast : people.crew;
  const [clamped, setClamped] = useState<'clamped' | 'unclamp'>('clamped');
  const [bioLine, setBioLine] = useState(0);

  const handleShowBio = () => {
    setClamped(clamped === 'clamped' ? 'unclamp' : 'clamped');
  };

  useEffect(() => {
    const getbioLine = () => {
      if (typeof window === 'undefined') return 0;

      const el = document.getElementById('biography');
      const divHeight = el?.offsetHeight || 0;
      const lineHeight = 24;
      const lines = +divHeight / +lineHeight;

      return lines;
    };

    setBioLine(getbioLine());
  }, [detailRes]);

  return (
    <Container className="container-custom">
      <Row>
        <Col sm={6} md={4} lg={3} className={styles.col_center}>
          <div className={styles.image_wrapper}>
            <Image
              src={people.profile_path ? `${baseProfileDetailURL}${people.profile_path}` : '/images/thumbnail.png'}
              placeholder="blur"
              blurDataURL={`${baseProfileDetailURL}${people.profile_path}`}
              alt={people.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className={styles.sosmed_wrapper}>
            {people.sosial_media?.facebook_id && (
              <div className={styles.sosmed_logo}>
                <a target="_blank" href={`https://www.facebook.com/${people.sosial_media.facebook_id}`} rel="noreferrer">
                  <Image
                    src="/images/facebook.png"
                    alt={people.name}
                    width="35"
                    height="35"
                    layout="fixed"
                  />
                </a>
              </div>
            )}
            {people.sosial_media?.twitter_id && (
              <div className={styles.sosmed_logo}>
                <a target="_blank" href={`https://twitter.com/${people.sosial_media.twitter_id}`} rel="noreferrer">
                  <Image
                    src="/images/twitter.png"
                    alt={people.name}
                    width="35"
                    height="35"
                    layout="fixed"
                  />
                </a>
              </div>
            )}
            {people.sosial_media?.instagram_id && (
              <div className={styles.sosmed_logo}>
                <a target="_blank" href={`https://www.instagram.com/${people.sosial_media.instagram_id}`} rel="noreferrer">
                  <Image
                    src="/images/instagram.png"
                    alt={people.name}
                    width="35"
                    height="35"
                    layout="fixed"
                  />
                </a>
              </div>
            )}
            {people.homepage && (
              <div className={styles.sosmed_logo}>
                <a target="_blank" href={people.homepage} rel="noreferrer">
                  <Image
                    src="/images/link.png"
                    alt={people.name}
                    width="38"
                    height="38"
                    layout="fixed"
                  />
                </a>
              </div>
            )}
          </div>
        </Col>
        <Col sm={6} md={8} lg={9}>
          <div>
            <h2>{people.name}</h2>
            <br />
            <h5>Biography</h5>
            <div className={`${styles.bio_wrapper} ${styles[clamped]}`}>
              <p
                id="biography"
                className={styles.bio_paragraph}
              >
                {people.biography}
              </p>
            </div>
            <div>
              {bioLine > 3 && (
                <div>
                  {clamped === 'clamped' && (
                    <button type="button" className={styles.show} onClick={handleShowBio}>
                      Show More
                    </button>
                  )}
                  {!(clamped === 'clamped') && (
                    <button type="button" className={styles.show} onClick={handleShowBio}>
                      Show Less
                    </button>
                  )}
                </div>
              )}
            </div>
            <div>
              <h5 className={styles.sub_title}>Known For:</h5>
              {!!knownFor?.length && (
                <div className={styles.scroll_container}>
                  {knownFor.map((cast) => (
                    <Link href={`/${cast.media_type}/${cast.id}`} passHref key={cast.id}>
                      <div className={styles.skin_option}>
                        <CardMovie
                          id={cast.id}
                          href={`/${cast.media_type}/${cast.id}`}
                          posterPath={cast.poster_path as string}
                          voteAverage={cast.vote_average}
                          title={cast.title || cast.name}
                          releaseDate={(cast.release_date || cast.first_air_date) as Date}
                          theme={theme}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { peopleRes, peopleErr } = await getPopulerPeople();
  let paths = [{
    params: { peopleId: '1136406' },
  }];

  if (!peopleErr) {
    paths = peopleRes.results.map((people) => ({
      params: { peopleId: people.id.toString() },
    }));
  }

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const peopleId = params?.peopleId as string || 0;

  const { detailRes, detailErr } = await getDetailPeople(+peopleId);

  return {
    props: {
      detailRes,
      detailErr,
    },
  };
};

export default PeopleDetail;
