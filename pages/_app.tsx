import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import ContextProvider from 'context';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ContextProvider>
    <Component {...pageProps} />
  </ContextProvider>
);

export default MyApp;
