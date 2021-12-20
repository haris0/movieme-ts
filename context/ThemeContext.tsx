/* eslint-disable react/jsx-no-constructed-context-values */
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export interface ThemeContextType{
  theme : string;
  setTheme : Dispatch<SetStateAction<string>>
}

const initialTheme: ThemeContextType = {
  theme: 'dark',
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(initialTheme);

type props = {
  children: ReactNode;
};

const ThemeContextProvider = ({ children }: props) => {
  const [theme, setTheme] = useState<string>(initialTheme.theme);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
    }}
    >
      { children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const { theme } = useContext(ThemeContext);

  return theme;
};

export const useSwitchTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  setTheme(theme === 'dark' ? 'light' : 'dark');
};

export default ThemeContextProvider;
