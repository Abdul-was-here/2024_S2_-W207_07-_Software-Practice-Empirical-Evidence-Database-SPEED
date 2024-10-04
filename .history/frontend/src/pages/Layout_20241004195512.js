import Link from 'next/link'; // Import Link component for page navigation
import { useState, useEffect, useCallback } from 'react'; // Import React hooks for state and lifecycle management
import { useRouter } from 'next/router'; // Import useRouter for programmatic navigation
import styles from './Layout.module.css'; 

export default function Layout({ children, hideMenu }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track the login status
  const [userRole, setUserRole] = useState(null); // State to track the user's role
  const router = useRouter(); // Get the router object for navigation

  // Handle user logout (wrapped in useCallback to avoid creating a new function on every render)
  const handleLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token'); // Remove the token from localStorage
    }
    setIsLoggedIn(false); // Set the login status to false
    setUserRole(null); // Clear the user role
    router.push('/login'); // Redirect to the login page
  }, [router]); // Include router as a dependency because it is used inside the function

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure the code only runs on the client side
      const token = localStorage.getItem('token'); // Get the JWT token from localStorage
      if (token) {
        try {
          const decodedToken = decodeToken(token); // Decode the token to get user information
          setIsLoggedIn(true); // Set the login status to true
          setUserRole(decodedToken.role); // Set the user role from the decoded token
        } catch (error) {
          console.error('Invalid token:', error); // Log token errors
          handleLogout(); // If the token is invalid or decoding fails, log the user out
        }
      }
    }
  }, [handleLogout]); // Include handleLogout as a dependency

  // Manually decode the JWT token
  const decodeToken = (token) => {
    const base64Url = token.split('.')[1]; // Get the payload part from the token
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert to base64 format
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); // Decode base64 into JSON format
    }).join(''));
    return JSON.parse(jsonPayload); // Parse the JSON string into an object
  };

  return (
    <div>
      <header className={styles.header}> {/* Header section */}
        {!hideMenu && ( // Conditionally render the menu based on the hideMenu prop
          <nav className={styles.navbar}>
            <ul className={styles.navList}> {/* Navigation list */}
              <li>
                <Link href="/">Home</Link> {/* Home link */}
              </li>
              <li>
                <Link href="/articles">Articles</Link> {/* Articles link */}
              </li>
              <li>
                <Link href="/search">Search</Link> {/* Search link */}
              </li>
              <li>
                <Link href="/submit">Submit Article</Link> {/* Submit article link */}
              </li>
              {isLoggedIn ? ( // Check if the user is logged in
                <>
                  <li className={styles.userRole}>
                    <span>{`Logged in as: ${userRole}`}</span> {/* Display the user role */}
                  </li>
                  <li>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button> {/* Logout button */}
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login">Login</Link> {/* Login link */}
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>
      <main className={styles.mainContent}> {/* Main content area */}
        {children} {/* Render child components */}
      </main>
    </div>
  );
}
