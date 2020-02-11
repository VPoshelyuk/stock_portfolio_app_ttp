import React, {Fragment} from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux'

function NavBar (props) {
    return (
        <header>
            <div className="container">
                <Link to="/"><img className="logo" src="./images/nav_logo.png" alt="NavBar logo"/></Link>
                <nav>
                    <ul>
                        <li>
                        <Link to="/">Home</Link>
                        </li>
                        {props.currentUser === null ?
                        <Fragment>
                            <li>
                            <Link to="/login">Log In</Link>
                            </li>
                            <li>
                            <Link to="/signup">Sign Up</Link>
                            </li>
                        </Fragment>
                        :
                        <Fragment>
                            <li>
                            <Link to="/profile">{props.currentUser.name}</Link>
                            </li>
                            <li>
                            <Link to="/logout">Log Out</Link>
                            </li>
                        </Fragment>
                        }
                    </ul>
                </nav>
            </div>
        </header>
    );
}

function msp(state){
    return {
      currentUser: state.currentUser
    }
  }
  
export default connect(msp)(NavBar)
  