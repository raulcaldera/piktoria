import React from 'react';
import styles from "./Footer.module.css"


const Footer = () => {
    return(
        <div className={styles.footer}>
            <div className="container">
                <div className="row justify-content-center"> 
                    This is a footer  
                </div>
            </div> 
        </div>         
    );
}

export default Footer;