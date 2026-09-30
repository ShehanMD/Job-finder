import React, { useState } from "react";
import styles from "./Navbar.module.css";

export const Navbar = ({ 
  isLoggedIn = false,
  transparent = false,
  onSignInClick,
  onSignOutClick,
  onNavClick,
  onProfileClick
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleProfileClick = () => {
    closeMenu();
    if (onProfileClick) {
      onProfileClick();
    } else if (onNavClick) {
      onNavClick('profile');
    }
  };


  const handleScrollToHome = (e) => {
    closeMenu();
    
   
    if (window.location.pathname === '/' || window.location.pathname === '') {
      e.preventDefault(); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
    
  };


  const handleScrollToAbout = (e) => {
    closeMenu();
    
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      e.preventDefault();
      aboutSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#about-section";
    }
  };

  const isNavbarTransparent = isLoggedIn || transparent;

  return (
    <nav className={`${styles.navbar} ${isNavbarTransparent ? styles.transparent : ''}`}>
      
      {/* User Icon */}
      {isLoggedIn && (
        <div className={styles.userIconWrapper}>
          <a
            href="/profile"
            className={styles.userIcon}
            onClick={handleProfileClick}
            title="View Profile"
          >
            👤
          </a>
        </div>
      )}

      {/* Navigation Menu */}
      <div className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
        
        <a 
          href="/" 
          className={styles.navLink}
          onClick={handleScrollToHome}
        >
          Home
        </a>

        {/* About Link */}
        <a 
          href="#about-section" 
          className={styles.navLink}
          onClick={handleScrollToAbout}
        >
          About
        </a>

        <a 
          href="/contact" 
          className={styles.navLink}
          onClick={() => closeMenu()}
        >
          Contact
        </a>

        {/* Button Sign In / Sign Out */}
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