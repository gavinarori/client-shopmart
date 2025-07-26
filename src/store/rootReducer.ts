import homeReducer from './reducers/homeReducer'
import authReducer from './reducers/authReducer'
import cardReducer from './reducers/cardReducer'
import chatReducer from './reducers/chatReducer'
import paymentReducer from './reducers/paymentReducer'
import orderReducer from './reducers/orderReducer'

const rootReducers = {
    home: homeReducer,
    auth: authReducer,
    card: cardReducer,
    chat : chatReducer,
    payment: paymentReducer,
    order: orderReducer
}
export default rootReducers