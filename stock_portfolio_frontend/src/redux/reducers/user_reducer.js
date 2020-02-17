const defaultState = {
    currentUser: null
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
      default:
        return prevState
    }
  }
  
  export default userReducer
