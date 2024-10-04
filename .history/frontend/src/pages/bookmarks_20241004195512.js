import React, { useState, useEffect } from 'react';
import Layout from './Layout'; // Import Layout component to maintain consistent page structure
import styles from './css/Bookmarks.module.css'; 

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]); // State to store bookmarked articles
  const [isClient, setIsClient] = useState(false); // State to check if rendering on the client

  useEffect(() => {
    // Ensure the component is rendered on the client side
    setIsClient(true);

    // When the component mounts, fetch bookmarks from local storage
    if (typeof window !== 'undefined') {
      const storedBookmarks = localStorage.getItem('bookmarks');
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks)); // If bookmarks exist, parse and set them to the state
      }
    }
  }, []); // Empty dependency array means this useEffect runs only once when the component mounts

  // Format the date into a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Specify the date format
    return new Date(dateString).toLocaleDateString(undefined, options); // Convert the date to local format
  };

  // Remove a bookmark by article ID
  const removeBookmark = (articleId) => {
    if (window.confirm('Are you sure you want to remove this bookmark?')) {
      // Filter out the bookmark to be deleted
      const updatedBookmarks = bookmarks.filter((article) => article._id !== articleId);
      setBookmarks(updatedBookmarks); // Update the state with the filtered bookmarks
      // Update the bookmark list in local storage
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    }
  };

  // Ensure the component only renders on the client side
  if (!isClient) {
    return null; // Render nothing if not rendering on the client
  }

  return (
    <Layout> {/* Wrap content in Layout component */}
      <div className={styles.container}> {/* Bookmark container */}
        <h1>Your Bookmarked Articles</h1> {/* Page title */}
        {bookmarks.length > 0 ? ( // Check if there are bookmarks
          <div className={styles.articleList}>
            <ul>
              {bookmarks.map((article) => ( // Iterate over bookmarked articles to create list items
                <li key={article._id} className={styles.articleItem}> {/* Assign a unique key to each list item */}
                  <p><strong>Title:</strong> {article.title}</p> {/* Article title */}
                  <p><strong>Author:</strong> {article.author}</p> {/* Article author */}
                  <p><strong>Description:</strong> {article.description ? article.description : 'No description available'}</p> {/* Article description */}
                  <p><strong>Published Date:</strong> {article.published_date ? formatDate(article.published_date) : 'No published date available'}</p> {/* Article published date */}
                  <p><strong>DOI:</strong> {article.doi ? <a href={article.doi} target="_blank" rel="noopener noreferrer">{article.doi}</a> : 'No DOI available'}</p> {/* Article DOI */}

                  {/* Remove bookmark button */}
                  <button
                    className={styles.articleButton}
                    onClick={() => removeBookmark(article._id)} // Call removeBookmark with the article's ID
                  >
                    Remove Bookmark
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No bookmarked articles found</p> // Message if no bookmarks are found
        )}
      </div>
    </Layout>
  );
}
