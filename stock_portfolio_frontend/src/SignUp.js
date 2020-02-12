import React from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

class SignUp extends React.Component{
    state = {
        name: "",
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
        fetch("https://dashboard.heroku.com/api/v1/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(response => {
            if(response.errors){
                alert(response.errors)
            } else {
                this.props.setUser(response.user)
                localStorage.token = response.token
            }
        })
    }
    

    render(){
        return (
            <div className="main_card">
            <p className="form_name" align="center" >Sign Up</p>
            <form className="reg_form" onSubmit={this.handleSubmit}>
                <input className="input" type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name" />
                <input className="input" type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" />
                <input className="input" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                <input className="submit_button" type="submit" value="Sign Up" />
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

export default connect(msp, { setUser })(SignUp)