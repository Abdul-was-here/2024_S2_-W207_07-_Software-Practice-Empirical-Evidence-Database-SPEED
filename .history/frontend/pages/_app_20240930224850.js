import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Check if we're in the client (browser) environment
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem('token');
      // Redirect to login if token is not found and not on login/register pages
      if (!token && router.pathname !== '/login' && router.pathname !== '/register') {
        router.push('/login');
      }
    }
  }, [router, isClient]);

  // Prevent SSR from running the client-side code until the app is mounted in the browser
  if (!isClient) {
    return null; // Render nothing on the server side
  }

  return <Component {...pageProps} />;
}

export default MyApp;

