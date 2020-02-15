import React, {Fragment, useState, useEffect} from "react"
import { connect } from 'react-redux'
import { updatePortfolio, updateTransactions } from './redux/actions/user_actions'

import notification from "./misc/Notification"
import Stock from "./Stock";

const StocksContainer = ({ currentUser, portfolio, updatePortfolio, transactions, updateTransactions, mode}) => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        fetch(`https://stockr-api-app.herokuapp.com/api/v1/${mode === "portfolio" ? "user_all" : "user_recent"}`, {
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
                mode === "portfolio" ? updatePortfolio(response) : updateTransactions(response)
                setLoaded(true)
            }
        })
    }, [transactions])

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

export default connect(msp, { updatePortfolio, updateTransactions })(StocksContainer)