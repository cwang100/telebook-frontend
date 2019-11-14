import { combineReducers } from 'redux'

// - Import reducers
import { authorizeReducer } from './authorizeReducer'
import { followReducer } from './followReducer'
import { globalReducer } from './globalReducer'
import { notificationReducer } from './notificationReducer'
import { postReducer } from './postReducer'
import { userReducer } from './userReducer'
import { serverReducer } from './serverReducer'
import { connectRouter } from 'connected-react-router'

export const rootReducer = (history) => combineReducers({
    post: postReducer,
    follow: followReducer,
    server: serverReducer,
    authorize: authorizeReducer,
    router: connectRouter(history),
    user: userReducer,
    notify: notificationReducer,
    global: globalReducer
  })