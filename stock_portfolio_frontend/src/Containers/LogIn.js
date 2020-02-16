import React from "react"
import { connect } from 'react-redux'
import { setUser } from '../redux/actions/user_actions'

import notification from "../misc/Notification"

class LogIn extends React.Component{
  state = {
    email: "",
    password: ""
  }
  
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  
  handleSubmit = (e) => {
    e.preventDefault()
    fetch("https://stockr-api-app.herokuapp.com/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email.toLowerCase(),
        password: this.state.password
      })
    })
    .then(res => res.json())
    .then(response => {
      if (response.errors){
        notification(response.errors, "intro")
      } else {
        this.props.setUser(response.user)
        localStorage.token = response.token
      }
    })
  }

  render(){
      return (
      <div className="main_card">
          <p className="form_name" align="center" >Log In</p>
          <form className="reg_form" onSubmit={this.handleSubmit}>
              <input 
                className="input" 
                type="email" 
                name="email" 
                value={this.state.email} 
                onChange={this.handleChange} 
                placeholder="Email" 
              />
              <input className="input" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
              <input className="submit_button" type="submit" value="Log In" />
          </form>
      </div>
      );
  }
}

function msp(state){
  return {
    currentUser: state.currentUser
  }
}

export default connect(msp, { setUser })(LogIn)