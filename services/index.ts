import {
  IGenreListRes,
  IMovieListRes,
  ITvListRes,
  IPeopleListRes,
  IMovieDetail,
  ITvDetail,
  IPeopleDetail,
} from 'types';
import { axiosGet } from './axios-client';

export {
  baseImageURL,
  baseImageURLOrigin,
  baseProfileURL,
  baseProfileDetailURL,
} from './axios-client';

export const getNowPlaying = async (
  media: 'tv' | 'movie',
  page: number = 1,
): Promise<{
  nowPlayingRes: IMovieListRes,
  nowPlayingErr: boolean
}> => {
  const path = media === 'movie' ? '/movie/now_playing' : '/tv/on_the_air';

  const { data, error } = await axiosGet(path, {
    params: {
      language: 'en-US',
      page,
    },
  });

  const nowPlayingRes = data?.data;
  const nowPlayingErr = !!error;

  return { nowPlayingRes, nowPlayingErr };
};

export const getTrending = async (
  media: 'tv' | 'movie',
  type : 'day' | 'week',
  page : number = 1,
): Promise<{
  trendingRes: IMovieListRes | ITvListRes,
  trendingErr: boolean
}> => {
  const { data, error } = await axiosGet(`/trending/${media}/${type}`, {
    params: {
      page,
    },
  });

  const trendingRes = data?.data;
  const trendingErr = !!error;

  return { trendingRes, trendingErr };
};

export const getPopulerPeople = async (
  page : number = 1,
): Promise<{
  peopleRes: IPeopleListRes,
  peopleErr: boolean
}> => {
  const { data, error } = await axiosGet('/person/popular', {
    params: {
      language: 'en-US',
      page,
    },
  });

  const peopleRes = data?.data;
  const peopleErr = !!error;

  return { peopleRes, peopleErr };
};

export const getGenreList = async (media: 'movie' | 'tv'): Promise<{
  genreRes: IGenreListRes,
  genreErr: boolean
}> => {
  const { data, error } = await axiosGet(`/genre/${media}/list`);

  const genreRes = data?.data;
  const genreErr = !!error;

  return { genreRes, genreErr };
};

export const getSearchByKeyword = async (word: string, page: number = 1): Promise<{
  searchRes: {
    movieResultsRes: IMovieListRes,
    tvResultsRes: ITvListRes,
    peopleResultsRes: IPeopleListRes,
  },
  searchErr: boolean[]
}> => {
  const params = {
    params: {
      language: 'en-US',
      include_adult: false,
      page,
      query: word,
    },
  };

  const medias = ['movie', 'tv', 'person'];
  const [movieResult, tvResult, peopleResult] = await Promise.all(
    medias.map((media) => axiosGet(`/search/${media}`, params)),
  );

  const searchRes = {
    movieResultsRes: movieResult.data?.data,
    tvResultsRes: tvResult.data?.data,
    peopleResultsRes: peopleResult.data?.data,
  };
  const searchErr = [!!movieResult.error, !!tvResult.error, !!peopleResult.error];

  return { searchRes, searchErr };
};

export const getDiscover = async (
  media: 'movie' | 'tv',
  genre: number = 0,
  page: number = 1,
): Promise<{
  discoverRes: IMovieListRes | ITvListRes
  discoverErr: boolean
}> => {
  const params = {
    params: {
      language: 'en-US',
      sort_by: 'popularity.desc',
      include_adult: false,
      with_genres: genre || '',
      page,
    },
  };

  const { data, error } = await axiosGet(`/discover/${media}`, params);

  const discoverRes = data?.data;
  const discoverErr = !!error;

  return { discoverRes, discoverErr };
};

export const getDetail = async (media: 'movie' | 'tv', id: number): Promise<{
  detailRes: IMovieDetail | ITvDetail,
  detailErr: boolean
}> => {
  const [
    itemDetail,
    itemKeyWords,
    itemSosmed,
    itemCredit,
    itemVideos,
    itemRecomm,
  ] = await Promise.all([
    axiosGet(`/${media}/${id}`),
    axiosGet(`/${media}/${id}/keywords`),
    axiosGet(`/${media}/${id}/external_ids`),
    axiosGet(`/${media}/${id}/credits`),
    axiosGet(`/${media}/${id}/videos`),
    axiosGet(`/${media}/${id}/recommendations`),
  ]);

  const { data, error } = itemDetail;
  const { data: keywordRes } = itemKeyWords;
  const { data: sosmedRes } = itemSosmed;
  const { data: creditRes } = itemCredit;
  const { data: videosRes } = itemVideos;
  const { data: recommRes } = itemRecomm;

  const detailRes = data?.data;
  detailRes.keywords = keywordRes?.data.keywords || keywordRes?.data.results || [];
  detailRes.sosial_media = sosmedRes?.data || undefined;
  detailRes.cast = creditRes?.data.cast || [];
  detailRes.crew = creditRes?.data.crew || [];
  detailRes.videos = videosRes?.data.results || [];
  detailRes.recommendations = recommRes?.data.results || [];
  const detailErr = !!error;

  return { detailRes, detailErr };
};

export const getDetailPeople = async (id: number): Promise<{
  detailRes: IPeopleDetail,
  detailErr: boolean
}> => {
  const [
    peopleDetail,
    peopleSosmed,
    peopleCredit,
  ] = await Promise.all([
    axiosGet(`/person/${id}`),
    axiosGet(`/person/${id}/external_ids`),
    axiosGet(`/person/${id}/combined_credits`),
  ]);

  const { data, error } = peopleDetail;
  const { data: sosmedRes } = peopleSosmed;
  const { data: creditRes } = peopleCredit;

  const detailRes = data?.data;
  detailRes.sosial_media = sosmedRes?.data || undefined;
  detailRes.cast = Array.from(new Map(
    creditRes?.data.cast.map((val: any) => [val.id, val]),
  ).values()) || [];
  detailRes.crew = Array.from(new Map(
    creditRes?.data.crew.map((val: any) => [val.id, val]),
  ).values()) || [];
  const detailErr = !!error;

  return { detailRes, detailErr };
};
