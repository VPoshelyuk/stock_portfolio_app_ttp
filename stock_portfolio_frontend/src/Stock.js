import React, {Fragment} from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser, updatePortfolio } from './redux/actions/user_actions'

import Noty from 'noty';  
import "../node_modules/noty/lib/noty.css";  
import "../node_modules/noty/lib/themes/mint.css";

import SellComponent from './SellComponent'

class Stock extends React.Component{
    state = {
        triggerComponent: false
    }

    triggerPopUp = () => {
        this.setState({
            triggerComponent: !this.state.triggerComponent
        })
    }

    render(){
        console.log(this.props)
        return (
        <Fragment>
            {this.props.mode === "portfolio"?
                <Fragment>
                    <div className="stock_card" onClick={this.triggerPopUp}>
                        <p className="stock_info">{this.props.stock.ticker} - {this.props.stock.quantity} Shares</p>
                        <p className="stock_info" style={{color: `${this.props.stock.color}`}}>${this.props.stock.value}</p>
                    </div>
                    {this.state.triggerComponent ?
                        <SellComponent stock={this.props.stock} triggerPopUp={this.triggerPopUp} /> :
                        null
                    }
                </Fragment>
                :
                <div className="stock_card">
                    <p className="stock_info">{this.props.stock.status} ({this.props.stock.ticker}) -</p>
                    <p className="stock_info">{this.props.stock.quantity} Shares @ {this.props.stock.price}</p>
                </div>
            }
        </Fragment>
        );
    }
}

function msp(state){
    return {
      currentUser: state.currentUser
    }
}

export default connect(msp, { setUser })(Stock)