import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
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

export { axiosGet };
