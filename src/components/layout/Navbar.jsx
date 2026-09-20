/*import React from "react";
import styles from "./Navbar.module.css";

export const Navbar = ({ onSignInClick }) => {
    return (
    <nav className={styles.navbar}>
        <a href="/" className={styles.navLink}>Home</a>
        <a href="/about" className={styles.navLink}>About</a>
        <a href="/contact" className={styles.navLink}>Contact</a>
        <button className={styles.signInButton} onClick = {onSignInClick}>Sign In</button>
    </nav>
    )
}

export default Navbar;
*/
import React from "react";
import styles from "./Navbar.module.css";

export const Navbar = ({ 
  isLoggedIn = false,
  transparent = false,
  onSignInClick,
  onSignOutClick,
  onNavClick
}) => {
  return (
    <nav className={`${styles.navbar} ${transparent ? styles.transparent : ''}`}>
      {/* if logged in show user icon */}
      {isLoggedIn && (
        <div className={styles.userIcon}>
          👤
        </div>
      )}

      <a 
        href="/" 
        className={styles.navLink}
        onClick={() => navigate('/employer')} 
        
      >
        Home
      </a>
      <a 
        href="/about" 
        className={styles.navLink}
        onClick={(e) => {
          e.preventDefault();
          if (onNavClick) onNavClick('yourJobs');
        }}
      >
        About
      </a>
      <a 
        href="/contact" 
        className={styles.navLink}
        onClick={(e) => {
          e.preventDefault();
          if (onNavClick) onNavClick('applications');
        }}
      >
        Contact
      </a>

      {/* Sign Out / Sign In Button */}
      {isLoggedIn ? (
        <button className={styles.signInButton} onClick={onSignOutClick}>
          Sign Out
        </button>
      ) : (
        <button className={styles.signInButton} onClick={onSignInClick}>
          Sign In
        </button>
      )}
    </nav>
  );
};

export default Navbar;