export function setUser(newUser){
    return {type: "SET_USER", payload: {user: newUser}}
}

export function updateBalance(newBalance){
    return {type: "UPDATE_BALANCE", payload: {balance: newBalance}}
}

export function updatePortfolio(portfolio){
    return {type: "UPDATE_PORTFOLIO", payload: {portfolio: portfolio}}
}

export function updateTransactions(transactions){
    return {type: "UPDATE_TRANSACTIONS", payload: {transactions: transactions}}
}