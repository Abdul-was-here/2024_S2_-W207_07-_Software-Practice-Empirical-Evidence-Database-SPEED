import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import styles from './css/Home.module.css'; 
import Link from 'next/link';

export default function Home() {
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            // 如果 token 失效，移除 token 并跳转到登录页面
            localStorage.removeItem('token');
            router.push('/login');
          }
        })
        .then((data) => {
          if (data && data.role) {
            setUserRole(data.role); // 只有在 role 存在时才更新状态
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          router.push('/login');
        });
    } else {
      router.push('/login'); // 如果没有 token，跳转到登录页面
    }
  }, [router]);

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Welcome to SPEED</h1>
          {userRole && (
            <div className={styles.login}>
              <span>{userRole}</span>
            </div>
          )}
        </header>

        <main className={styles.main}>
          {userRole === 'Moderator' && <Link href="/moderation">Moderation Queue</Link>}
          {userRole === 'Analyst' && <Link href="/analysis">Analysis Queue</Link>}
          {!userRole && <p>Loading...</p>}
        </main>
      </div>
    </Layout>
  );
}
