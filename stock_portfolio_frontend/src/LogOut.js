import React from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

const LogOut = ({setUser}) =>{
    setUser(null)
    localStorage.removeItem("token")
    return <Redirect to='/' />
}

function msp(state){
    return {
      currentUser: state.currentUser
    }
}

export default connect(msp, { setUser })(LogOut)