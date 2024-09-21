import Layout from '../components/Layout';
import styles from './css/Home.module.css'; 
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [userRole, setUserRole] = useState(null);

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
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Welcome to SPEED</h1>
          {userRole && (
            <div className={styles.login}>
              <span>{userRole}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </div>
          )}
        </header>

        <main className={styles.main}>
          {userRole === 'Moderator' && <Link href="/moderation">Moderation Queue</Link>}
          {userRole === 'Analyst' && <Link href="/analysis">Analysis Queue</Link>}
          {!userRole && <p>Welcome! Explore the available articles or submit your own.</p>}
        </main>
      </div>
    </Layout>
  );
}

