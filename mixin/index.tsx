/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export const useDebouncedEffect = (effect: Function, deps: Array<any>, delay: number) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...deps || [], delay]);
};
