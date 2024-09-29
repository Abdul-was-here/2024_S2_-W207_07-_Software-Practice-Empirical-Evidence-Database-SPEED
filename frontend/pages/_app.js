import { useRouter } from 'next/router';
import { useEffect } from 'react';


function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // 只在非登录页面进行重定向
    if (!token && router.pathname !== '/login' && router.pathname !== '/register') {
      router.push('/login');
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;

