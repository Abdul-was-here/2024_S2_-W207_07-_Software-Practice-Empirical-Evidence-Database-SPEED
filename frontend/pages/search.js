import { useState } from 'react';
import styles from './css/Search.module.css'; 
import Layout from '../components/Layout';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/articles/search?q=${query}`);
    if (res.ok) {
      const data = await res.json();
      setResults(data);
    } else {
      alert('Failed to search articles');
    }
  };

  return (
    <Layout>
    <div className={styles.container}>
      <h1>Search Articles</h1>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search keyword"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Search</button>
      </form>

      <ul className={styles.results}>
        {results.length > 0 ? (
          results.map(article => (
            <li key={article._id} className={styles.resultItem}>
              <h2>{article.title}</h2>
              <p><strong>DOI:</strong> {article.doi ? <a href={article.doi} target="_blank" rel="noopener noreferrer">{article.doi}</a> : 'No DOI available'}</p>
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
