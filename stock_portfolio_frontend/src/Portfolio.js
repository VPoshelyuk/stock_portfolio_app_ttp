import React, {Fragment} from "react"

import BuyComponent from './BuyComponent'
import StocksContainer from './StocksContainer'

const Portfolio = () => {
    return (
        <Fragment>
            <div className="portfolio_main">
                <div className="stocks_info">
                    <StocksContainer mode={"portfolio"} />
                </div>
                <div className="buy_info">
                    <BuyComponent />
                </div>
            </div>
        </Fragment>
    );
}

export default Portfolio
