import React from 'react';
import styles from "./Footer.module.css"


const Footer = () => {
    return(
        <div className={styles.footer}>
            <div className={`container-fluid" ${styles.footerContainer}`}>
                    <span className={styles.author}>
                        By Raül Caldera Sànchez
                    </span> 
                    <a className={`btn btn-social-icon btn-github ${styles.github}`} href="https://github.com/raulcaldera/web-project" target="_blank" rel="noopener noreferrer"><i className="fa fa-github"></i></a>
                    <a className={`btn btn-social-icon btn-linkedin ${styles.linkedin}`} href="https://www.linkedin.com/in/ra%C3%BCl-caldera-s%C3%A0nchez-77368014b/" target="_blank" rel="noopener noreferrer"><i className="fa fa-linkedin"></i></a>     
                    
   
            </div> 
        </div>         
    );
}

export default Footer;