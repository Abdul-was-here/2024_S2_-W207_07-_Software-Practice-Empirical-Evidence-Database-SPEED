import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 存储用户角色
  const router = useRouter();

  useEffect(() => {
    // 获取 localStorage 中的 token
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token); // 解析 token
      setIsLoggedIn(true); // 设置为已登录
      setUserRole(decodedToken.role); // 存储用户角色
    } else {
      setIsLoggedIn(false); // 设置为未登录
    }
  }, []);

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
    localStorage.removeItem('token'); // 移除 JWT 令牌
    setIsLoggedIn(false); // 更新为未登录状态
    setUserRole(null); // 清空用户角色
    router.push('/login'); // 跳转到登录页面
  };

  return (
    <div>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <ul>
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
                <li><span>{`Logged in as: ${userRole}`}</span></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <li>
                <Link href="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
