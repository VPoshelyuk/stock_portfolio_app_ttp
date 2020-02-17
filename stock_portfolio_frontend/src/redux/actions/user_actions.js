export function setUser(newUser){
    return {type: "SET_USER", payload: {user: newUser}}
}

export function updateBalance(newBalance){
    return {type: "UPDATE_BALANCE", payload: {balance: newBalance}}
}