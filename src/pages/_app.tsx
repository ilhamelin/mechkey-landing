import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/globals.css';
import { ThemeProvider } from '@/lib/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"
        />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
