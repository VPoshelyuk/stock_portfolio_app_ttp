import React, {Fragment, useState, useEffect} from "react"
import { connect } from 'react-redux'

import notification from "../misc/Notification"
import Stock from "./Stock";

const StocksContainer = ({ currentUser, mode}) => {
    const [loaded, setLoaded] = useState(false)
    const [stocks, setStocks] = useState([])

    useEffect(() => {
        // in case user updates the page before promise resolves,
        // abort promise to prevent memory leaks in React
        const abortController = new AbortController()
        const signal = abortController.signal
        // fetch will depend on mode prop passed to distinguish
        // calls from transactions page & portolio page
        fetch(`https://stockr-api-app.herokuapp.com/api/v1/${mode === "portfolio" ? "user_all" : "user_recent"}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({user_id: currentUser.id}),
            signal: signal
        })
        .then(res => res.json())
        .then(response => {
            if(response.error){
                notification(response.error)
            } else {
                setStocks(response)
                setLoaded(true)
            }
        })
        .catch(err => {}) // catching possible aborting error
 
        return () => abortController.abort() //aborting unresolved promise on component unmount

    }, [currentUser.balance, currentUser.id, mode])

    return (
        <div className="stock_container">
            {loaded?
                <Fragment>
                    {stocks.map((stock, i) => <Stock key={`${stock.ticker}${mode === "portfolio" ? null : `-${stock.created_at}`}`} stock={stock} mode={mode}/>)}
                </Fragment>
                :
                <h1 align="center">Loading...</h1>
            }
        </div>
    );
}

function msp(state){
    return {
      currentUser: state.currentUser
    }
}

export default connect(msp)(StocksContainer)