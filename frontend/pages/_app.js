import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Redirect to login if token is not found and not on login/register pages
    if (!token && router.pathname !== '/login' && router.pathname !== '/register') {
      router.push('/login');
    }
  }, [router]);

  return <Component {...pageProps} />; // No Layout here
}

export default MyApp;
