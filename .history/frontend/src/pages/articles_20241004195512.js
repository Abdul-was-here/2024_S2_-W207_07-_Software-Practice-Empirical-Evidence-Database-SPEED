import React, { useState, useEffect } from 'react';
import styles from './css/Articles.module.css';
import Layout from './Layout'; // Import Layout component to maintain consistent page structure

export default function Articles() {
  const [articles, setArticles] = useState([]); // State to store the articles
  const [sortOption, setSortOption] = useState('author'); // Default sorting by author
  const [isClient, setIsClient] = useState(false); // To track if the rendering is on the client

  useEffect(() => {
    // Ensure the component is rendered on the client side
    setIsClient(true);
    // Fetch the articles data from the API when the component mounts
    fetch('/api/articles')
      .then((res) => res.json()) // Convert the response to JSON
      .then((data) => setArticles(data)); // Update the state with the fetched articles
  }, []);

  // Format the date into a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Specify the date format
    return new Date(dateString).toLocaleDateString(undefined, options); // Convert the date to a local format
  };

  // Sort articles based on the selected option
  const sortArticles = (articles, option) => {
    return articles.sort((a, b) => {
      if (option === 'author') {
        return a.author.localeCompare(b.author); // Sort by author's name
      } else if (option === 'updated_date') {
        return new Date(b.updated_date) - new Date(a.updated_date); // Sort by updated date in descending order
      } else if (option === 'published_date') {
        return new Date(b.published_date) - new Date(a.published_date); // Sort by published date in descending order
      }
      return 0; // No sorting if the option doesn't match
    });
  };

  // Handle changes in the sorting option
  const handleSortChange = (e) => {
    setSortOption(e.target.value); // Update the sort option based on user selection
  };

  // Ensure the component is only rendered on the client side
  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <Layout> {/* Wrap content in Layout component */}
      <div className={styles.container}> {/* Article container */}
        <h1>All Articles</h1> {/* Page title */}

        {/* Sorting options */}
        <div className={styles.sortOptions}>
          <label htmlFor="sort">Sort by: </label>
          <select id="sort" value={sortOption} onChange={handleSortChange}>
            <option value="author">Author</option>
            <option value="updated_date">Updated Date</option>
            <option value="published_date">Published Date</option>
          </select>
        </div>

        {articles.length > 0 ? ( // Check if there are articles to display
          <table className={styles.articleTable}> {/* Table to display articles */}
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Author</th>
                <th>Published Date</th>
                <th>DOI</th>
                <th>Updated Date</th>
              </tr>
            </thead>
            <tbody>
              {sortArticles(articles, sortOption).map((article) => ( // Map sorted articles to table rows
                <tr key={article._id}> {/* Assign a unique key to each row */}
                  <td>{article.title}</td> {/* Article title */}
                  <td>{article.description ? article.description : 'No description available'}</td> {/* Article description */}
                  <td>{article.author ? article.author : 'No author available'}</td> {/* Article author */}
                  <td>{article.published_date ? formatDate(article.published_date) : 'No published date available'}</td> {/* Article published date */}
                  <td>{article.doi ? <a href={article.doi} target="_blank" rel="noopener noreferrer">{article.doi}</a> : 'No DOI available'}</td> {/* Article DOI */}
                  <td>{article.updated_date ? formatDate(article.updated_date) : 'No updated date available'}</td> {/* Article updated date */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No articles available</p> // Message if no articles are available
        )}
      </div>
    </Layout>
  );
}
