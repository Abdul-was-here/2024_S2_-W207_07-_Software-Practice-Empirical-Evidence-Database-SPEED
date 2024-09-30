
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout'; // Import the Layout component for consistent page structure

export default function AnalysisQueue() {
  const [articles, setArticles] = useState([]); // State to store articles awaiting analysis

  useEffect(() => {
    // Fetch articles from the API when the component mounts
    fetch('/api/articles/analysis')  // Ensure the API path is correct
      .then(res => res.json()) // Convert the response to JSON
      .then(data => setArticles(data)); // Update state with the fetched articles
  }, []); // Empty dependency array means this runs once when the component mounts

  // Submit analysis result for a specific article
  const handleSubmitAnalysis = async (id, result) => {
    const res = await fetch(`/api/articles/analysis/${id}`, {
      method: 'PUT', // Use PUT method to update the analysis result
      headers: {
        'Content-Type': 'application/json', // Specify content type as JSON
      },
      body: JSON.stringify({ analysisResult: result }), // Use "approved" or "rejected" as analysis result
    });

    if (res.ok) {
      // If submission is successful, remove the article from the list
      setArticles(articles.filter(article => article._id !== id)); // Update the articles state
    } else {
      alert('Failed to submit analysis'); // Alert user on failure
    }
  };

  return (
    <Layout> {/* Wrap content with the Layout component */}
      <div>
        <h1>Analysis Queue</h1> {/* Page title */}
        <ul>
          {articles.map(article => (
            <li key={article._id}> {/* Unique key for each list item */}
              <h2>{article.title}</h2> {/* Article title */}
              <p>{article.description}</p> {/* Article description */}

              {/* Buttons to approve or reject the article */}
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
