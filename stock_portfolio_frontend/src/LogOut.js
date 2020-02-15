import React from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

import notification from "./misc/Notification"

const LogOut = ({setUser}) =>{
    setUser(null)
    localStorage.removeItem("token")
    notification("Successfully logged out!", "intro")
    return <Redirect to='/' />
}

function msp(state){
    return {
      currentUser: state.currentUser
    }
}

export default connect(msp, { setUser })(LogOut)