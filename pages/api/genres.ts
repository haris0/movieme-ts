// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getGenreList } from 'services';

export const getGenre = async (type: 'movie' | 'tv' = 'movie') => {
  const { genreRes, genreErr } = await getGenreList(type);
  return { genreRes, genreErr };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  res.status(200).json(getGenre());
}
