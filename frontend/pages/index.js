import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './css/Home.module.css'; 

export default function Home() {
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUserRole(data.role));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome to SPEED</h1>
        <div className={styles.login}>
          {userRole ? (
            <>
              <span>{userRole}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <button onClick={() => router.push('/login')} className={styles.loginButton}>Login</button>
          )}
        </div>
      </header>

      <nav className={styles.nav}>
        <ul>
          <li><Link href="/articles">View All Articles</Link></li>
          <li><Link href="/search">Search Articles</Link></li>
          <li><Link href="/submit">Submit an Article</Link></li>
        </ul>
      </nav>

      <main className={styles.main}>
        {userRole === 'Moderator' && <Link href="/moderation">Moderation Queue</Link>}
        {userRole === 'Analyst' && <Link href="/analysis">Analysis Queue</Link>}
        {!userRole && <p>Welcome! You can view articles, search, or submit new ones without logging in.</p>}
      </main>
    </div>
  );
}
