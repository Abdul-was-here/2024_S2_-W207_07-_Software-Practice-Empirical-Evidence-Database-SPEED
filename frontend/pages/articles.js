import { useEffect, useState } from 'react';
import styles from './css/Articles.module.css'; 

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

  // 排序函数
  const sortArticles = (articles, option) => {
    return articles.sort((a, b) => {
      if (option === 'author') {
        return a.author.localeCompare(b.author);
      } else if (option === 'updated_date') {
        return new Date(b.updated_date) - new Date(a.updated_date); // 倒序排序
      }
      return 0;
    });
  };

  // 处理排序方式改变
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className={styles.container}>
      <h1>All Articles</h1>

      {/* 排序选项 */}
      <div className={styles.sortOptions}>
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="author">Author</option>
          <option value="updated_date">Updated Date</option>
        </select>
      </div>

      <ul className={styles.articleList}>
        {articles.length > 0 ? (
          sortArticles(articles, sortOption).map(article => (
            <li key={article._id} className={styles.articleItem}>
              <div className={styles.titleBox}>
                <h2>{article.title}</h2>  {/* Title inside a box */}
              </div>
              <p className={styles.summaryText}>
                <strong>Summary:</strong> {article.description ? article.description : 'No description available'}
              </p>  {/* Summary with smaller font */}
              <p><strong>Author:</strong> {article.author ? article.author : 'No author available'}</p>  {/* Author */}
              <p><strong>DOI:</strong> {article.doi ? <a href={article.doi} target="_blank" rel="noopener noreferrer">{article.doi}</a> : 'No DOI available'}</p>  {/* DOI */}
              <p><strong>Updated Date:</strong> {article.updated_date ? formatDate(article.updated_date) : 'No updated date available'}</p>  {/* Updated Date */}
            </li>
          ))
        ) : (
          <p>No articles available</p>
        )}
      </ul>
    </div>
  );
}

