import React from "react";
import styles from "./Navbar.module.css";

export const Navbar = () => {
    return (
    <nav className={styles.navbar}>
        <a href="/" className={styles.navLink}>Home</a>
        <a href="/contact" className={styles.navLink}>Contact</a>
        <a href="/about" className={styles.navLink}>About</a>
        <button className={styles.signInButton}>Sign In</button>
    </nav>
    )
}

export default Navbar;