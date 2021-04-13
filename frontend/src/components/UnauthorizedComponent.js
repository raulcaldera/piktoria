import React from 'react';
import styles from "./Unauthorized.module.css";
import UnauthorizedImg from '../static/Unauthorized5.png';

const Unauthorized = () => {
    return (
        <div className="container-fluid">  
        <div className="row align-items-start">
            <div className={`${styles.unauthorized} col-12 col-md-6 offset-md-3`}>
                <img className={styles.unauthorizedImg} width="auto" max-height="50%" src={UnauthorizedImg} alt="Unauthorized"/>
                <h1>403 - Forbidden</h1>
                <p>Well, it seems like there is nothing to see here for you... </p>
            </div>          
        </div>                       
    </div>
    )    
}

export default Unauthorized;