import React, {Fragment, useState, useEffect} from "react"
import { connect } from 'react-redux'
import { updatePortfolio, setTransactions } from './redux/actions/user_actions'

import notification from "./misc/Notification"
import Stock from "./Stock";

const StocksContainer = ({ currentUser, portfolio, updatePortfolio, transactions, setTransactions, mode}) => {
    const [loaded, setLoaded] = useState(false)
    const dependence = mode === "portfolio" ? 
        ["user_all", transactions, updatePortfolio]
        : 
        ["user_recent", null, setTransactions]
    useEffect(() => {
        fetch(`https://stockr-api-app.herokuapp.com/api/v1/${dependence[0]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({user_id: currentUser.id})
        })
        .then(res => res.json())
        .then(response => {
            if(response.error){
                notification(response.error)
            } else {
                dependence[2](response)
                setLoaded(true)
            }
        })
    // eslint-disable-next-line
    }, [dependence[1]])

    return (
        <div className="stock_container">
            {loaded?
                <Fragment>
                    {mode === "portfolio" ?
                        portfolio.map(stock => <Stock key={stock.ticker} stock={stock} mode={mode}/>)
                        :
                        transactions.map(stock => <Stock key={`${stock.ticker}-${stock.created_at}`} stock={stock} mode={mode}/>)
                    }
                </Fragment>
                :
                <h1 align="center">Loading...</h1>
            }
        </div>
    );
}

function msp(state){
    return {
      currentUser: state.currentUser,
      portfolio: state.portfolio,
      transactions: state.transactions
    }
}

export default connect(msp, { updatePortfolio, setTransactions })(StocksContainer)