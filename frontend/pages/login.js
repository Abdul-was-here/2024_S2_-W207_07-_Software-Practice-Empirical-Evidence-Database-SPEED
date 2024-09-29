import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './css/Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // If user is logged in, redirect to home
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/'); // Redirect logged-in users
    }
  }, [router]);

  // Handle login
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

      // Manually decode JWT
      const decodedToken = decodeToken(data.token);
      const userRole = decodedToken.role;

      // Redirect based on user role
      if (userRole === 'Moderator') {
        router.push('/moderation');
      } else if (userRole === 'Analyst') {
        router.push('/analysis');
      } else {
        router.push('/'); // Redirect to home for other roles
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  };

  // Manually decode JWT
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
    <div className={styles.container}>
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
        Don&apos;t have an account? 
        <Link href="/register" className={styles.link}>Register here</Link>
      </p>
    </div>
  );
}

