import { Reducer, Action } from 'redux'


import { AuthorizeActionType } from '../constants/authorizeActionType'

import { Map } from 'immutable'

export let authorizeReducer = (state = Map(), action) => {
  const { payload } = action
  switch (action.type) {
    case AuthorizeActionType.LOGIN:
    return state
        .set('uid', payload.uid)
        .set('authed', true)
        .set('guest', false)
        .set('isVerified', payload.isVerified)
        .set('privateKey', payload.privateKey)
    case AuthorizeActionType.LOGOUT:
      return state
        .set('uid', 0)
        .set('authed', false)
        .set('guest', true)
        .set('isVerified', false)
    case AuthorizeActionType.SIGNUP:
      return state.set('uid', payload.userId).set('privateKey', payload.privateKey)
    case AuthorizeActionType.UPDATE_PASSWORD:
      return state
      .set('updatePassword', payload.updatePassword)
    default:
      return state
  }
}