const defaultState = {
    currentUser: null,
    portfolio: null,
    transactions: []
  }
  
  function userReducer(prevState = defaultState, action){
    switch(action.type){
      case "SET_USER":
        return {...prevState, currentUser: action.payload.user}
      case "UPDATE_BALANCE":
        return {
          ...prevState, 
          currentUser: {
            ...prevState.currentUser,
            balance: action.payload.balance
          }
        }
      case "UPDATE_PORTFOLIO":
        return {
          ...prevState, 
          portfolio: action.payload.portfolio
        }
      case "SET_TRANSACTIONS":
        return {
          ...prevState, 
          transactions: action.payload.transactions
        }
      case "UPDATE_TRANSACTIONS":
        return {
          ...prevState, 
          transactions: [
            ...prevState.transactions,
            action.payload.transaction
          ]
        }
      default:
        return prevState
    }
  }
  
  export default userReducer
