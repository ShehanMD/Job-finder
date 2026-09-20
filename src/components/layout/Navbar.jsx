
// import React from "react";
// import styles from "./Navbar.module.css";

// export const Navbar = ({ 
//   isLoggedIn = false,
//   transparent = false,
//   onSignInClick,
//   onSignOutClick,
//   onNavClick
// }) => {
//   return (
//     <nav className={`${styles.navbar} ${transparent ? styles.transparent : ''}`}>
//       {/* if logged in show user icon */}
//       {isLoggedIn && (
//         <div className={styles.userIcon}>
//           👤
//         </div>
//       )}

//       <a 
//         href="/" 
//         className={styles.navLink}
//         onClick={() => navigate('/employer')} 
        
//       >
//         Home
//       </a>
//       <a 
//         href="/about" 
//         className={styles.navLink}
//         onClick={(e) => {
//           e.preventDefault();
//           if (onNavClick) onNavClick('yourJobs');
//         }}
//       >
//         About
//       </a>
//       <a 
//         href="/contact" 
//         className={styles.navLink}
//         onClick={(e) => {
//           e.preventDefault();
//           if (onNavClick) onNavClick('applications');
//         }}
//       >
//         Contact
//       </a>

//       {/* Sign Out / Sign In Button */}
//       {isLoggedIn ? (
//         <button className={styles.signInButton} onClick={onSignOutClick}>
//           Sign Out
//         </button>
//       ) : (
//         <button className={styles.signInButton} onClick={onSignInClick}>
//           Sign In
//         </button>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import styles from "./Navbar.module.css";

export const Navbar = ({ 
  isLoggedIn = false,
  transparent = false,
  onSignInClick,
  onSignOutClick,
  onNavClick
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`${styles.navbar} ${transparent ? styles.transparent : ''}`}>
      
      {/* 1. Logged in නම් User Icon එක (Mobile & Desktop දෙකේම එළියේ පෙනේ) */}
      {isLoggedIn && (
        <div className={styles.userIcon}>
          👤
        </div>
      )}

      {/* 2. Mobile වලදී විතරක් පෙනෙන Hamburger Icon එක */}
      <button 
        className={styles.hamburger} 
        onClick={toggleMenu} 
        aria-label="Toggle menu"
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>

      {/* 3. Navigation Links + Button Container */}
      <div className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
        <a 
          href="/" 
          className={styles.navLink}
          onClick={() => {
            closeMenu();
            if (typeof navigate !== 'undefined') navigate('/employer'); 
          }} 
        >
          Home
        </a>
        <a 
          href="/about" 
          className={styles.navLink}
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
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
            closeMenu();
            if (onNavClick) onNavClick('applications');
          }}
        >
          Contact
        </a>

        {/* Sign Out / Sign In Button */}
        {isLoggedIn ? (
          <button 
            className={styles.signInButton} 
            onClick={() => {
              closeMenu();
              if (onSignOutClick) onSignOutClick();
            }}
          >
            Sign Out
          </button>
        ) : (
          <button 
            className={styles.signInButton} 
            onClick={() => {
              closeMenu();
              if (onSignInClick) onSignInClick();
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;