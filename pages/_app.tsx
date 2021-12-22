import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import ContextProvider from 'context';
import { ReactNode } from 'react';
import { useTheme } from 'context/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import NavigationBar from 'components/navbar/Navbar';

type props = {
  children: ReactNode;
};

const ThemeController = ({ children }: props) => {
  const theme = useTheme();

  return (
    <div className={`app-${theme}`}>
      { children }
    </div>
  );
};

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ContextProvider>
    <ThemeController>
      <Head>
        <title>MovieMe</title>
        <meta
          name="description"
          content="Your Favorite Movie Database"
        />
      </Head>
      <NavigationBar />
      <Component {...pageProps} />
    </ThemeController>
  </ContextProvider>
);

export default MyApp;
