import React, {Fragment} from 'react';
import { Redirect, NavLink, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

class Home extends React.Component{
  render(){
    return (
      <div className="main_card">
          <p className="form_name" align="center" >Welcome to Stockr!</p>
          <p className="welcome_message">
            You are currently not logged in!<br />
            If you don't have an account with us, you can <Link to="/signup">sign up</Link>.<br />
            Or if you are a registered user, go to <Link to="/login">log in page</Link>.
          </p>
      </div>
    )
  }
}

function msp(state){
  return {
    currentUser: state.currentUser
  }
}

export default connect(msp, { setUser })(Home)