
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Navigate to User Profile
  const handleProfileClick = (e) => {
    e.preventDefault();
    closeMenu();

    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate("/profile");
    }
  };

  // Navigate to Home
  const handleScrollToHome = (e) => {
    closeMenu();

    if (
      window.location.pathname === "/" ||
      window.location.pathname === ""
    ) {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  // Navigate / Scroll to About
  const handleScrollToAbout = (e) => {
    closeMenu();

    const aboutSection = document.getElementById("about-section");

    if (aboutSection) {
      e.preventDefault();

      aboutSection.scrollIntoView({
        behavior: "smooth"
      });
    } else {
      window.location.href = "/#about-section";
    }
  };

  const isNavbarTransparent = isLoggedIn || transparent;

  return (
    <nav
      className={`${styles.navbar} ${
        isNavbarTransparent ? styles.transparent : ""
      }`}
    >
      {/* User Profile - Left Side */}
      {isLoggedIn && (
        <div className={styles.userIconWrapper}>
          <a
            href="/profile"
            className={styles.userIcon}
            onClick={handleProfileClick}
            title="View Profile"
            aria-label="View Profile"
          >
            👤
          </a>
        </div>
      )}

      {/* Navigation - Right Side */}
      <div className={styles.navRight}>
        <div
          id="main-navigation"
          className={`${styles.navMenu} ${
            isOpen ? styles.active : ""
          }`}
        >
          {/* Home */}
          <a
            href="/"
            className={styles.navLink}
            onClick={handleScrollToHome}
          >
            Home
          </a>

          {/* About */}
          <a
            href="#about-section"
            className={styles.navLink}
            onClick={handleScrollToAbout}
          >
            About
          </a>

          {/* Contact */}
          <a
            href="/contact"
            className={styles.navLink}
            onClick={closeMenu}
          >
            Contact
          </a>

          {/* Sign In / Sign Out */}
          {isLoggedIn ? (
            <button
              type="button"
              className={styles.signInButton}
              onClick={() => {
                closeMenu();

                if (onSignOutClick) {
                  onSignOutClick();
                }
              }}
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              className={styles.signInButton}
              onClick={() => {
                closeMenu();

                if (onSignInClick) {
                  onSignInClick();
                }
              }}
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className={`${styles.hamburger} ${
            isOpen ? styles.hamburgerActive : ""
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="main-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
