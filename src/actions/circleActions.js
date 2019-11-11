import * as moment from 'moment/moment'

import { CircleActionType } from '../constants/circleActionType'

import * as globalActions from './globalActions'
import * as userActions from './userActions'
import * as notifyActions from './notifyActions'
import * as serverActions from './serverActions'

import { UserTie } from '../class/circles'
import { ServerRequestStatusType } from './serverRequestStatusType'
import { ServerRequestType } from '../constants/serverRequestType'
import { ServerRequestModel } from '../class/server'

import { CircleService } from '../services'
import { UserTieService } from '../services'


let circleService = new CircleService()
let userTieService = new UserTieService()

export let dbAddCircle = (circleName) => {
  return (dispatch, getState) => {

    let uid = getState().authorize.get('uid')
    let circle = {
      creationDate: moment().unix(),
      name: circleName,
      isSystem : false,
      ownerId: uid
    }
    return circleService.addCircle(uid, circle).then((circleKey) => {
      circle.id = circleKey
      circle.ownerId = uid
      dispatch(addCircle(circle))

    }, (error) => dispatch(globalActions.showMessage(error.message)))
  }
}

export const dbFollowUser = (followingCircleId, userFollowing) => {
  return (dispatch, getState) => {
    const state = getState()
    let uid = state.authorize.get('uid')
    let user = { ...state.user.get('info').get(uid).toJS(), userId: uid }

    const followReqestModel = createFollowRequest(userFollowing.userId)
    dispatch(serverActions.sendRequest(followReqestModel))

    return userTieService.tieUseres(
      { userId: user.userId, fullName: user.fullName, avatar: user.avatar, approved: false },
      { userId: userFollowing.userId, fullName: userFollowing.fullName, avatar: userFollowing.avatar, approved: false },
      [followingCircleId]
    )
      .then(() => {
        dispatch(addFollowingUser(
          new UserTie(
            userFollowing.userId,
            moment().unix(),
            userFollowing.fullName,
            userFollowing.avatar,
            false,
            [followingCircleId]
        )))

        followReqestModel.status = ServerRequestStatusType.OK
        dispatch(serverActions.sendRequest(followReqestModel))

        dispatch(notifyActions.dbAddNotification(
          {
            description: `${user.fullName} follow you.`,
            url: `/${uid}`,
            notifyRecieverUserId: userFollowing.userId,
            notifierUserId: uid,
            isSeen: false
          }))
      })
      // }, (error) => {
      //   dispatch(globalActions.showMessage(error.message))

      //   followReqestModel.status = ServerRequestStatusType.Error
      //   dispatch(serverActions.sendRequest(followReqestModel))
      // })
  }
}

export let dbUpdateUserInCircles = (circleIdList, userFollowing) => {
  return (dispatch, getState) => {
    const state = getState()
    let uid = state.authorize.get('uid')
    let user = { ...state.user.get('info').get(uid).toJS() }

    const addToCircleRequest = createAddToCircleRequest(userFollowing.userId)
    dispatch(serverActions.sendRequest(addToCircleRequest))

    dispatch(globalActions.showMasterLoading())

    return userTieService.updateUsersTie(
      { userId: user.userId, fullName: user.fullName, avatar: user.avatar, approved: false },
      { userId: userFollowing.userId, fullName: userFollowing.fullName, avatar: userFollowing.avatar, approved: false },
      circleIdList
    )
      .then(() => {
        dispatch(addFollowingUser(
          new UserTie(
            userFollowing.userId,
            moment().unix(),
            userFollowing.fullName,
            userFollowing.avatar,
            false,
            circleIdList
        )))

        addToCircleRequest.status = ServerRequestStatusType.OK
        dispatch(serverActions.sendRequest(addToCircleRequest))

        dispatch(globalActions.hideMasterLoading())

        dispatch(closeSelectCircleBox(userFollowing.userId))

      }, (error) => {
        dispatch(globalActions.showMessage(error.message))

        dispatch(globalActions.hideMasterLoading())

        addToCircleRequest.status = ServerRequestStatusType.Error
        dispatch(serverActions.sendRequest(addToCircleRequest))
      })
  }
}

export let dbDeleteFollowingUser = (userFollowingId) => {
  return (dispatch, getState) => {
    let uid = getState().authorize.uid

    const deleteFollowingUserRequest = createdeleteFollowingUserRequest(userFollowingId)
    dispatch(serverActions.sendRequest(deleteFollowingUserRequest))

    dispatch(globalActions.showMasterLoading())

    return userTieService.removeUsersTie(uid, userFollowingId)
      .then(() => {
        dispatch(deleteFollowingUser(userFollowingId))

        dispatch(globalActions.hideMasterLoading())

        dispatch(closeSelectCircleBox(userFollowingId))

        deleteFollowingUserRequest.status = ServerRequestStatusType.OK
        dispatch(serverActions.sendRequest(deleteFollowingUserRequest))
      }, (error) => {
        dispatch(globalActions.showMessage(error.message))

        dispatch(globalActions.hideMasterLoading())

        dispatch(closeSelectCircleBox(userFollowingId))

        deleteFollowingUserRequest.status = ServerRequestStatusType.Error
        dispatch(serverActions.sendRequest(deleteFollowingUserRequest))
      })
  }
}

export const dbUpdateCircle = (newCircle) => {
  return (dispatch, getState) => {
    let uid = getState().authorize.get('uid')
    let circle = {...getState().circle.circleList[newCircle.id]}
    circle.name = newCircle.name
    return circleService.updateCircle(uid, newCircle.id, circle)
      .then(() => {
        dispatch(updateCircle({ id: newCircle.id, ...circle }))
      }, (error) => {
        dispatch(globalActions.showMessage(error.message))
      })
  }

}

export const dbDeleteCircle = (circleId) => {
  return (dispatch, getState) => {
    let uid = getState().authorize.get('uid')

    return circleService.deleteCircle(uid, circleId)
      .then(() => {
        dispatch(deleteCircle(circleId))
      }, (error) => {
        dispatch(globalActions.showMessage(error.message))
      })
  }

}

export const dbGetCircles = () => {
  return (dispatch, getState) => {
    let uid = getState().authorize.get('uid')
    if (uid) {

      return circleService.getCircles(uid)
        .then((circles) => {
          dispatch(addCircles(circles))
        })
        .catch((error) => {
          dispatch(globalActions.showMessage(error.message))
        })

    }
  }
}

/**
 *  Get all user ties from data base
 */
export const dbGetUserTies = () => {
  return (dispatch, getState) => {
    let uid = getState().authorize.uid
    if (uid) {
      userTieService.getUserTies(uid).then((result) => {

        dispatch(userActions.addPeopleInfo(result))
        dispatch(addUserTies(result))

      })
        .catch((error) => {
          dispatch(globalActions.showMessage(error.message))
        })
    }
  }
}

export const dbGetFollowers = () => {
  return (dispatch, getState) => {
    let uid = getState().authorize.get('uid')
    if (uid) {
      userTieService.getUserTieSender(uid).then((result) => {
        dispatch(userActions.addPeopleInfo(result))
        dispatch(addUserTieds(result))
      })
        .catch((error) => {
          dispatch(globalActions.showMessage(error.message))
        })
    }
  }
}

export const dbGetCirclesByUserId = (uid) => {
  return (dispatch, getState) => {

    if (uid) {
      return circleService.getCircles(uid)
        .then((circles) => {
          dispatch(addCircles(circles))
        })
        .catch((error) => {
          dispatch(globalActions.showMessage(error.message))
        })
    }
  }
}

const createFollowRequest = (userFollowingId) => {
  const requestId = ServerRequestType.CircleFollowUser + ':' + userFollowingId
  return new ServerRequestModel(
    ServerRequestType.CircleFollowUser,
    requestId,
    '',
    ServerRequestStatusType.Sent
    )
}

const createAddToCircleRequest = (userFollowingId) => {
  const requestId = ServerRequestType.CircleAddToCircle + ':' + userFollowingId
  return new ServerRequestModel(
    ServerRequestType.CircleAddToCircle,
    requestId,
    '',
    ServerRequestStatusType.Sent
    )
}

const createdeleteFollowingUserRequest = (userFollowingId) => {
  const requestId = ServerRequestType.CircleDeleteFollowingUser + ':' + userFollowingId
  return new ServerRequestModel(
    ServerRequestType.CircleDeleteFollowingUser,
    requestId,
    '',
    ServerRequestStatusType.Sent
    )
}

export const addCircle = (circle) => {
  return {
    type: CircleActionType.ADD_CIRCLE,
    payload: { circle }
  }
}

export const updateCircle = (circle) => {
  return {
    type: CircleActionType.UPDATE_CIRCLE,
    payload: { circle }
  }
}

export const deleteCircle = (circleId) => {
  return {
    type: CircleActionType.DELETE_CIRCLE,
    payload: { circleId }
  }
}

export const addCircles = (circleList) => {
  return {
    type: CircleActionType.ADD_LIST_CIRCLE,
    payload: { circleList }
  }
}

export const clearAllCircles = () => {
  return {
    type: CircleActionType.CLEAR_ALL_CIRCLES
  }
}

export const openCircleSettings = (circleId) => {
  return {
    type: CircleActionType.OPEN_CIRCLE_SETTINGS,
    payload: { circleId }
  }

}

export const closeCircleSettings = (circleId) => {
  return {
    type: CircleActionType.CLOSE_CIRCLE_SETTINGS,
    payload: { circleId }
  }

}

export const addFollowingUser = (userTie) => {
  return {
    type: CircleActionType.ADD_FOLLOWING_USER,
    payload: { userTie }
  }
}

export const updateUserTie = (userTie) => {
  return {
    type: CircleActionType.UPDATE_USER_TIE,
    payload: { userTie }
  }
}

export const addUserTies = (userTies) => {
  return {
    type: CircleActionType.ADD_USER_TIE_LIST,
    payload: { userTies }
  }
}

export const addUserTieds = (userTieds) => {
  return {
    type: CircleActionType.ADD_USER_TIED_LIST,
    payload: { userTieds }
  }
}

export const deleteUserFromCircle = (userId, circleId) => {
  return {
    type: CircleActionType.DELETE_USER_FROM_CIRCLE,
    payload: { userId, circleId }
  }
}

export const deleteFollowingUser = (userId) => {
  return {
    type: CircleActionType.DELETE_FOLLOWING_USER,
    payload: { userId }
  }
}

export const showSelectCircleBox = (userId) => {
  return {
    type: CircleActionType.SHOW_SELECT_CIRCLE_BOX,
    payload: { userId }
  }

}

export const hideSelectCircleBox = (userId) => {
  return {
    type: CircleActionType.HIDE_SELECT_CIRCLE_BOX,
    payload: { userId }
  }
}


export const showFollowingUserLoading = (userId) => {
  return {
    type: CircleActionType.SHOW_FOLLOWING_USER_LOADING,
    payload: { userId }
  }

}

/**
 * Set current user selected circles for referer user
 */
export const setSelectedCircles = (userId, circleList) => {
  return {
    type: CircleActionType.SET_SELECTED_CIRCLES_USER_BOX_COMPONENT,
    payload: { userId, circleList }
  }

}

/**
 * Remove current user selected circles for referer user
 */
export const removeSelectedCircles = (userId) => {
  return {
    type: CircleActionType.REMOVE_SELECTED_CIRCLES_USER_BOX_COMPONENT,
    payload: { userId }
  }
}

/**
 * Open select circle box
 */
export const openSelectCircleBox = (userId) => {
  return {
    type: CircleActionType.OPEN_SELECT_CIRCLES_USER_BOX_COMPONENT,
    payload: { userId}
  }

}

export const closeSelectCircleBox = (userId) => {
  return {
    type: CircleActionType.CLOSE_SELECT_CIRCLES_USER_BOX_COMPONENT,
    payload: { userId}
  }

}

/**
 * Hide loading on following user
 */
export const hideFollowingUserLoading = (userId) => {
  return {
    type: CircleActionType.HIDE_FOLLOWING_USER_LOADING,
    payload: { userId }
  }
}
