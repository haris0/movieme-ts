import { IDiscoverResponse } from 'types';
import { axiosGet } from './axios-client';

export const getDiscover = async (page:number): Promise<{
  discoverResponse: IDiscoverResponse,
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
