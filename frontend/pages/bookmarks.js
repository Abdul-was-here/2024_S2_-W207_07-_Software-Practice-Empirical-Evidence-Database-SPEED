import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import styles from './css/Bookmarks.module.css'; 

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const removeBookmark = (articleId) => {
    // 过滤掉要删除的书签
    const updatedBookmarks = bookmarks.filter((article) => article._id !== articleId);
    setBookmarks(updatedBookmarks);
    // 更新 localStorage
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Your Bookmarked Articles</h1>
        {bookmarks.length > 0 ? (
          <div className={styles.articleList}>
            <ul>
              {bookmarks.map((article) => (
                <li key={article._id} className={styles.articleItem}>
                  <p><strong>Title:</strong> {article.title}</p>
                  <p><strong>Author:</strong> {article.author}</p>
                  <p><strong>Description:</strong> {article.description ? article.description : 'No description available'}</p>
                  <p><strong>Published Date:</strong> {article.published_date ? formatDate(article.published_date) : 'No published date available'}</p>
                  <p><strong>DOI:</strong> {article.doi ? <a href={article.doi} target="_blank" rel="noopener noreferrer">{article.doi}</a> : 'No DOI available'}</p>
                  
                  {/* 删除按钮 */}
                  <button
                    className={styles.articleButton}
                    onClick={() => removeBookmark(article._id)}
                  >
                    Remove Bookmark
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No bookmarked articles found</p>
        )}
      </div>
    </Layout>
  );
}
