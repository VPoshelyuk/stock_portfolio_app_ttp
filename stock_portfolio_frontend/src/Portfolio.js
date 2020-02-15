import React, {Fragment} from "react"
import { connect } from 'react-redux'
import { setUser, updateBalance, updatePortfolio, updateTransactions } from './redux/actions/user_actions'

import notification from "./misc/Notification"

import StocksContainer from './StocksContainer'

class Portfolio extends React.Component{
    state = {
        ticker: "",
        quantity: "",
        current_buy: {}
    }

    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        let tickerRegex = /^[a-zA-Z0-9]*$/
        let qtyRegex = /^[1-9]\d*$/
        if(!tickerRegex.test(e.target[0].value)){
            notification("Ticker symbol should consist of</br> letters and/or numbers only!")
        }else if(!qtyRegex.test(e.target[1].value)){
            notification("Quantity should be a whole positive number!")
        }else{
            fetch("https://stockr-api-app.herokuapp.com/api/v1/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({...this.state, user_balance: this.props.currentUser.balance})
            })
            .then(res => res.json())
            .then(response => {
                if(response.error){
                    notification(response.error)
                } else {
                    this.setState({
                        current_buy: {
                            stock_info: response.stock_info,
                            new_balance: response.new_balance
                        }
                    })
                    notification(response.message, "confirm", this.handleConfirmation)
                }
            })

        }
    }

    handleConfirmation = (notif) => {
        fetch("https://stockr-api-app.herokuapp.com/api/v1/user_stocks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                user_id: this.props.currentUser.id,
                ticker: this.state.ticker.toUpperCase(),
                quantity: this.state.quantity,
                price: this.state.current_buy.stock_info.latestPrice,
                status: "BUY"
            })
        })
        .then(res => res.json())
        .then(response => {
            if(response.errors){
                response.errors.forEach(error => {
                    notification(error)
                });
            } else {
                notification(`Successfully bought ${this.state.quantity} stocks of ${this.state.ticker.toUpperCase()}`)
                this.props.updateTransactions(response)
            }
        })
        fetch(`https://stockr-api-app.herokuapp.com/api/v1/update_balance`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                id: this.props.currentUser.id,
                balance: this.state.current_buy.new_balance
            })
        })
        .then(res => res.json())
        .then(response => {
            if(response.errors){
                response.errors.forEach(error => {
                    notification(error)
                });
            } else {
                this.props.updateBalance(response.new_balance)
                notif.close()
            }
        })
    }

    render(){
        return (
            <Fragment>
                <div className="portfolio_main">
                    <div className="stocks_info">
                        <StocksContainer mode={"portfolio"} />
                    </div>
                    <div className="buy_info">
                        <form className="buy_form" onSubmit={this.handleSubmit}>
                        <p className="form_name" align="center" >Cash - ${this.props.currentUser.balance}</p>
                            <input 
                                className="input"
                                style={{margin: "10px auto"}}
                                type="text" 
                                name="ticker" 
                                value={this.state.ticker} 
                                onChange={this.handleChange} 
                                placeholder="Ticker" 
                            />
                            <input 
                                className="input"
                                style={{margin: "10px auto"}} 
                                type="text"
                                name="quantity" 
                                value={this.state.quantity} 
                                onChange={this.handleChange} 
                                placeholder="Qty." 
                            />
                            <input 
                                className="submit_button" 
                                style={{margin: "10%"}}
                                type="submit" 
                                value="Buy" 
                            />
                        </form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

function msp(state){
    return {
      currentUser: state.currentUser
    }
  }
  
  export default connect(msp, {setUser, updateBalance, updatePortfolio, updateTransactions })(Portfolio)
