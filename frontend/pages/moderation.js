import React, { useState, useEffect } from 'react';

export default function ModerationQueue() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles/moderation')
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  return (
    <div>
      <h1>Moderation Queue</h1>
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
