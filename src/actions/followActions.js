import * as moment from 'moment/moment'

import { FollowActionType } from '../constants/followActionType'

import * as globalActions from './globalActions'
import * as userActions from './userActions'
import * as notifyActions from './notifyActions'
import * as serverActions from './serverActions'

import { FollowService, UserService } from '../services'


const followService = new FollowService()
const userService = new UserService() 

export const dbFollowUser = (userFollowing) => {
  return (dispatch, getState) => {
    const state = getState()
    let uid = state.authorize.get('uid')
    let user = { ...state.user.get('info').get(uid).toJS(), userId: uid }
    let secondId = userFollowing.userId || userFollowing.id || userFollowing.uid
    dispatch(showFollowingUserLoading())
    return followService.addFollow(uid, secondId).then((result) => {
      dispatch(addFollowingUser(userFollowing))

      dispatch(notifyActions.dbAddNotification(
        {
          description: `${user.fullName} follow you.`,
          url: `/${uid}`,
          notifyRecieverUserId: secondId,
          notifierUserId: uid,
          isSeen: false
        }
      ))
      dispatch(hideFollowingUserLoading())
    })
  }
}

export const dbGetFollowingUsers = () => {
  return (dispatch, getState) => {
    let uid = getState().authorize.get('uid')
    if (uid) {
      dispatch(showFollowingUserLoading())
      followService.getAllFollowers(uid).then((result) => {
        let userList = []
        result.forEach((uid) => {
          userList.push(userService.getUserProfile(uid))
        }) 
        Promise.all(userList).then((result) => {
          dispatch(getFollowingUsers(result))
          dispatch(hideFollowingUserLoading())
        })
      })
      // .catch((error) => {
      //   dispatch(globalActions.showMessage(error.message))
      // })
    }
  }
}

export const addFollowingUser = (user) => {
  return {
    type: FollowActionType.ADD_FOLLOWING_USER,
    payload: { user }
  }
}

export const deleteFollowingUser = () => {
  return {
    type: FollowActionType.DELETE_FOLLOWING_USER,
    payload: { }
  }
}

export const getFollowingUsers = (userList) => {
  return {
    type: FollowActionType.GET_FOLLOWING_USERS,
    payload: { userList }
  }

}

export const showFollowingUserLoading = () => {
  return {
    type: FollowActionType.SHOW_FOLLOWING_USER_LOADING,
    payload: { }
  }
}

export const hideFollowingUserLoading = () => {
  return {
    type: FollowActionType.HIDE_FOLLOWING_USER_LOADING,
    payload: { }
  }
}
