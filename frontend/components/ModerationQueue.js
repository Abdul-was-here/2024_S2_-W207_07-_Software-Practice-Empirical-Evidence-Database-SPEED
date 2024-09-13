import React, { useState, useEffect } from 'react';

export default function ModerationQueue() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles/moderation')
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  const handleApprove = async (id) => {
    await fetch(`/api/articles/moderation/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'approve' }),
    });
    setArticles(articles.filter(article => article._id !== id));
  };

  const handleReject = async (id) => {
    await fetch(`/api/articles/moderation/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'reject' }),
    });
    setArticles(articles.filter(article => article._id !== id));
  };

  return (
    <div>
      <h1>Moderation Queue</h1>
      <ul>
        {articles.map(article => (
          <li key={article._id}>
            <h2>{article.title}</h2>
            <button onClick={() => handleApprove(article._id)}>Approve</button>
            <button onClick={() => handleReject(article._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

