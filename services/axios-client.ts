import axios from 'axios';

export const baseURL = 'https://api.themoviedb.org/3';
export const baseImageURL = 'https://image.tmdb.org/t/p/w500/';

const axiosInstance = axios.create({
  baseURL,
  timeout: 3000,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_MDB_TOKEN}`,
  },
});

export const axiosGet = async (url: string, config?: {}): Promise<any> => {
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
