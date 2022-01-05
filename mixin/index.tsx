/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export const convertDate = (date: Date): string => {
  if (!date) return '-';

  const monthLetter = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'];
  const [year, month, day] = date.toString().split('-');

  return `${monthLetter[(+month) - 1]} ${day}, ${year}`;
};

export const useDebouncedEffect = (effect: Function, deps: Array<any>, delay: number) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...deps || [], delay]);
};
