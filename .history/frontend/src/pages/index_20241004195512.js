import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import Link component for navigation
import Layout from './Layout'; // Import Layout component for consistent page structure
import styles from './css/Home.module.css'; 

export default function Home() {
  const [userRole, setUserRole] = useState(null); // State to store the user's role
  const [articles, setArticles] = useState([]); // State to store the articles
  const [isClient, setIsClient] = useState(false); // State to check if rendering on the client
  const router = useRouter();

  useEffect(() => {
    // Ensure the component is rendered on the client side
    setIsClient(true);

    const token = localStorage.getItem('token'); // Get the token from localStorage
    if (token) {
      fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            localStorage.removeItem('token');
            router.push('/login'); // Redirect to login if the token is invalid
          }
        })
        .then((data) => {
          if (data && data.role) {
            setUserRole(data.role); // Set the user's role based on the returned data
            if (data.role === 'Submitter') {
              // If the user's role is 'Submitter', fetch article data
              fetch('/api/articles')
                .then((res) => res.json())
                .then((articleData) => {
                  setArticles(Array.isArray(articleData) ? articleData : []); // Ensure articleData is an array
                })
                .catch(() => setArticles([])); // If fetching articles fails, set an empty array
            }
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          router.push('/login'); // Redirect to login if data fetching fails
        });
    } else {
      router.push('/login'); // Redirect to login if there is no token
    }
  }, [router]);

  // Functionality for bookmarking articles
  const bookmarkArticle = (article) => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    const bookmarksArray = storedBookmarks ? JSON.parse(storedBookmarks) : [];
    const isAlreadyBookmarked = bookmarksArray.some((bookmark) => bookmark._id === article._id);

    if (!isAlreadyBookmarked) {
      const newBookmarks = [...bookmarksArray, article];
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      alert('Article bookmarked!'); // Notify the user that the article has been bookmarked
    } else {
      alert('This article is already bookmarked.'); // Notify the user that the article is already bookmarked
    }
  };

  // Functionality for exporting articles
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
    link.download = `${article.title}.txt`; // Set the filename
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up the link element
  };

  // Ensure the component only renders on the client side
  if (!isClient) {
    return null; // Render nothing if not rendering on the client
  }

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Welcome to SPEED</h1>
          {userRole && (
            <div className={styles.login}>
              <span>{userRole}</span> {/* Display the user's role */}
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

          {/* Add link to bookmarks page */}
          <Link href="/bookmarks">
            View Bookmarks
          </Link>
        </main>
      </div>
    </Layout>
  );
}
