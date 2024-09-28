import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './css/Submit.module.css'; 
import Layout from '../components/Layout';

export default function Submit() {
  const [article, setArticle] = useState({
    title: '',
    isbn: '',
    author: '',
    description: '',
    published_date: '',
    publisher: '',
    doi: '',
  });

  const router = useRouter();

  // 获取 token 并验证是否登录
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // 如果没有 token，跳转到登录页面
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit an article.');
      return;
    }

    console.log('Submitting Article:', article);

    const res = await fetch('/api/articles/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // 发送 token
      },
      body: JSON.stringify(article),
    });
  
    if (res.ok) {
      alert('Article submitted successfully!');
      setArticle({
        title: '',
        isbn: '',
        author: '',
        description: '',
        published_date: '',
        publisher: '',
        doi: '',
      });
    } else {
      alert('Failed to submit article');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle({
      ...article,
      [name]: value,
    });
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Submit an Article</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="title"
            value={article.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
            className={styles.input}
          />
          <input
            type="text"
            name="isbn"
            value={article.isbn}
            onChange={handleInputChange}
            placeholder="ISBN"
            required
            className={styles.input}
          />
          <input
            type="text"
            name="author"
            value={article.author}
            onChange={handleInputChange}
            placeholder="Author"
            required
            className={styles.input}
          />
          <textarea
            name="description"
            value={article.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className={styles.textarea}
          />
          <input
            type="date"
            name="published_date"
            value={article.published_date}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="text"
            name="publisher"
            value={article.publisher}
            onChange={handleInputChange}
            placeholder="Publisher"
            required
            className={styles.input}
          />
          <input
            type="text"
            name="doi"
            value={article.doi}
            onChange={handleInputChange}
            placeholder="DOI"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Submit</button>
        </form>
      </div>
    </Layout>
  );
}
