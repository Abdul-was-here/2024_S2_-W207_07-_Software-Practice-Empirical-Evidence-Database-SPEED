import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './Layout.module.css';

export default function Layout({ children, hideMenu }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isLoggedIn) { // 仅在未登录状态下解析 token
      const decodedToken = decodeToken(token); 
      setIsLoggedIn(true); 
      setUserRole(decodedToken.role); 
    }
  }, [isLoggedIn]); // 依赖 isLoggedIn，避免重复解析

  // 手动解析 JWT
  const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false); 
    setUserRole(null); 
    router.push('/login'); 
  };

  return (
    <div>
      <header className={styles.header}>
        {!hideMenu && (
          <nav className={styles.navbar}>
            <ul className={styles.navList}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/articles">Articles</Link>
              </li>
              <li>
                <Link href="/search">Search</Link>
              </li>
              <li>
                <Link href="/submit">Submit Article</Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li className={styles.userRole}>
                    <span>{`Logged in as: ${userRole}`}</span>
                  </li>
                  <li>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login">Login</Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
