import React from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

