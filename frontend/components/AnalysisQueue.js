import React, { useState, useEffect } from 'react';

export default function AnalysisQueue() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles/analysis')
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  const handleAnalysisSubmit = async (id, analysisResult) => {
    await fetch(`/api/articles/analysis/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ analysisResult }),
    });
    setArticles(articles.filter(article => article._id !== id));
  };

  return (
    <div>
      <h1>Analysis Queue</h1>
      <ul>
        {articles.map(article => (
          <li key={article._id}>
            <h2>{article.title}</h2>
            <textarea placeholder="Analysis Result" onBlur={(e) => handleAnalysisSubmit(article._id, e.target.value)}></textarea>
          </li>
        ))}
      </ul>
    </div>
  );
}

