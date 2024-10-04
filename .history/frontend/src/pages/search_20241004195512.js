import React, { useState, useEffect } from 'react';
import styles from './css/Search.module.css'; 
import Layout from './Layout'; // Import Layout component for consistent page structure

export default function Search() {
  const [query, setQuery] = useState(''); // State to store the search keyword
  const [results, setResults] = useState([]); // State to store search results
  const [isClient, setIsClient] = useState(false); // State to check if rendering on the client

  useEffect(() => {
    // Ensure the component is only rendered on the client side
    setIsClient(true);
  }, []); // Empty dependency array means this useEffect only runs once when the component mounts

  // Handle form submission for search
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const res = await fetch(`/api/articles/search?q=${query}`); // Fetch search results from API
      if (res.ok) {
        const data = await res.json(); // Parse the response as JSON
        setResults(data); // Update the state with the search results
      } else {
        alert('Failed to search articles'); // Alert the user if the search fails
      }
    } catch (error) {
      console.error('Search error:', error); // Log any errors
      alert('An error occurred during the search.');
    }
  };

  // Ensure the component is only rendered on the client side
  if (!isClient) {
    return null; // Render nothing if not on the client side
  }

  return (
    <Layout> {/* Wrap content with Layout component */}
      <div className={styles.container}> {/* Container for the search form and results */}
        <h1>Search Articles</h1> {/* Page title */}
        <form onSubmit={handleSearch} className={styles.form}> {/* Search form */}
          <input
            type="text" // Input type for the search keyword
            value={query} // Bind the query state to the input field
            onChange={(e) => setQuery(e.target.value)} // Update query state on input change
            placeholder="Enter search keyword" // Placeholder text for the input field
            className={styles.input} // CSS class for styling
          />
          <button type="submit" className={styles.button}>Search</button> {/* Submit button */}
        </form>

        <ul className={styles.results}> {/* List for displaying search results */}
          {results.length > 0 ? ( // Check if there are search results
            results.map((article) => ( // Map through search results to generate list items
              <li key={article._id} className={styles.resultItem}> {/* Assign a unique key to each list item */}
                <h2>{article.title}</h2> {/* Article title */}
                <p><strong>DOI:</strong> {article.doi ? <a href={article.doi} target="_blank" rel="noopener noreferrer">{article.doi}</a> : 'No DOI available'}</p> {/* Display DOI link if available */}
              </li>
            ))
          ) : (
            <p className={styles.noResults}>No results found</p> 
          )}
        </ul>
      </div>
    </Layout>
  );
}
