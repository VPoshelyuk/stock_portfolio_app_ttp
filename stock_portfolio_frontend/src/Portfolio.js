import React, {Fragment} from "react";
import { Redirect } from "react-router-dom"
import { connect } from 'react-redux'
import { setUser, updateBalance, updatePortfolio } from './redux/actions/user_actions'

import Noty from 'noty';  
import "../node_modules/noty/lib/noty.css";  
import "../node_modules/noty/lib/themes/mint.css";

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
        let qtyRegex = /^[1-9]\d*$/
        if(qtyRegex.test(e.target[1].value)){
            fetch("https://dashboard.heroku.com/api/v1/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({...this.state, user_balance: this.props.currentUser.balance})
            })
            .then(res => res.json())
            .then(response => {
                console.log(response)
                if(response.error){
                    new Noty({  
                        text: `${response.error}`,
                        layout: "bottomRight",
                        type: "alert",
                        timeout: 5000,
                        progressBar: false,
                        closeWith: ["click", "button"]
                    }).show()
                } else {
                    this.setState({
                        current_buy: {
                            stock_info: response.stock_info,
                            new_balance: response.new_balance
                        }
                    })
                    let notif = new Noty({  
                        text: `${response.message}`,
                        layout: "bottomRight",
                        buttons: [
                            Noty.button('YES', 'btn btn-success', () => this.handleConfirmation(notif)),
                            Noty.button('NO', 'btn btn-error', function () {notif.close()})
                          ]
                      }).show()
                }
            })
        }else{
            new Noty({  
                text: `Quantity should be a whole positive number`,
                layout: "bottomRight",
                type: "alert",
                timeout: 5000,
                progressBar: false,
                closeWith: ["click", "button"]
            }).show()
        }
    }

    handleConfirmation = (notif) => {
        fetch("https://dashboard.heroku.com/api/v1/user_stocks", {
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
                fetch("https://dashboard.heroku.com/api/v1/user_all", {
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
                    text: `Successfully bought ${this.state.quantity} stocks of ${this.state.ticker}`,
                    layout: "bottomRight",
                    type: "success",
                    timeout: 5000,
                    progressBar: false,
                    closeWith: ["click", "button"]
                }).show()
            }
        })
        fetch(`https://dashboard.heroku.com/api/v1/users/${this.props.currentUser.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                balance: this.state.current_buy.new_balance
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
  
  export default connect(msp, {setUser, updateBalance, updatePortfolio})(Portfolio)
