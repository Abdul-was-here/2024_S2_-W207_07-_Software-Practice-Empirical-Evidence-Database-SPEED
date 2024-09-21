import { useEffect, useState } from 'react';
import styles from './css/Articles.module.css';
import Layout from '../components/Layout';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [sortOption, setSortOption] = useState('author'); // 默认按 author 排序

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const sortArticles = (articles, option) => {
    return articles.sort((a, b) => {
      if (option === 'author') {
        return a.author.localeCompare(b.author);
      } else if (option === 'updated_date') {
        return new Date(b.updated_date) - new Date(a.updated_date); // 倒序排序
      } else if (option === 'published_date') {
        return new Date(b.published_date) - new Date(a.published_date); // 倒序排序
      }
      return 0;
    });
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>All Articles</h1>

        {/* 排序选项 */}
        <div className={styles.sortOptions}>
          <label htmlFor="sort">Sort by: </label>
          <select id="sort" value={sortOption} onChange={handleSortChange}>
            <option value="author">Author</option>
            <option value="updated_date">Updated Date</option>
            <option value="published_date">Published Date</option>
          </select>
        </div>

        {articles.length > 0 ? (
          <table className={styles.articleTable}>
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
              {sortArticles(articles, sortOption).map(article => (
                <tr key={article._id}>
                  <td>{article.title}</td>
                  <td>{article.description ? article.description : 'No description available'}</td>
                  <td>{article.author ? article.author : 'No author available'}</td>
                  <td>{article.published_date ? formatDate(article.published_date) : 'No published date available'}</td>
                  <td>{article.doi ? <a href={article.doi} target="_blank" rel="noopener noreferrer">{article.doi}</a> : 'No DOI available'}</td>
                  <td>{article.updated_date ? formatDate(article.updated_date) : 'No updated date available'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No articles available</p>
        )}
      </div>
    </Layout>
  );
}
