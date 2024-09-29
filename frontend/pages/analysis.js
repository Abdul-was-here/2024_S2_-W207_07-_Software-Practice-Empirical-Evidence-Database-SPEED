import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function AnalysisQueue() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles/analysis')  // 确保请求正确的 API 路径
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  // 提交分析结果
  const handleSubmitAnalysis = async (id, result) => {
    const res = await fetch(`/api/articles/analysis/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ analysisResult: result }), // 使用 "approved" 或 "rejected" 作为分析结果
    });

    if (res.ok) {
      // 如果提交成功，则从列表中移除该文章
      setArticles(articles.filter(article => article._id !== id));
    } else {
      alert('Failed to submit analysis');
    }
  };

  return (
    <Layout>
      <div>
        <h1>Analysis Queue</h1>
        <ul>
          {articles.map(article => (
            <li key={article._id}>
              <h2>{article.title}</h2>
              <p>{article.description}</p>

              <button onClick={() => handleSubmitAnalysis(article._id, 'approved')}>
              Approve
              </button>
              <button onClick={() => handleSubmitAnalysis(article._id, 'rejected')}>
              Reject
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
