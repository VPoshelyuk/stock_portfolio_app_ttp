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
import Portfolio from './Portfolio'
import Transactions from './Transactions'

import '../src/App.css'

class App extends React.Component {
  componentDidMount(){
    const token = localStorage.token
    if(token){
      fetch("https://stockr-api-app.herokuapp.com/api/v1/auto_login", {
        headers: {
          "authorization": token
        }
      })
      .then(res => res.json())
      .then(response =>{
        if (response.errors){
          alert(response.errors)
        } else {
          this.props.setUser(response.user)
          localStorage.token = response.token
        }
      })
    }
  }

  render() {
    return (
      <Fragment>
      {this.props.currentUser || !localStorage.token?
        <Router>
          <NavBar />
          <Route path="/logout">
              <LogOut/>
          </Route>
          <Route path="/login">
              {!this.props.currentUser ?
                <LogIn/>
                :
                <Redirect to="/" />
              }
          </Route>
          <Route path="/signup">
              {!this.props.currentUser ?
                <SignUp/>
                :
                <Redirect to="/" />
              }
          </Route>
          <Route path="/transactions">
              {this.props.currentUser ?
                  <Transactions />
                  :
                  <Redirect to="/" />
              }
          </Route>
          <Route exact path="/">
              {this.props.currentUser?
                  <Portfolio />
                  :
                  <Home/>
              }
          </Route>
        </Router>
        :
        <h1 align="center">Loading...</h1>
      }
      </Fragment>
    );
  }
}

function msp(state){
  return {
    currentUser: state.currentUser
  }
}

export default connect(msp, {setUser})(App)