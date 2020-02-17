import React from 'react';
import { Link } from 'react-router-dom'


const NotFound = () =>{
  return (
    <div className="main_card">
        <img className="logo404" src="./images/nav_logo.png" alt="stockr"/>
        <p className="form_name" align="center" style={{fontSize: "8vw"}}>Page Not Found!</p>
        <p className="welcome_message">Go to the <Link to="/login">home page</Link>.</p>
    </div>
  )
}

export default NotFound