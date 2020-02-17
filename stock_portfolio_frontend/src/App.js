import React, { Fragment, useEffect } from "react"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

import NavBar from './NavBar'
import Home from './Home'
import NotFound from './NotFound'
import LogIn from './Containers/Auth/LogIn'
import SignUp from './Containers/Auth/SignUp'
import LogOut from './Containers/Auth/LogOut'
import Portfolio from './Containers/Portfolio'
import Transactions from './Containers/Transactions'

import '../src/App.css'

const App = ({setUser, currentUser}) => {

  useEffect(() => {
    // on component mount check for token, if exists verify on the backeend
    if(localStorage.token === "undefined")localStorage.removeItem("token")
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
          setUser(response.user)
          localStorage.token = response.token
        }
      })
    }
  // eslint-disable-next-line
  }, [])

  return (
    <Fragment>
    {currentUser || !localStorage.token?
    // Router and Switch used together to render 404 only when there are no matching routes
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/logout">
              <LogOut/>
          </Route>
          <Route exact path="/login">
              {!currentUser ?
                <LogIn/>
                :
                <Redirect to="/" />
              }
          </Route>
          <Route exact path="/signup">
              {!currentUser ?
                <SignUp/>
                :
                <Redirect to="/" />
              }
          </Route>
          <Route exact path="/transactions">
              {currentUser ?
                  <Transactions />
                  :
                  <Redirect to="/" />
              }
          </Route>
          <Route exact path="/">
              {currentUser?
                  <Portfolio />
                  :
                  <Home/>
              }
          </Route>
          <Route exact path="/404">
              <NotFound />
          </Route>
          <Route>
              <Redirect to="/404" />
          </Route>
        </Switch>
      </Router>
      :
      <h1 align="center">Loading...</h1>
    }
    </Fragment>
  );

}

function msp(state){
  return {
    currentUser: state.currentUser
  }
}

export default connect(msp, {setUser})(App)