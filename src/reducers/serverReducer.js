import _ from 'lodash'

import { ServerActionType } from '../constants/serverActionType'
import { Map } from 'immutable'

import { ServerRequestStatusType } from '../actions/serverRequestStatusType'


export let serverReducer = (state = Map(), action) => {
  let { payload } = action
  const request = (payload ? payload.request : {})
  switch (action.type) {

    case ServerActionType.ADD_REQUEST:
      return state
        .setIn(['request', request.id], request)

    case ServerActionType.DELETE_REQUEST:
      return state
        .deleteIn(['request', request.id])

    case ServerActionType.ERROR_REQUEST:
      return state
        .setIn(['request', request.id, 'status'], ServerRequestStatusType.Error)

    case ServerActionType.OK_REQUEST:
      return state
        .setIn(['request', request.id, 'status'], ServerRequestStatusType.OK)

    case ServerActionType.CLEAR_ALL_DATA_REQUEST:
      return Map()

    default:
      return state
  }
}