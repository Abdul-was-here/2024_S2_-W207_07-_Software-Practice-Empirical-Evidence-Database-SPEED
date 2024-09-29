import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './css/Register.module.css';
import Layout from '../components/Layout';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Submitter');
  const router = useRouter();

  // 处理注册表单提交
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log('Registration failed:', errorData.message);
        alert('Registration failed, username has used');
        return;
      }

      alert('Registration successful! You can now log in.');
      router.push('/login'); // 注册成功后跳转到登录页面
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration');
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Register</h1>
        <form onSubmit={handleRegister} className={styles.form}>
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={styles.input}
          >
            <option value="Submitter">Submitter</option>
            <option value="Moderator">Moderator</option>
            <option value="Analyst">Analyst</option>
          </select>
          <button type="submit" className={styles.button}>Register</button>
        </form>
      </div>
    </Layout>
  );
}
