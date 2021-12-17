import axios from 'axios';
import { IDiscoverResponse } from 'types';

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/4/',
  timeout: 3000,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_MDB_TOKEN}`,
  },
});

const axiosGet = async (url: string, config?: {}): Promise<any> => {
  let data = null;
  let error = null;

  try {
    const response = await axiosInstance.get(url, config);
    data = response;
  } catch (err) {
    error = err;
  }

  return { data, error };
};

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
