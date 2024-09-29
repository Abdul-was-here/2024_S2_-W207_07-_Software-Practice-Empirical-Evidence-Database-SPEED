
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout'; // Import the Layout component for consistent page structure

export default function ModerationQueue() {
  const [articles, setArticles] = useState([]); // State to store articles awaiting moderation

  useEffect(() => {
    // Fetch articles from the moderation API when the component mounts
    fetch('/api/articles/moderation')
      .then(res => res.json()) // Convert the response to JSON
      .then(data => setArticles(data)); // Update state with the fetched articles
  }, []); // Empty dependency array means this runs once when the component mounts

  // Approve an article
  const handleApprove = async (id) => {
    await fetch(`/api/articles/moderation/${id}`, {
      method: 'PUT', // Use PUT method to approve the article
      headers: {
        'Content-Type': 'application/json', // Specify content type as JSON
      },
      body: JSON.stringify({ action: 'approve' }), // Send approval action in the request body
    });

    // Update the local state by removing the approved article from the list
    setArticles(articles.filter(article => article._id !== id)); // Remove the processed article from the list
  };

  // Reject an article
  const handleReject = async (id) => {
    await fetch(`/api/articles/moderation/${id}`, {
      method: 'PUT', // Use PUT method to reject the article
      headers: {
        'Content-Type': 'application/json', // Specify content type as JSON
      },
      body: JSON.stringify({ action: 'reject' }), // Send rejection action in the request body
    });

    // Update the local state by removing the rejected article from the list
    setArticles(articles.filter(article => article._id !== id)); // Remove the processed article from the list
  };

  return (
    <Layout> {/* Wrap content with the Layout component */}
      <div>
        <h1>Moderation Queue</h1> {/* Page title */}
        <ul>
          {articles.map(article => ( // Map through the articles awaiting moderation to create list items
            <li key={article._id}> {/* Unique key for each list item */}
              <h2>{article.title}</h2> {/* Article title */}
              <p>{article.description}</p> {/* Article description */}
              {/* Approval and rejection buttons */}
              <button onClick={() => handleApprove(article._id)}>Approve</button> {/* Button to approve the article */}
              <button onClick={() => handleReject(article._id)}>Reject</button> {/* Button to reject the article */}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

