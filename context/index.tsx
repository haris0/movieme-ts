import { FC, ReactNode } from 'react';
import ThemeContextProvider from './ThemeContext';

type props = {
  children: ReactNode
}

const combineProviders = (providers: any): FC => providers.reduce(
  (Combined: FC, Provider: FC) => ({ children }: props) => (
    <Combined>
      <Provider>
        {children}
      </Provider>
    </Combined>
  ),
);

const ContextProvider = combineProviders([
  ThemeContextProvider,
]);

export default ContextProvider;
