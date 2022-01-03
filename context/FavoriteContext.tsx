/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-constructed-context-values */
import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { IFavorite } from 'types';

export interface FavoriteContextType{
  favorites : IFavorite[];
  addFavorite : (favorites : IFavorite) => void;
  removeFavorite : (id : number) => void;
  checkFavorite : (id : number) => boolean;
  countFavorite : () => number;
}

const initialTheme: FavoriteContextType = {
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  checkFavorite: () => false,
  countFavorite: () => 0,
};

const FavoriteContext = createContext<FavoriteContextType>(initialTheme);

type props = {
  children: ReactNode;
};

const FavoriteContextProvider = ({ children }: props) => {
  const [favorites, setFavorites] = useState<IFavorite[]>(initialTheme.favorites);

  const addFavorite = (newFavorites: IFavorite) => {
    setFavorites((prev) => [...prev, newFavorites]);
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const checkFavorite = (id: number) => favorites.some((item) => item.id === id);

  const countFavorite = () => favorites.length;

  return (
    <FavoriteContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      checkFavorite,
      countFavorite,
    }}
    >
      { children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const { favorites } = useContext(FavoriteContext);

  return favorites;
};

export const useAddFavorite = () => {
  const { addFavorite } = useContext(FavoriteContext);

  return addFavorite;
};

export const useRemoveFavorite = () => {
  const { removeFavorite } = useContext(FavoriteContext);

  return removeFavorite;
};

export const useCheckFavorite = () => {
  const { checkFavorite } = useContext(FavoriteContext);

  return checkFavorite;
};

export const useCountFavorite = () => {
  const { countFavorite } = useContext(FavoriteContext);

  return countFavorite;
};

export default FavoriteContextProvider;
