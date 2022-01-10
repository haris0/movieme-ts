/* eslint-disable no-unused-vars */
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  Card, Col, Container, ListGroup, ListGroupItem, Row,
} from 'react-bootstrap';
import { baseProfileDetailURL, getDetailPeople, getPopulerPeople } from 'services';
import { ICast, IPeopleDetail, ISocialMedia } from 'types';
import Image from 'next/image';
import styles from 'styles/PeopleDetail.module.scss';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CardMovie from 'components/card/CardMovie';
import { useTheme } from 'context/ThemeContext';
import { convertDate } from 'mixin';
import IconLink from 'components/IconLink/IconLink';
import Head from 'next/head';

const PeopleDetail: NextPage<{
  detailRes: IPeopleDetail,
  detailErr: boolean
}> = ({
  detailRes,
  detailErr,
}) => {
  const theme = useTheme();
  const people = detailRes;
  const peopleAsCast = people?.cast?.sort((a, b) => b.vote_count - a.vote_count);
  const peopleAsCrew = people?.crew?.sort((a, b) => b.vote_count - a.vote_count);
  const knownFor = (peopleAsCast?.length as number) > (peopleAsCrew?.length as number)
    ? peopleAsCast?.slice(0, 9) : peopleAsCrew?.slice(0, 9);
  const creditCount = (peopleAsCast?.length as number) + (peopleAsCrew?.length as number);
  let creditsByJob: ICast[] | undefined = [];
  let creditsByYear: {group: string, credits: ICast[]}[] = [];

  const [clamped, setClamped] = useState<'clamped' | 'unclamp'>('clamped');
  const [bioLine, setBioLine] = useState(0);

  const handleShowBio = () => {
    setClamped(clamped === 'clamped' ? 'unclamp' : 'clamped');
  };

  const filterCreditsByJob = (
    job: string,
    cast: ICast[] | undefined,
    crew: ICast[] | undefined,
  ) => {
    if (job === 'Acting') {
      return cast;
    }

    return crew?.filter((cr) => cr.department === job);
  };
  const sortAndGroupCreditsByYear = (credits: ICast[] | undefined) => {
    const sorted = credits?.sort((a, b) => {
      const dateA = new Date((
        a.release_date
        || a.first_air_date
        || new Date().setFullYear(new Date().getFullYear() + 10)
      ) as Date)?.getTime();
      const dateB = new Date((b.release_date || b.first_air_date || new Date()) as Date)?.getTime();
      return dateA > dateB ? -1 : 1;
    });

    const grouped = sorted?.reduce((obj: any, item) => {
      const year = new Date((item.release_date || item.first_air_date) as Date).getFullYear() || '';
      item.release_year = year;
      obj[year] = obj[year] || [];
      obj[year].push(item);
      return obj;
    }, {});

    const groupsArr = Object.keys(grouped).map(
      (key) => ({ group: key, credits: grouped[key] }),
    );

    const sortedGroupsArr: any = groupsArr?.sort((a, b) => +b.group - +a.group);
    if (sortedGroupsArr[sortedGroupsArr.length - 1]?.group === '') sortedGroupsArr.unshift(sortedGroupsArr.pop());

    return sortedGroupsArr;
  };
  creditsByJob = filterCreditsByJob(people.known_for_department, people.cast, people.crew);
  creditsByYear = sortAndGroupCreditsByYear(creditsByJob);

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
    <>
      <Head>
        <title>{people?.name} - Movieme</title>
        <meta name="description" content={people?.biography} />
        <meta property="og:title" content={people?.name} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`${baseProfileDetailURL}${people?.profile_path}`} />
      </Head>
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
            <IconLink
              name={people.name}
              socialMedia={people.sosial_media as ISocialMedia}
              homepage={undefined}
            />
            <h2>{people.name}</h2>
            <br />
            <div className={styles.personal_info}>
              <h5>Personal Info</h5>
              <div className={styles.sub_info}>
                <h6>Know For</h6>
                <div>{people.known_for_department}</div>
              </div>
              <div className={styles.sub_info}>
                <h6>Known Credits</h6>
                <div>{creditCount}</div>
              </div>
              <div className={styles.sub_info}>
                <h6>Gender</h6>
                <div>
                  {!people.gender && 'Unknown'}
                  {people.gender === 1 && 'Female'}
                  {people.gender === 2 && 'Male'}
                </div>
              </div>
              <div className={styles.sub_info}>
                <h6>Birthday</h6>
                <div>
                  {people.birthday ? convertDate(people.birthday) : '-'}
                </div>
              </div>
              <div className={styles.sub_info}>
                <h6>Place of Birth</h6>
                <div>
                  {people.place_of_birth || '-'}
                </div>
              </div>
              <div className={styles.sub_info}>
                <h6>Also Known As</h6>
                <div className={styles.bio_paragraph}>
                  {!people.also_known_as.length && '-'}
                  {!!people.also_known_as.length && (
                    <div>
                      {people.also_known_as.map((known) => (
                        <div key={known}>{known}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
          <Col sm={6} md={8} lg={9}>
            <div>
              <h5>Biography</h5>
              <div className={`${styles.bio_wrapper} ${styles[clamped]}`}>
                <p
                  id="biography"
                  className={styles.bio_paragraph}
                >
                  {!!people.biography && (
                    people.biography
                  )}
                  {!people.biography && (
                    `We don't have a biography for ${people.name}`
                  )}
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
                <h5 className={styles.sub_title}>{people.known_for_department}</h5>
                <Card className={`${styles[`card_${theme}`]}`}>
                  <ListGroup className="list-group-flush">
                    {creditsByYear.map((credits) => (
                      <ListGroupItem
                        key={credits?.group}
                        className={`${styles[`card_${theme}`]} ${styles.credits_group}`}
                      >
                        {credits.credits.map((credit) => (
                          <div key={credit.id} className={styles.credits_item}>
                            <div>
                              <span className={styles.credit_year}>
                                {credit.release_year || '—'}
                              </span>
                            </div>
                            <div>
                              <span className={styles.credit_separator}> ■ </span>
                            </div>
                            <Link href={`/${credit.media_type}/${credit.id}`}>
                              <a
                                href={`/${credit.media_type}/${credit.id}`}
                                className={styles.credit_anchor}
                              >
                                <div className={styles.credit_title}>
                                  <span>
                                    <b>{credit.title || credit.name}</b>
                                  </span>
                                  {(credit.character || credit.job) && (
                                    <span>
                                      <span className={styles.credit_as}>as</span>
                                      {credit.character || credit.job}
                                    </span>
                                  )}
                                </div>
                              </a>
                            </Link>
                          </div>
                        ))}
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
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

  return { paths, fallback: 'blocking' };
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
