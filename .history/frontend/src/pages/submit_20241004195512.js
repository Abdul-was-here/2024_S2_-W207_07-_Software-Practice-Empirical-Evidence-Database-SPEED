import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter for navigation
import styles from './css/Submit.module.css'; // Ensure you have the correct CSS file
import Layout from './Layout'; // Import Layout component for consistent page structure

export default function Submit() {
  const [article, setArticle] = useState({ // State to store the submitted article data
    title: '',
    isbn: '',
    author: '',
    description: '',
    published_date: '',
    publisher: '',
    doi: '',
  });

  const router = useRouter(); // Get the router object for navigation
  const [isClient, setIsClient] = useState(false); // State to check if rendering on the client

  useEffect(() => {
    // Ensure the component is only rendered on the client side
    setIsClient(true);
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!token) {
      // If no token, redirect to login page
      router.push('/login');
    }
  }, [router]); // This effect runs whenever the router changes

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    const token = localStorage.getItem('token'); // Get token from localStorage again
    if (!token) {
      alert('You must be logged in to submit an article.'); // Alert the user if they are not logged in
      return;
    }

    console.log('Submitting Article:', article); // Log the article data for debugging

    // Send the article data to the API for submission
    const res = await fetch('/api/articles/submit', {
      method: 'POST', // Use POST method to submit the article
      headers: {
        'Content-Type': 'application/json', // Specify content type as JSON
        'Authorization': `Bearer ${token}`, // Include token in the Authorization header
      },
      body: JSON.stringify(article), // Convert article data to JSON
    });
  
    if (res.ok) {
      alert('Article submitted successfully!'); // Alert the user on successful submission
      // Reset the article state to clear the form
      setArticle({
        title: '',
        isbn: '',
        author: '',
        description: '',
        published_date: '',
        publisher: '',
        doi: '',
      });
    } else {
      alert('Failed to submit article'); // Alert the user on submission failure
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the input event
    setArticle({
      ...article, // Spread existing article data
      [name]: value, // Update the specific field being changed
    });
  };

  // Ensure the component is only rendered on the client side
  if (!isClient) {
    return null; // Render nothing if not on the client side
  }

  return (
    <Layout> {/* Wrap content with Layout component */}
      <div className={styles.container}> {/* Container for the submission form */}
        <h1>Submit an Article</h1> {/* Page title */}
        <form onSubmit={handleSubmit} className={styles.form}> {/* Submission form */}
          <input
            type="text"
            name="title" // The name attribute matches the state property
            value={article.title} // Bind the title state to the input field
            onChange={handleInputChange} // Handle input changes
            placeholder="Title" // Input field placeholder
            required // Make the input field required
            className={styles.input} // CSS class name
          />
          <input
            type="text"
            name="isbn" // The name attribute matches the state property
            value={article.isbn} // Bind the isbn state to the input field
            onChange={handleInputChange} // Handle input changes
            placeholder="ISBN" // Input field placeholder
            required // Make the input field required
            className={styles.input} // CSS class name
          />
          <input
            type="text"
            name="author" // The name attribute matches the state property
            value={article.author} // Bind the author state to the input field
            onChange={handleInputChange} // Handle input changes
            placeholder="Author" // Input field placeholder
            required // Make the input field required
            className={styles.input} // CSS class name
          />
          <textarea
            name="description" // The name attribute matches the state property
            value={article.description} // Bind the description state to the textarea
            onChange={handleInputChange} // Handle input changes
            placeholder="Description" // Placeholder text
            required // Make the textarea required
            className={styles.textarea} // CSS class name
          />
          <input
            type="date"
            name="published_date" // The name attribute matches the state property
            value={article.published_date} // Bind the published_date state to the input field
            onChange={handleInputChange} // Handle input changes
            className={styles.input} // CSS class name
          />
          <input
            type="text"
            name="publisher" // The name attribute matches the state property
            value={article.publisher} // Bind the publisher state to the input field
            onChange={handleInputChange} // Handle input changes
            placeholder="Publisher" // Input field placeholder
            required // Make the input field required
            className={styles.input} // CSS class name
          />
          <input
            type="text"
            name="doi" // The name attribute matches the state property
            value={article.doi} // Bind the doi state to the input field
            onChange={handleInputChange} // Handle input changes
            placeholder="DOI" // Input field placeholder
            required // Make the input field required
            className={styles.input} // CSS class name
          />
          <button type="submit" className={styles.button}>Submit</button> {/* Submit button */}
        </form>
      </div>
    </Layout>
  );
}
