import React, { useState, useEffect } from 'react';

export default function AnalysisQueue() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles/analysis')  // 确保请求正确的 API 路径
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  return (
    <div>
      <h1>Analysis Queue</h1>
      <ul>
        {articles.map(article => (
          <li key={article._id}>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
