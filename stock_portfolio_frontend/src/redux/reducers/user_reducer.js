const defaultState = {
    currentUser: null
  }
  
  function userReducer(prevState = defaultState, action){
    switch(action.type){
      case "SET_USER":
        return {...prevState, currentUser: action.payload.user}
      default:
        return prevState
    }
  
  }
  
  export default userReducer
