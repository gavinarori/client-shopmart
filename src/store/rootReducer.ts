import homeReducer from './reducers/homeReducer'
import authReducer from './reducers/authReducer'
import cardReducer from './reducers/cardReducer'
import chatReducer from './reducers/chatReducer'

const rootReducers = {
    home: homeReducer,
    auth: authReducer,
    card: cardReducer,
    chat : chatReducer,
}
export default rootReducers