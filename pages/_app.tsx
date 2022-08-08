import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import ContextProvider from 'context';
import { ReactNode } from 'react';
import { useTheme } from 'context/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import NavigationBar from 'components/navbar/Navbar';
import NextProgress from 'next-progress';

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
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
        <meta name="theme-color" content="#032541" />
        <title>MovieMe</title>
        <meta name="title" content="MovieMe" />
        <meta name="description" content="Discover your amazing movies" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <NextProgress />
      <NavigationBar />
      <Component {...pageProps} />
    </ThemeController>
  </ContextProvider>
);

export default MyApp;
