import React, {Fragment} from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux'

const NavBar = ({currentUser}) => {
    return (
        <header>
            <div className="container">
                <Link to="/"><img className="logo" src="./images/nav_logo.png" alt="NavBar logo"/></Link>
                <nav>
                    <ul>
                        {!localStorage.token && !currentUser?
                        // chande navigation bar content depending on if user logged in or not
                        <Fragment>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
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
                                <Link to="/">Portfolio</Link>
                            </li>
                            <li>
                            <Link to="/transactions">Transactions</Link>
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
  