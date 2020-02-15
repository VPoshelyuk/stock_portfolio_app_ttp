import React, {Fragment, useState} from "react";
import { connect } from 'react-redux'
import { setUser} from './redux/actions/user_actions'

import SellComponent from './SellComponent'

const Stock = ({stock, mode}) => {
    const [triggerComponent, setTriggerComponent] = useState(false)

    const triggerPopUp = () => {
        setTriggerComponent(!triggerComponent)
    }
    return (
        <Fragment>
            {mode === "portfolio"?
                <Fragment>
                    <div className="stock_card" onClick={triggerPopUp}>
                        <p className="stock_info">{stock.ticker} - {stock.quantity} Shares</p>
                        <p className="stock_info" style={{color: `${stock.color}`}}>${stock.value}</p>
                    </div>
                    {triggerComponent ?
                        <SellComponent stock={stock} triggerPopUp={triggerPopUp} /> :
                        null
                    }
                </Fragment>
                :
                <div className="stock_card">
                    <p className="stock_info">{stock.status} ({stock.ticker}) -</p>
                    <p className="stock_info">{stock.quantity} Shares @ {stock.price}</p>
                </div>
            }
        </Fragment>
    );
}

function msp(state){
    return {
      currentUser: state.currentUser
    }
}

export default connect(msp, { setUser })(Stock)