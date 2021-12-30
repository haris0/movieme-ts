import {
  IGenreListRes,
  IMovieListRes,
  ITvListRes,
  IPeopleListRes,
} from 'types';
import { axiosGet } from './axios-client';

export { baseImageURL } from './axios-client';

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
