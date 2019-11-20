// - Import react components
import moment from 'moment/moment'
import _ from 'lodash'
import { Map, fromJS } from 'immutable'

import { MessageActionType } from '../constants/messageActionType'

export let messageReducer = (state = Map({loaded: false}), action) => {
  let { payload } = action
  switch (action.type) {
    case MessageActionType.ADD:
      return state

    case MessageActionType.RECEIVE:
      return state.set('message', fromJS(payload)).set('loaded', true)
    default:
      return state
  }
}
