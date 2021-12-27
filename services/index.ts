import { IGenreListRes, IMovieListRes, ITvListRes } from 'types';
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

export const getGenreList = async (): Promise<{
  genreRes: IGenreListRes,
  genreErr: boolean
}> => {
  const { data, error } = await axiosGet('/genre/movie/list');

  const genreRes = data?.data;
  const genreErr = !!error;

  return { genreRes, genreErr };
};
