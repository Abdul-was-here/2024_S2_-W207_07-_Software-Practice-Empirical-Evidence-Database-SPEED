import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function ModerationQueue() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles/moderation')
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  // 审核通过
  const handleApprove = async (id) => {
    await fetch(`/api/articles/moderation/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'approve' }),
    });

    // 更新页面状态
    setArticles(articles.filter(article => article._id !== id)); // 从列表中移除已处理的文章
  };

  // 审核拒绝
  const handleReject = async (id) => {
    await fetch(`/api/articles/moderation/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'reject' }),
    });

    // 更新页面状态
    setArticles(articles.filter(article => article._id !== id)); // 从列表中移除已处理的文章
  };

  return (
    <Layout>
      <div>
        <h1>Moderation Queue</h1>
        <ul>
          {articles.map(article => (
            <li key={article._id}>
              <h2>{article.title}</h2>
              <p>{article.description}</p>
              {/* 审核按钮 */}
              <button onClick={() => handleApprove(article._id)}>Approve</button>
              <button onClick={() => handleReject(article._id)}>Reject</button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
