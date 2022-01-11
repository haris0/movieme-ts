import axios from 'axios';

export const baseURL = 'https://api.themoviedb.org/3';
export const baseBackURL = 'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/';
export const basePosterCardURL = 'https://image.tmdb.org/t/p/w220_and_h330_face/';
export const baseProfileURL = 'https://image.tmdb.org/t/p/w235_and_h235_face/';
export const baseProfileDetailURL = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/';

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
