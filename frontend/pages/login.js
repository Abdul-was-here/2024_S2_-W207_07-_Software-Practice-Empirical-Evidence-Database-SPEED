import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './css/Login.module.css'; 
import Layout from '../components/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // 如果用户已登录，重定向到首页
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/');  // 避免登录用户访问登录页
    }
  }, [router]);

  // 登录处理函数
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log('Login failed:', errorData.message);
        alert('Login failed: ' + errorData.message);
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);

      // 手动解析 JWT
      const decodedToken = decodeToken(data.token);
      const userRole = decodedToken.role;

      // 根据用户角色重定向到不同的页面
      if (userRole === 'Moderator') {
        router.push('/moderation');
      } else if (userRole === 'Analyst') {
        router.push('/analysis');
      } else {
        router.push('/'); // 如果角色不是 Moderator 或 Analyst，跳转到首页
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  };

  // 手动解析 JWT 的方法
  const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  return (
    <Layout hideMenu={true}>
      <div className={styles.container}>
        {/* 添加标题 */}
        <h1 className={styles.title}>Welcome to SPEED Login</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Login</button>
        </form>

        <p className={styles.text}>
          Don't have an account? 
          <Link href="/register" className={styles.link}>Register here</Link>
        </p>
      </div>
    </Layout>
  );
}
