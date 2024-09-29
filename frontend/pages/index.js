import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import styles from './css/Home.module.css'; 

export default function Home() {
  const [userRole, setUserRole] = useState(null);
  const [articles, setArticles] = useState([]); // 初始化为空数组
  const [bookmarks, setBookmarks] = useState([]); // 存储书签列表
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
            localStorage.removeItem('token');
            router.push('/login');
          }
        })
        .then((data) => {
          if (data && data.role) {
            setUserRole(data.role);
            if (data.role === 'Submitter') {
              // 获取所有文章
              fetch('/api/articles')
                .then((res) => res.json())
                .then((articleData) => {
                  setArticles(Array.isArray(articleData) ? articleData : []); // 确保文章是数组
                })
                .catch(() => setArticles([])); // 在发生错误时，设置为空数组
            }
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          router.push('/login');
        });
    } else {
      router.push('/login');
    }
  }, [router]);

  const bookmarkArticle = (article) => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    const bookmarksArray = storedBookmarks ? JSON.parse(storedBookmarks) : [];

    const isAlreadyBookmarked = bookmarksArray.some((bookmark) => bookmark._id === article._id);

    if (!isAlreadyBookmarked) {
      const newBookmarks = [...bookmarksArray, article];
      setBookmarks(newBookmarks);
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      alert('Article bookmarked!');
    } else {
      alert('This article is already bookmarked.');
    }
  };

  const exportArticle = (article) => {
    const articleData = `
      Title: ${article.title}
      Author: ${article.author}
      DOI: ${article.doi}
      Description: ${article.description}
      Published Date: ${article.published_date}
    `;
    const blob = new Blob([articleData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          {userRole === 'Submitter' && (
            <div>
              <h2>Recent Articles</h2>
              {articles.length > 0 ? (
                <div className={styles.articleList}>
                  <ul>
                    {articles.map((article) => (
                      <li key={article._id} className={styles.articleItem}>
                        <p><strong>Title:</strong> {article.title}</p>
                        <p><strong>Author:</strong> {article.author}</p>
                        <p><strong>Description:</strong> {article.description || 'No description available'}</p>
                        <p><strong>Published Date:</strong> {article.published_date ? new Date(article.published_date).toLocaleDateString() : 'No date available'}</p>
                        <p><strong>DOI:</strong> {article.doi ? <a href={article.doi} target="_blank" rel="noopener noreferrer">{article.doi}</a> : 'No DOI available'}</p>
                        
                        <div className={styles.buttonContainer}>
                          <button 
                            className={styles.articleButton} 
                            onClick={() => bookmarkArticle(article)}
                          >
                            Bookmark
                          </button>

                          <button 
                            className={styles.articleButton} 
                            onClick={() => exportArticle(article)}
                          >
                            Export
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No recent articles available</p>
              )}
            </div>
          )}
          {!userRole && <p>Loading...</p>}

          {/* 添加书签页面链接 */}
          <div className={styles.bookmarksLink}>
            <a href="/bookmarks">
              View Bookmarks
            </a>
          </div>
        </main>
      </div>
    </Layout>
  );
}
