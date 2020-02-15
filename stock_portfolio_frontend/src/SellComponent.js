import React, {useState} from "react"
import { connect } from 'react-redux'
import { updateBalance, updateTransactions } from './redux/actions/user_actions'

import notification from "./misc/Notification"

const SellComponent = ({currentUser, updateBalance, updateTransactions, stock, triggerPopUp}) => {
    const [availableStocks, setAvailableStocks] = useState(0)

    const handleChange = (e) => {
        if(availableStocks < parseInt(stock.quantity) && e.target.innerText === "+"){
            setAvailableStocks(availableStocks + 1)
        }else if(availableStocks > 0  && e.target.innerText === "-"){
            setAvailableStocks(availableStocks - 1)
        }
    }

    const handleConfirm = () => {
        if(availableStocks > 0){
            fetch("https://stockr-api-app.herokuapp.com/api/v1/user_stocks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    ticker: stock.ticker,
                    quantity: availableStocks,
                    price: stock.current_price,
                    status: "SELL"
                })
            })
            .then(res => res.json())
            .then(response => {
                if(response.errors){
                    response.errors.forEach(error => {
                        notification(error)
                    });
                } else {
                    updateTransactions(response)
                }
            })
            fetch(`https://stockr-api-app.herokuapp.com/api/v1/update_balance`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    id: currentUser.id,
                    balance: (parseFloat(currentUser.balance) + availableStocks * parseFloat(stock.current_price)).toFixed(2)
                })
            })
            .then(res => res.json())
            .then(response => {
                if(response.errors){
                    response.errors.forEach(error => {
                        notification(error)
                    });
                } else {
                    updateBalance(response.new_balance)
                }
            })
        }
        triggerPopUp()
    }


    return (
        <div className="popup_wrap">
            <div className="sell_card">
                <p className="sell_form_name" align="center" >Do you really want to sell this stock?</p>
                <p align="center">
                The stork you chose to sell is: {stock.companyName}({stock.ticker})<br />
                Current price for this stock is: ${stock.current_price}<br />
                You have {stock.quantity} available.
                </p>
                <div className="sell_wrap">
                    <div className="sell_info">
                        <button style={{fontSize: "1.5rem"}} onClick={handleChange}>-</button>
                        <p style={{fontSize: "2rem", margin: "0 2vw"}}>{availableStocks}</p>
                        <button style={{fontSize: "1.5rem"}} onClick={handleChange}>+</button>
                    </div>
                    <h1 align="center">You will earn: ${(availableStocks * parseFloat(stock.current_price)).toFixed(2)}</h1>
                    <div className="sell_buttons">
                        <button style={{fontSize: "1.5rem"}} onClick={handleConfirm}>Confirm</button>
                        <button style={{fontSize: "1.5rem"}} onClick={() => triggerPopUp()}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function msp(state){
    return {
        currentUser: state.currentUser
    }
}

export default connect(msp, { updateBalance, updateTransactions })(SellComponent)