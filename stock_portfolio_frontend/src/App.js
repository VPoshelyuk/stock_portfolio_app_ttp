import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

import NavBar from './NavBar'
import Home from './Home'
import LogIn from './LogIn'
import SignUp from './SignUp'
import LogOut from './LogOut'
import Profile from './Profile'

import '../src/App.css'

class App extends React.Component {
  componentDidMount(){
    const token = localStorage.token
    if(token){
      fetch("http://localhost:3000/api/v1/auto_login", {
        headers: {
          "authorization": token
        }
      })
      .then(res => res.json())
      .then(response =>{
        if (response.errors){
          alert(response.errors)
        } else {
          this.props.setUser(response)
          localStorage.token = response.token
        }
      })
    }
  }

  render() {
    return (
      <Router>
        <NavBar />
        <Route path="/logout">
            <LogOut/>
        </Route>
        <Route path="/login">
          {this.props.currentUser === null ?
            <LogIn/>
            :
            <Redirect to="/" />
          }
        </Route>
        <Route path="/signup">
          {this.props.currentUser === null ?
            <SignUp/>
            :
            <Redirect to="/" />
          }
        </Route>
        <Route path="/profile">
            {this.props.currentUser !== null ?
                <Profile />
                :
                <Redirect to="/" />
            }
        </Route>
        <Route path="/">
            <Home/>
        </Route>
      </Router>
    );
  }
}

function msp(state){
  return {
    currentUser: state.currentUser
  }
}

export default connect(msp, {setUser})(App)