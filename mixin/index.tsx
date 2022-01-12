/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { ISocialMedia } from 'types';

export const convertDate = (date: Date): string => {
  if (!date) return '-';

  const monthLetter = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'];
  const [year, month, day] = date.toString().split('-');

  return `${monthLetter[(+month) - 1]} ${day}, ${year}`;
};

export const getYear = (date: Date): string => {
  if (!date) return '-';

  return date.toString().split('-')[0];
};

export const convertMinsToHrsMins = (mins: number) => {
  if (mins < 60) return `${mins}m`;

  const h: number | string = Math.floor(mins / 60);
  const m: number | string = mins % 60;
  return `${h}h${m}m`;
};

export const useDebouncedEffect = (effect: Function, deps: Array<any>, delay: number) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...deps || [], delay]);
};

export const filterEmptyId = (datas: any[]) => datas.filter((data) => !!data.id);

export const anyExternalLink = (sosialMedia: ISocialMedia, homepage: string | undefined) => (
  !!sosialMedia.facebook_id
    || !!sosialMedia.twitter_id
    || !!sosialMedia.instagram_id
    || !!homepage
);
