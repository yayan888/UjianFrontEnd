export const historyReducer = (state = [], action) => {
    switch(action.type){
        case 'HISTORY_TRANSACTION' :
            return action.payload
        case 'CLEAR_HISTORY':
            return []
        default : 
            return state
    }
}