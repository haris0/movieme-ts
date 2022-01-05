/* eslint-disable no-unused-vars */
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Col, Container, Row } from 'react-bootstrap';
import { baseProfileDetailURL, getDetailPeople, getPopulerPeople } from 'services';
import { IPeopleDetail } from 'types';
import Image from 'next/image';
import styles from 'styles/PeopleDetail.module.scss';
import { useEffect, useState } from 'react';

const PeopleDetail: NextPage<{
  detailRes: IPeopleDetail,
  detailErr: boolean
}> = ({
  detailRes,
  detailErr,
}) => {
  const people = detailRes;
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
              src={people.profile_path ? `${baseProfileDetailURL}${people.profile_path}` : '/thumbnail.png'}
              placeholder="blur"
              blurDataURL={`${baseProfileDetailURL}${people.profile_path}`}
              alt={people.name}
              layout="fill"
              objectFit="cover"
            />
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
