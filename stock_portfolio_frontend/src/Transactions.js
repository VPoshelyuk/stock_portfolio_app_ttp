import React, {Fragment} from "react";
import { Redirect } from "react-router-dom"

import StocksContainer from './StocksContainer'

export default class Transactions extends React.Component{

    render(){
        return (
            <Fragment>
                <div className="portfolio_main">
                    <div className="stocks_info">
                        <StocksContainer mode={"transactions"} />
                    </div>
                    <div className="buy_info">
                    </div>
                </div>
            </Fragment>
        );
    }
}
