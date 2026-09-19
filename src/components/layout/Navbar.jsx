import React from "react";
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