import { filterEmptyId } from 'mixin';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDiscover } from 'services';

export const getDiscoverRes = async (
  type: 'movie' | 'tv' = 'movie',
  loaded: number = 1,
  genreId: number = 0,
) => {
  const loadedPage = loaded;
  const loadedPageArr = Array.from(Array(loadedPage + 1).keys());
  loadedPageArr.shift();

  const discoverResults = await Promise.all(
    loadedPageArr.map(
      (page) => (getDiscover(type, genreId, page)),
    ),
  );

  const alldiscoverRes = discoverResults?.map((res) => res.discoverRes);
  const alldiscoverErr = discoverResults?.map((res) => res.discoverErr);

  const discoverResult = filterEmptyId(alldiscoverRes.map(({ results }) => results).flat());
  const discoverError = alldiscoverErr.map((error) => error).flat();

  return {
    discoverResult,
    discoverError,
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  res.status(200).json(getDiscoverRes());
}
