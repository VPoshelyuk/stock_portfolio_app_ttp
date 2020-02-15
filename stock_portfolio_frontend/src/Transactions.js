import React, {Fragment} from "react"
import { connect } from 'react-redux'
import StocksContainer from './StocksContainer'

const Transactions = ({currentUser}) =>{
    return (
        <Fragment>
            <div className="portfolio_main">
                <div className="stocks_info">
                    <StocksContainer mode={"transactions"} />
                </div>
                <div className="user_info">
                    <img className="profile_pic" src="./images/wolf_of_wall_st.jpg" alt="Profile"/>
                    <p className="user_info_text">
                        Hi, {currentUser.name}!<br />
                        Your e-mail: {currentUser.email}<br />
                        Your current balance is: ${currentUser.balance}
                    </p>
                </div>
            </div>
        </Fragment>
    );
}

function msp(state){
    return {
        currentUser: state.currentUser
    }
}

export default connect(msp)(Transactions)