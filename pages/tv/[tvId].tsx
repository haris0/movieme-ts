/* eslint-disable no-unused-vars */
import Banner from 'components/benner/Banner';
import { useAddFavorite, useCheckFavorite, useRemoveFavorite } from 'context/FavoriteContext';
import { useTheme } from 'context/ThemeContext';
import { convertDate, convertMinsToHrsMins, getYear } from 'mixin';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState, MouseEvent } from 'react';
import {
  Badge, Col, Container, Row,
} from 'react-bootstrap';
import {
  baseBackURL, baseProfileDetailURL, getDetail, getDiscover,
} from 'services';
import { IFavorite, ISocialMedia, ITvDetail } from 'types';
import styles from 'styles/TvDetail.module.scss';
import CardPeople from 'components/card/CardPeople';
import CardMovie from 'components/card/CardMovie';
import ModalTrailer from 'components/modal/ModalTrailer';
import ModalCredits from 'components/modal/ModalCredits';
import IconLink from 'components/IconLink/IconLink';
import Head from 'next/head';

const TvDetail: NextPage<{
  detailRes: ITvDetail,
  detailErr: boolean,
}> = ({
  detailRes,
  detailErr,
}) => {
  const theme = useTheme();
  const tv = detailRes;
  const releaseDate = convertDate(tv?.first_air_date);
  const releaseYear = getYear(tv?.first_air_date);
  const duration = convertMinsToHrsMins(tv?.episode_run_time[0]);
  const topCast = tv?.cast?.slice(0, 9);
  const officialTrailer = tv?.videos?.find(
    (video) => video.name.includes('Official Trailer')
            || video.name.includes('Official Teaser')
            || (video.official && video.type === 'Trailer'),
  );
  const recommendations = tv?.recommendations || [];
  const writers = tv?.crew?.filter((crew) => crew.department === 'Writing' || crew.job === 'Director');

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const [playTrailer, setPlayTrailer] = useState(false);
  const [showAllCredits, setShowAllCredits] = useState(false);

  const handleFavorite = (
    event: MouseEvent<HTMLButtonElement>,
    favorite: IFavorite,
  ) => {
    event.preventDefault();
    addFavorite(favorite);
  };

  const handleUnFavorite = (
    event: MouseEvent<HTMLButtonElement>,
    tvId: number,
  ) => {
    event.preventDefault();
    removeFavorite(tvId);
  };

  const useCheckFav = (id: number) => {
    const checkFavorite = useCheckFavorite();
    return checkFavorite(id);
  };

  return (
    <div>
      <Head>
        <title>{tv?.name} - Movieme</title>
        <meta name="title" content={`${tv?.name} - Movieme`} />
        <meta name="description" content={tv?.overview} />
        <meta name="image" content={`${baseBackURL}${tv?.backdrop_path}`} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${tv?.name} - Movieme`} />
        <meta property="og:description" content={tv?.overview} />
        <meta property="og:image" content={`${baseBackURL}${tv?.backdrop_path}`} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={`${tv?.name} - Movieme`} />
        <meta property="twitter:description" content={tv?.overview} />
        <meta property="twitter:image" content={`${baseBackURL}${tv?.backdrop_path}`} />
      </Head>

      <ModalTrailer
        show={playTrailer}
        onHide={() => setPlayTrailer(false)}
        embedid={officialTrailer?.key}
      />
      <ModalCredits
        theme={theme}
        show={showAllCredits}
        onHide={() => setShowAllCredits(false)}
        cast={tv?.cast}
        crew={tv?.crew}
      />
      <Banner backdropPath={tv?.backdrop_path} />
      <Container className={`${'container-custom'} ${styles.tv_container}`}>
        <Row>
          <Col sm={6} md={4} lg={3} className={styles.col_center}>
            <div className={styles.image_wrapper}>
              <Image
                src={tv?.poster_path ? `${baseProfileDetailURL}${tv?.poster_path}` : '/images/thumbnail.png'}
                placeholder="blur"
                blurDataURL={`${baseProfileDetailURL}${tv?.poster_path}`}
                alt={tv?.name}
                layout="fill"
                objectFit="cover"
              />
            </div>

            <IconLink
              name={tv?.name}
              socialMedia={tv?.sosial_media as ISocialMedia}
              homepage={tv?.homepage}
            />
          </Col>
          <Col md={8} lg={9}>
            <h2>{tv?.name} ({releaseYear})</h2>
            <div>
              <span>
                {releaseDate} ({
                  tv?.production_companies[tv.production_companies.length - 1]?.origin_country
                })
              </span>
              <span className={styles.subtitle_separator}>•</span>
              {tv?.genres?.map((genre, idx) => (
                <span key={genre.id}>
                  {genre.name}
                  {tv?.genres.length !== (idx + 1) && (
                    <span>,{' '}</span>
                  )}
                </span>
              ))}
              <span className={styles.subtitle_separator}>•</span>
              <span>{duration}</span>
            </div>
            <div className={styles.tv_writer}>
              <Row>
                {writers?.map((writer) => (
                  <Col
                    key={writer.id}
                    xs={6}
                    sm={6}
                    md={4}
                    lg={3}
                    className={styles.writer_col}
                  >
                    <Link href={`/people/${writer.id}`} passHref>
                      <a href={`/people/${writer.id}`} className={styles.writer_anchor}>
                        <div>
                          <b>{writer.name}</b>
                        </div>
                        <div>{writer.job}</div>
                      </a>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>

            <div className={styles.tv_actions}>
              <div className={styles.icon_vote}>
                <span>
                  {(tv?.vote_average || 0) * 10}
                </span>
                <span style={{ fontSize: '6px' }}>
                  %
                </span>
              </div>
              <div className={styles.icon_bookmark}>
                {useCheckFav(tv?.id) && (
                  <button
                    type="button"
                    className={styles.button_icon}
                    onClick={(event) => handleUnFavorite(event, tv?.id)}
                  >
                    <Image
                      src="/images/favorited.png"
                      alt="favorite"
                      layout="fixed"
                      width="16"
                      height="16"
                    />
                  </button>
                )}
                {!useCheckFav(tv?.id) && (
                  <button
                    type="button"
                    className={styles.button_icon}
                    onClick={(event) => handleFavorite(event, {
                      id: tv?.id,
                      href: `/tv/${tv?.id}`,
                      posterPath: tv?.poster_path,
                      voteAverage: tv?.vote_average,
                      title: tv.name,
                      releaseDate: tv?.first_air_date,
                    })}
                  >
                    <Image
                      src="/images/unfavorite_white.png"
                      alt="favorite"
                      layout="fixed"
                      width="16"
                      height="16"
                    />
                  </button>
                )}
              </div>
              {!!tv?.videos?.length && (
                <div className={styles.icon_play}>
                  <button
                    type="button"
                    className={styles.button_icon}
                    onClick={() => setPlayTrailer(true)}
                  >
                    <Image
                      src="/images/play.png"
                      alt="favorite"
                      layout="fixed"
                      width="19"
                      height="19"
                    />
                    <span className={styles.trailer_text}>
                      <b>Play Trailer</b>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={4} lg={3}>
            <div className={styles.personal_info}>
              <h5>Tv Show Info</h5>
              <div className={styles.sub_info}>
                <h6>Status</h6>
                <div>{tv?.status}</div>
              </div>
              <div className={styles.sub_info}>
                <h6>Original Language</h6>
                <div>{tv?.spoken_languages[0].name}</div>
              </div>
              <div className={styles.sub_info}>
                <h6>Type</h6>
                <div>{tv?.type}</div>
              </div>
              <div className={styles.sub_info}>
                <h6>Networks</h6>
                <div>{tv?.networks[0].name}</div>
              </div>
              <div className={styles.sub_info}>
                <h6>Season</h6>
                <div>{tv?.number_of_seasons} Seasons</div>
              </div>
              <div className={styles.sub_info}>
                <h6>Keyword</h6>
                <div>
                  {tv?.keywords?.map((keyword) => (
                    <Badge
                      bg="secondary"
                      className={styles.badge_keywords}
                      key={keyword.id}
                    >
                      {keyword.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Col>
          <Col sm={6} md={8} lg={9}>
            <div>
              <h5>Overview</h5>
              <div className={styles.tagline}>{tv?.tagline}</div>
              <p>{tv?.overview}</p>
              <div>
                {!!topCast?.length && (
                  <>
                    <h5 className={styles.recom_title}>Top Billed Cast</h5>
                    <div className={styles.scroll_container}>
                      {topCast?.map((people) => (
                        <Link href={`/people/${people.id}`} passHref key={people.id}>
                          <div className={styles.skin_option}>
                            <CardPeople
                              href={`/people/${people.id}`}
                              name={people.name}
                              profilePath={people.profile_path as string}
                              peopleKnowFor={[people.character as string]}
                              theme={theme}
                            />
                          </div>
                        </Link>
                      ))}
                      <div className={styles.showmore_container}>
                        <div className={styles.showmore_text}>
                          <button
                            type="button"
                            className={styles.showmore_button}
                            onClick={() => setShowAllCredits(true)}
                          >
                            <b>All Cast & Crew →</b>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <h5 className={styles.recom_title}>Recommendations</h5>
        {!!recommendations?.length && (
          <div className={styles.scroll_container}>
            {recommendations?.map((recom) => (
              <Link href={`/tv/${recom.id}`} passHref key={recom.id}>
                <div className={styles.skin_option}>
                  <CardMovie
                    id={recom.id}
                    href={`/tv/${recom.id}`}
                    posterPath={recom?.poster_path as string}
                    voteAverage={recom?.vote_average}
                    title={recom.name}
                    releaseDate={recom?.first_air_date as Date}
                    theme={theme}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { discoverRes, discoverErr } = await getDiscover('tv');
  let paths = [{
    params: { tvId: '88329' },
  }];

  if (!discoverErr) {
    paths = discoverRes.results?.map((discover) => ({
      params: { tvId: discover.id.toString() },
    }));
  }

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const tvId = params?.tvId as string || 0;

  const { detailRes, detailErr } = await getDetail('tv', +tvId);

  return {
    props: {
      detailRes,
      detailErr,
    },
    revalidate: 10,
  };
};

export default TvDetail;
