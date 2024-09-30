import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      // If no token is found and not on the login or register pages, redirect to login
      if (!token && router.pathname !== '/login' && router.pathname !== '/register') {
        router.push('/login');
      } else {
        setIsLoading(false); // Stop loading if token is present or on the login/register pages
      }
    }
  }, [router]);

  if (isLoading) {
    // Show loading state while checking for token
    return <div>Loading...</div>;
  }

  return <Component {...pageProps} />;
}

export default MyApp;

