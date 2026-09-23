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

  // So gollotooɗo naatii (isLoggedIn), wonta transparent. So naanaani, wonta blur.
  const isNavbarTransparent = isLoggedIn || transparent;

  return (
    <nav className={`${styles.navbar} ${isNavbarTransparent ? styles.transparent : ''}`}>
      
      {/* User Icon so a naatii */}
      {isLoggedIn && (
        <div 
          className={styles.userIcon} 
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
          title="View Profile"
        >
          👤
        </div>
      )}

      {/* Navigation Menu */}
      <div className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
        <a 
          href="/" 
          className={styles.navLink}
          onClick={() => closeMenu()} 
        >
          Home
        </a>

        <a 
          href="/about" 
          className={styles.navLink}
          onClick={() => closeMenu()}
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