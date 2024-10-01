import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './Layout'; // Import your Layout component
import styles from './css/Home.module.css'; // Import styles for your component

export default function Home() {
  const [userRole, setUserRole] = useState(null); // State to hold user role
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from local storage
    if (token) {
      fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            localStorage.removeItem('token');
            router.push('/login'); // Redirect to login if token is invalid
          }
        })
        .then((data) => {
          if (data && data.role) {
            setUserRole(data.role); // Set user role based on fetched data
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          router.push('/login'); // Redirect to login on fetch error
        });
    } else {
      router.push('/login'); // Redirect to login if no token is found
    }
  }, [router]);

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Welcome to SPEED</h1>
          {userRole && (
            <div className={styles.login}>
              <span>{userRole}</span> {/* Display user role */}
            </div>
          )}
        </header>

        <main className={styles.main}>
          {!userRole && <p>Loading...</p>}
        </main>
      </div>
    </Layout>
  );
}

