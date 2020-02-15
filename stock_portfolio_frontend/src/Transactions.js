import React, {Fragment} from "react";

import StocksContainer from './StocksContainer'

const Transactions = () =>{
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

export default Transactions