import React, {Fragment} from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser, updatePortfolio, updateTransactions } from './redux/actions/user_actions'

import Noty from 'noty';  
import "../node_modules/noty/lib/noty.css";  
import "../node_modules/noty/lib/themes/mint.css";
import Stock from "./Stock";

class StocksContainer extends React.Component{
    state = {
        loaded: false
    }
    componentDidMount(){
        if(this.props.mode === "portfolio"){
            fetch("https://stockr-api-app.herokuapp.com/api/v1/user_all", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({user_id: this.props.currentUser.id})
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
                    this.props.updatePortfolio(response)
                    this.setState({
                        loaded: true
                    })
                }
            })
        }else if(this.props.mode === "transactions"){
            fetch("https://stockr-api-app.herokuapp.com/api/v1/user_recent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({user_id: this.props.currentUser.id})
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
                    this.props.updateTransactions(response)
                    this.setState({
                        loaded: true
                    })
                }
            })
        }
    }

    render(){
        console.log(this.props)
        return (
        <div className="stock_container">
            {this.state.loaded?
                <Fragment>
                    {this.props.mode === "portfolio" ?
                        this.props.portfolio.map(stock => <Stock key={stock.ticker} stock={stock} mode={this.props.mode}/>)
                        :
                        this.props.transactions.map(stock => <Stock key={`${stock.ticker}-${stock.created_at}`} stock={stock} mode={this.props.mode}/>)

                    }
                </Fragment>
                :
                <h1 align="center">Loading...</h1>
            }
        </div>
        );
    }
}

function msp(state){
    return {
      currentUser: state.currentUser,
      portfolio: state.portfolio,
      transactions: state.transactions
    }
}

export default connect(msp, { setUser, updatePortfolio, updateTransactions })(StocksContainer)