// - Import react components
import moment from 'moment/moment'
import _ from 'lodash'
import { Map, fromJS } from 'immutable'

import { MessageActionType } from '../constants/messageActionType'

export let messageReducer = (state = Map({loaded: false}), action) => {
  let { payload } = action
  switch (action.type) {

    case MessageActionType.ADD:
      const uid = payload.toUser
      return state.setIn(['message', uid], payload)

    case MessageActionType.RECEIVE:
      const mergedMap = fromJS(payload).mergeDeep(state.get('message'))
      return state.set('message', mergedMap).set('loaded', true)
    default:
      return state

  }
}
