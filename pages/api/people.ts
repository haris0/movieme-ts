// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { filterEmptyId } from 'mixin';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getPopulerPeople } from 'services';

export const getPeople = async (loaded: number = 1) => {
  const loadedPage = loaded;
  const loadedPageArr = Array.from(Array(loadedPage + 1).keys());
  loadedPageArr.shift();

  const populerPeopleResults = await Promise.all(
    loadedPageArr.map(
      (page) => (getPopulerPeople(page)),
    ),
  );

  const allPeopleRes = populerPeopleResults?.map((res) => res.peopleRes);
  const allPeopleErr = populerPeopleResults?.map((res) => res.peopleErr);

  const peopleResult = filterEmptyId(allPeopleRes.map(({ results }) => results).flat());
  const peopleError = allPeopleErr.map((error) => error).flat();

  return {
    peopleResult,
    peopleError,
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  res.status(200).json(getPeople());
}
