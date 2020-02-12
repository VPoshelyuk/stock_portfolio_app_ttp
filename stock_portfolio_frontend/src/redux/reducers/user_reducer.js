const defaultState = {
    currentUser: null,
    portfolio: null,
    transactions: null
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
      case "UPDATE_TRANSACTIONS":
          return {
            ...prevState, 
            transactions: action.payload.transactions
          }
      default:
        return prevState
    }
  }
  
  export default userReducer
