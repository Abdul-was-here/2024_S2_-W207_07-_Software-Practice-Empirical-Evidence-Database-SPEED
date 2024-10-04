import React, { useState, useEffect } from 'react';
import Layout from './Layout'; // Import Layout component to maintain consistent page structure

export default function AnalysisQueue() {
  const [articles, setArticles] = useState([]); // State to store articles awaiting analysis
  const [isClient, setIsClient] = useState(false); // State to check if rendering on the client

  useEffect(() => {
    // Ensure the component is rendered on the client side
    setIsClient(true);

    // Fetch articles awaiting analysis from the API when the component mounts
    fetch('/api/articles/analysis')  // Ensure the API path is correct
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch articles');
        }
        return res.json();
      })
      .then((data) => setArticles(data))
      .catch((err) => {
        console.error(err);
        alert('Failed to load analysis queue');
      });
  }, []); // Empty dependency array means this useEffect runs only once when the component mounts

  // Submit the analysis result for a specific article
  const handleSubmitAnalysis = async (id, result) => {
    try {
      const res = await fetch(`/api/articles/analysis/${id}`, {
        method: 'PUT', // Use PUT method to update the analysis result
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify({ analysisResult: result }), // Send 'approved' or 'rejected' as the analysis result
      });

      if (res.ok) {
        // Optimistically update the UI by removing the analyzed article
        setArticles(articles.filter((article) => article._id !== id)); // Update the articles state
      } else {
        alert('Failed to submit analysis'); // Alert the user if the submission fails
      }
    } catch (error) {
      console.error('Error during analysis submission:', error);
      alert('An error occurred while submitting the analysis.');
    }
  };

  // Ensure the component only renders on the client side
  if (!isClient) {
    return null; // Return nothing if not rendering on the client
  }

  return (
    <Layout> {/* Wrap content in Layout component */}
      <div>
        <h1>Analysis Queue</h1> {/* Page title */}
        {articles.length > 0 ? (
          <ul>
            {articles.map((article) => (
              <li key={article._id}> {/* Assign a unique key to each list item */}
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
        ) : (
          <p>No articles awaiting analysis.</p> 
        )}
      </div>
    </Layout>
  );
}
