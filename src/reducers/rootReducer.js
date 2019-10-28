import { combineReducers } from 'redux'

// - Import reducers
import { authorizeReducer } from './authorizeReducer'
import { circleReducer } from './circleReducer'
import { globalReducer } from './globalReducer'
import { notificationReducer } from './notificationReducer'
import { postReducer } from './postReducer'
import { userReducer } from './userReducer'
import { serverReducer } from './serverReducer'
import { connectRouter } from 'connected-react-router'

export const rootReducer = (history) => combineReducers({
    post: postReducer,
    circle: circleReducer,
    server: serverReducer,
    authorize: authorizeReducer,
    router: connectRouter(history),
    user: userReducer,
    notify: notificationReducer,
    global: globalReducer
  })