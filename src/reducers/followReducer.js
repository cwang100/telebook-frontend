
import moment from 'moment/moment'
import _ from 'lodash'
import { Map, List } from 'immutable'

import { FollowActionType } from '../constants/followActionType'

export let followReducer = (state = Map(), action) => {
  const { payload } = action
  switch (action.type) {
    case FollowActionType.ADD_FOLLOWING_USER:
      const user = payload.user
      let followList = state.get('followList') || {}
      followList[user.userId] = user
      return state.set('followList', followList)
    case FollowActionType.GET_FOLLOWING_USERS:
      const userList = payload.userList || []
      let newFollowList = {}
      userList.forEach((user) => {
        const id = user.id || user.userId || user.uid
        newFollowList[id] = user
      })

      return state.set('followList', newFollowList)
    case FollowActionType.DELETE_FOLLOWING_USER:
      return Map()
    case FollowActionType.SHOW_FOLLOWING_USER_LOADING:
      return state.set('followingLoadingStatus', true)
    case FollowActionType.HIDE_FOLLOWING_USER_LOADING:
      return state.set('followingLoadingStatus', false)
    default:
      return state
  }
}
