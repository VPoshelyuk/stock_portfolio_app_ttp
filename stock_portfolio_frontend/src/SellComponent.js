import React, {Fragment} from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser, updateBalance, updatePortfolio } from './redux/actions/user_actions'

import Noty from 'noty';  
import "../node_modules/noty/lib/noty.css";  
import "../node_modules/noty/lib/themes/mint.css";

class SellComponent extends React.Component{
    state = {
        availableStocks: 0
    }

    handleIncrease = () => {
        if(this.state.availableStocks < parseInt(this.props.stock.quantity)){
            this.setState({
                availableStocks: this.state.availableStocks + 1
            })
        }
    }

    handleDecrease = () => {
        if(this.state.availableStocks > 1){
            this.setState({
                availableStocks: this.state.availableStocks - 1
            })
        }
    }

    handleConfirm = () => {
        fetch("http://localhost:3000/api/v1/user_stocks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                user_id: this.props.currentUser.id,
                ticker: this.props.stock.ticker,
                quantity: this.state.availableStocks,
                price: this.props.stock.current_price,
                status: "SELL"
            })
        })
        .then(res => res.json())
        .then(response => {
            if(response.errors){
                response.errors.forEach(error => {
                    new Noty({  
                        text: `${error}`,
                        layout: "bottomRight",
                        type: "alert",
                        timeout: 5000,
                        progressBar: false,
                        closeWith: ["click", "button"]
                    }).show()
                });
            } else {
                fetch("http://localhost:3000/api/v1/user_all", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({user_id: this.props.currentUser.id})
                })
                .then(res => res.json())
                .then(resp => {
                    if(resp.error){
                        new Noty({  
                            text: `${resp.error}`,
                            layout: "bottomRight",
                            type: "alert",
                            timeout: 5000,
                            progressBar: false,
                            closeWith: ["click", "button"]
                        }).show()
                    } else {
                        this.props.updatePortfolio(resp)
                    }
                })
                new Noty({  
                    text: `Successfully sold ${this.state.availableStocks} stocks of ${this.props.stock.ticker}`,
                    layout: "bottomRight",
                    type: "success",
                    timeout: 5000,
                    progressBar: false,
                    closeWith: ["click", "button"]
                }).show()
            }
        })
        fetch(`http://localhost:3000/api/v1/users/${this.props.currentUser.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                balance: (parseFloat(this.props.currentUser.balance) + this.state.availableStocks * parseFloat(this.props.stock.current_price)).toFixed(2)
            })
        })
        .then(res => res.json())
        .then(response => {
            if(response.errors){
                response.errors.forEach(error => {
                    new Noty({  
                        text: `${error}`,
                        layout: "bottomRight",
                        type: "alert",
                        timeout: 5000,
                        progressBar: false,
                        closeWith: ["click", "button"]
                    }).show()
                });
            } else {
                this.props.updateBalance(response.new_balance)
            }
        })
        this.props.triggerPopUp()
    }


    render(){
        console.log(this.props)
        return (
        <div className="popup_wrap">
            <div className="sell_card">
                <p className="sell_form_name" align="center" >Do you really want to sell this stock?</p>
                <p align="center">
                The stork you chose to sell is: {this.props.stock.companyName}({this.props.stock.ticker})<br />
                Current price for this stock is: ${this.props.stock.current_price}<br />
                You have {this.props.stock.quantity} available.
                </p>
                <div className="sell_wrap">
                    <div className="sell_info">
                        <button style={{fontSize: "1.5rem"}} onClick={this.handleDecrease}>-</button>
                        <p style={{fontSize: "2rem", margin: "0 2vw"}}>{this.state.availableStocks}</p>
                        <button style={{fontSize: "1.5rem"}} onClick={this.handleIncrease}>+</button>
                    </div>
                    <h1 align="center">You will earn: ${(this.state.availableStocks * parseFloat(this.props.stock.current_price)).toFixed(2)}</h1>
                    <div className="sell_buttons">
                        <button style={{fontSize: "1.5rem"}} onClick={this.handleConfirm}>Confirm</button>
                        <button style={{fontSize: "1.5rem"}} onClick={() => this.props.triggerPopUp()}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

function msp(state){
    return {
      currentUser: state.currentUser
    }
}

export default connect(msp, { setUser, updateBalance, updatePortfolio })(SellComponent)