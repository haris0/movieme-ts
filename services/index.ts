import { IMovieListRes, ITvListRes } from 'types';
import { axiosGet } from './axios-client';

export const getDiscover = async (page:number): Promise<{
  discoverResponse: IMovieListRes,
  discoverError: boolean
}> => {
  const { data, error } = await axiosGet('discover/movie', {
    params: {
      language: 'en-US',
      sort_by: 'popularity.desc',
      include_adult: false,
      include_video: false,
      page,
    },
  });

  const discoverResponse = data?.data;
  const discoverError = !!error;

  return { discoverResponse, discoverError };
};

export const getTrending = async (
  media: 'tv' | 'movie',
  type : 'day' | 'week',
): Promise<{
  trendingResponse: IMovieListRes | ITvListRes,
  trendingError: boolean
}> => {
  const { data, error } = await axiosGet(`trending/${media}/${type}`);

  const trendingResponse = data?.data;
  const trendingError = !!error;

  return { trendingResponse, trendingError };
};
