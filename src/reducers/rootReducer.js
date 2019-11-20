import { combineReducers } from 'redux'

import { authorizeReducer } from './authorizeReducer'
import { followReducer } from './followReducer'
import { globalReducer } from './globalReducer'
import { messageReducer } from './messageReducer'
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
    message: messageReducer,
    notify: notificationReducer,
    global: globalReducer
  })