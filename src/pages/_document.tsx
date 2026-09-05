import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="STRATA — Teclado mecánico modular de aluminio CNC. Diseño modular, switches hot-swap, firmware QMK/VIA. Edición limitada 2026." />
        <meta name="theme-color" content="#080808" />
        <meta property="og:title" content="STRATA — Teclado Mecánico Modular" />
        <meta property="og:description" content="Ingeniería sin compromisos. Aluminio 6061-T6 mecanizado CNC. 500 unidades." />
        <meta property="og:type" content="website" />
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href={process.env.NODE_ENV === 'production' ? '/mechkey-landing/favicon.ico' : '/favicon.ico'} />
      </Head>
      <body className="noise-overlay">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
